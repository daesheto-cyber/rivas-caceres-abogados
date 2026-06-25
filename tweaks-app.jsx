/* Tweaks island — drives CSS variables on :root. The page itself stays vanilla. */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "Dorado",
  "headingFont": "Spectral",
  "bgTone": "Cálido",
  "heroOverlay": 0.62
}/*EDITMODE-END*/;

const ACCENTS = {
  "Dorado":  { gold: "#b08d4f", soft: "#c2a368", tint: "rgba(176,141,79,0.14)" },
  "Platino": { gold: "#8d97a3", soft: "#aab2bc", tint: "rgba(141,151,163,0.16)" },
  "Bronce":  { gold: "#a4683a", soft: "#bd8455", tint: "rgba(164,104,58,0.15)" }
};
const HEADING_FONTS = {
  "Spectral":    "'Spectral', Georgia, serif",
  "Cormorant":   "'Cormorant Garamond', Georgia, serif",
  "Libre Caslon":"'Libre Caslon Display', Georgia, serif"
};
const BG_TONES = {
  "Cálido":  { paper: "#f7f5f0", paper2: "#fbfaf6", line: "#e4e0d6", line2: "#d8d3c6" },
  "Neutro":  { paper: "#f4f5f7", paper2: "#fafbfc", line: "#e3e6ea", line2: "#d6dae0" }
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    const r = document.documentElement.style;
    const a = ACCENTS[t.accent] || ACCENTS["Dorado"];
    r.setProperty("--gold", a.gold);
    r.setProperty("--gold-soft", a.soft);
    r.setProperty("--gold-tint", a.tint);

    r.setProperty("--serif", HEADING_FONTS[t.headingFont] || HEADING_FONTS["Spectral"]);

    const b = BG_TONES[t.bgTone] || BG_TONES["Cálido"];
    r.setProperty("--paper", b.paper);
    r.setProperty("--paper-2", b.paper2);
    r.setProperty("--line", b.line);
    r.setProperty("--line-2", b.line2);

    r.setProperty("--hero-overlay", String(t.heroOverlay));
  }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Identidad" />
      <TweakRadio label="Metal de acento" value={t.accent}
        options={["Dorado", "Platino", "Bronce"]}
        onChange={(v) => setTweak("accent", v)} />
      <TweakSelect label="Tipografía de titulares" value={t.headingFont}
        options={["Spectral", "Cormorant", "Libre Caslon"]}
        onChange={(v) => setTweak("headingFont", v)} />
      <TweakSection label="Atmósfera" />
      <TweakRadio label="Tono de fondo" value={t.bgTone}
        options={["Cálido", "Neutro"]}
        onChange={(v) => setTweak("bgTone", v)} />
      <TweakSlider label="Oscuridad del hero" value={t.heroOverlay} min={0.3} max={0.85} step={0.01}
        onChange={(v) => setTweak("heroOverlay", v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("tweaks-root")).render(<App />);
