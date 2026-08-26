export interface WhatsAppWidgetConfig {
  /** Número en formato internacional sin espacios ni símbolos, ej. "573001034718" */
  phone: string;
  businessName: string;
  /** URL de la foto de perfil. Si se omite se muestran las iniciales. */
  avatarSrc?: string;
  /** Iniciales de respaldo cuando no hay avatarSrc (máx. 2 chars). */
  avatarInitials?: string;
  /** Mensaje pre-escrito que aparece después del indicador de escritura. */
  welcomeMessage: string;
  /** Placeholder del textarea del usuario. */
  inputPlaceholder: string;
  /** Texto de estado bajo el nombre del negocio. */
  statusText?: string;
  /** Milisegundos que dura el indicador "escribiendo..." antes de mostrar el mensaje. */
  typingDelay?: number;
}

const config: WhatsAppWidgetConfig = {
  phone: '573001034718',
  businessName: 'Rivas Cáceres Abogados',
  avatarInitials: 'RC',
  welcomeMessage:
    '¡Hola! 👋 ¿En qué podemos ayudarte hoy? Cuéntanos tu caso y con gusto te orientamos.',
  inputPlaceholder: 'Escribe tu mensaje...',
  statusText: 'Normalmente responde en minutos',
  typingDelay: 800,
};

export default config;
