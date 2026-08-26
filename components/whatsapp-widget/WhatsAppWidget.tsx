'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import defaultConfig, { type WhatsAppWidgetConfig } from './whatsapp-widget.config';
import { buildWhatsAppLink } from './utils';

const SESSION_KEY = 'waw-seen';
const DIALOG_ID = 'whatsapp-chat-dialog';

interface WhatsAppWidgetProps {
  /** Sobrescribe el config por defecto — útil para reutilizar en otros clientes. */
  config?: WhatsAppWidgetConfig;
}

export default function WhatsAppWidget({ config: propConfig }: WhatsAppWidgetProps) {
  const cfg = propConfig ?? defaultConfig;
  const typingDelay = cfg.typingDelay ?? 800;

  const [isOpen, setIsOpen] = useState(false);
  const [hasBadge, setHasBadge] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [message, setMessage] = useState('');

  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Badge: visible solo la primera vez por sesión
  useEffect(() => {
    if (!sessionStorage.getItem(SESSION_KEY)) setHasBadge(true);
  }, []);

  // Atributo inert: evita que el foco alcance elementos ocultos
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (isOpen) {
      el.removeAttribute('inert');
    } else {
      el.setAttribute('inert', '');
    }
  }, [isOpen]);

  // Animación de escritura → mensaje de bienvenida
  useEffect(() => {
    if (!isOpen) {
      setIsTyping(false);
      setShowWelcome(false);
      return;
    }
    setIsTyping(true);
    setShowWelcome(false);
    const timer = setTimeout(() => {
      setIsTyping(false);
      setShowWelcome(true);
    }, typingDelay);
    return () => clearTimeout(timer);
  }, [isOpen, typingDelay]);

  // Foco al textarea cuando aparece el mensaje de bienvenida
  useEffect(() => {
    if (showWelcome) inputRef.current?.focus();
  }, [showWelcome]);

  // Focus trap + Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (e.key !== 'Tab' || !dialogRef.current) return;

    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  useEffect(() => {
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  function openChat() {
    setIsOpen(true);
    setHasBadge(false);
    sessionStorage.setItem(SESSION_KEY, '1');
  }

  function closeChat() {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  function handleSend() {
    const url = buildWhatsAppLink(cfg.phone, message);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function autoResize(e: React.FormEvent<HTMLTextAreaElement>) {
    const el = e.currentTarget;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  }

  const avatarLabel = cfg.avatarInitials ?? cfg.businessName.slice(0, 2).toUpperCase();

  return (
    <>
      {/* Backdrop móvil — cierra al tocar fuera de la tarjeta */}
      <div
        onClick={closeChat}
        aria-hidden="true"
        className={[
          'fixed inset-0 z-40 bg-black/30 sm:hidden',
          'transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      />

      {/* Tarjeta de chat */}
      <div
        ref={dialogRef}
        id={DIALOG_ID}
        role="dialog"
        aria-modal="true"
        aria-label={`Chat de WhatsApp con ${cfg.businessName}`}
        aria-hidden={!isOpen}
        className={[
          // Base
          'fixed z-50 flex flex-col overflow-hidden bg-white shadow-2xl',
          'transition-all duration-300 ease-out will-change-transform',
          // Mobile: bottom-sheet ancho completo
          'bottom-0 left-0 right-0 max-h-[85vh] rounded-t-2xl',
          // Desktop: card flotante sobre el botón
          'sm:bottom-[88px] sm:right-6 sm:left-auto sm:w-[350px] sm:max-h-none sm:rounded-2xl',
          // Visibilidad
          isOpen
            ? 'opacity-100 pointer-events-auto translate-y-0 scale-100'
            : 'opacity-0 pointer-events-none translate-y-4 sm:translate-y-0 sm:scale-95',
        ].join(' ')}
      >
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex flex-shrink-0 items-center gap-3 bg-[#075E54] px-4 py-3">
          {/* Avatar */}
          <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#128C7E] text-sm font-semibold text-white">
            {cfg.avatarSrc ? (
              <img src={cfg.avatarSrc} alt="" className="h-full w-full object-cover" />
            ) : (
              <span aria-hidden="true">{avatarLabel}</span>
            )}
            {/* Punto "en línea" */}
            <span
              aria-hidden="true"
              className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#075E54] bg-[#25D366]"
            />
          </div>

          {/* Nombre y estado */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold leading-tight text-white">
              {cfg.businessName}
            </p>
            <p className="text-xs text-[#dcf8c6]">
              {cfg.statusText ?? 'Normalmente responde en minutos'}
            </p>
          </div>

          {/* Cerrar */}
          <button
            onClick={closeChat}
            aria-label="Cerrar chat"
            className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* ── Área de mensajes ────────────────────────────────────── */}
        <div
          className="flex flex-1 flex-col gap-2 overflow-y-auto bg-[#ece5dd] px-4 py-4"
          style={{ minHeight: 128 }}
          aria-live="polite"
          aria-label="Mensajes"
        >
          {/* Indicador de escritura */}
          {isTyping && (
            <div
              role="status"
              aria-label="Escribiendo..."
              className="flex w-fit items-center gap-1.5 rounded-2xl rounded-tl-sm bg-white px-3.5 py-3 shadow-sm"
            >
              {(['-0.3s', '-0.15s', '0s'] as const).map((delay, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: delay }}
                />
              ))}
            </div>
          )}

          {/* Burbuja de bienvenida */}
          {showWelcome && (
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-2.5 text-sm leading-relaxed text-gray-800 shadow-sm">
              {cfg.welcomeMessage}
            </div>
          )}
        </div>

        {/* ── Input ───────────────────────────────────────────────── */}
        <div className="flex flex-shrink-0 items-end gap-2 bg-[#f0f2f5] px-3 py-3">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onInput={autoResize}
            placeholder={cfg.inputPlaceholder}
            rows={1}
            aria-label="Tu mensaje"
            className="flex-1 resize-none overflow-y-auto rounded-3xl bg-white px-4 py-2.5 text-sm leading-snug text-gray-800 placeholder-gray-400 outline-none"
            style={{ maxHeight: 96 }}
          />
          <button
            onClick={handleSend}
            aria-label="Enviar mensaje por WhatsApp"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm transition-colors hover:bg-[#128C7E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
          >
            <svg
              className="h-5 w-5 translate-x-0.5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Botón flotante ──────────────────────────────────────────── */}
      <button
        ref={triggerRef}
        onClick={isOpen ? closeChat : openChat}
        aria-label={isOpen ? 'Cerrar chat de WhatsApp' : 'Abrir chat de WhatsApp'}
        aria-expanded={isOpen}
        aria-controls={DIALOG_ID}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-200 hover:bg-[#128C7E] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#25D366]"
      >
        {/* Ícono WhatsApp — visible cuando el chat está cerrado */}
        <svg
          className={[
            'absolute h-7 w-7 transition-all duration-200',
            isOpen ? 'scale-50 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100',
          ].join(' ')}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.523 5.855L.057 23.882a.5.5 0 00.606.63l6.102-1.598A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.876 9.876 0 01-5.031-1.378l-.36-.214-3.733.979.996-3.638-.235-.374A9.861 9.861 0 012.1 12C2.1 6.533 6.533 2.1 12 2.1c5.467 0 9.9 4.433 9.9 9.9 0 5.467-4.433 9.9-9.9 9.9z" />
        </svg>

        {/* Ícono X — visible cuando el chat está abierto */}
        <svg
          className={[
            'absolute h-6 w-6 transition-all duration-200',
            isOpen ? 'scale-100 rotate-0 opacity-100' : 'scale-50 -rotate-90 opacity-0',
          ].join(' ')}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>

        {/* Badge de notificación */}
        {hasBadge && (
          <span
            aria-hidden="true"
            className="absolute right-0.5 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-red-500"
          />
        )}
      </button>
    </>
  );
}
