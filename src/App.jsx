import { useState, useEffect } from "react";

const CDN = "https://1384583348.rsc.cdn77.org/bitepal-funnel/assets";
const CDN2 = "https://1204181278.rsc.cdn77.org/bitepal-funnel";

// TODO: Conectar con API real: http://questionary.reonboarding.rocks/api/v1/questionary/projects/Bitepal/branches/ggl
// TODO: Implementar A/B testing para features: new_paywall, pw_product_card_var1, stripe_express, etc.
// TODO: Integrar Stripe Express Checkout y Yuno Express para pagos reales

const COLORS = {
  primary: "#4CAF82",
  primaryDark: "#3a9e6f",
  primaryLight: "#e8f5ee",
  accent: "#FF6B35",
  bg: "#ffffff",
  bgLight: "#ededf2",
  text: "#1a1a2e",
  textLight: "#6b7280",
  textMuted: "#9ca3af",
  border: "#e5e7eb",
  borderSelected: "#4CAF82",
  card: "#ffffff",
  cardHover: "#f0faf4",
  warning: "#f59e0b",
  error: "#ef4444",
  star: "#fbbf24",
};

const FONT = "'Bricolage Grotesque', 'Inter', system-ui, sans-serif";

// ---- QUIZ STEPS DATA ----
const steps = [
  {
    id: "gender",
    type: "gender",
    title: "¿Cuál es tu género?",
    subtitle: "Esto nos ayuda a personalizar tu plan",
    options: [
      { value: "female", label: "Mujer", emoji: "♀️" },
      { value: "male", label: "Hombre", emoji: "♂️" },
    ],
  },
  {
    id: "age",
    type: "age",
    title: "¿Cuál es tu grupo de edad?",
    subtitle: "Los planes de pérdida de peso varían según la edad",
    options: [
      { value: "18-24", label: "18–24" },
      { value: "25-34", label: "25–34" },
      { value: "35-45", label: "35–45" },
      { value: "46+", label: "46+" },
    ],
  },
  {
    id: "goal",
    type: "single",
    title: "¿Cuál es tu objetivo principal?",
    subtitle: "Selecciona el que mejor te describe",
    options: [
      { value: "lose_weight", label: "Perder peso", emoji: "⚖️" },
      { value: "get_fit", label: "Ponerme en forma", emoji: "💪" },
      { value: "eat_healthy", label: "Comer más saludable", emoji: "🥗" },
      { value: "boost_energy", label: "Tener más energía", emoji: "⚡" },
    ],
  },
  {
    id: "current_body",
    type: "body_current",
    title: "¿Cuál describe mejor tu cuerpo actual?",
    subtitle: "Sé honesto/a contigo mismo/a para obtener mejores resultados",
  },
  {
    id: "target_body",
    type: "body_target",
    title: "¿Cómo quieres que se vea tu cuerpo?",
    subtitle: "Tu objetivo nos ayuda a diseñar tu plan",
  },
  {
    id: "target_zones",
    type: "multi",
    title: "¿En qué zonas quieres concentrarte?",
    subtitle: "Puedes seleccionar más de una",
    gender_options: {
      female: [
        { value: "belly", label: "Abdomen", img: `${CDN}/target_zone_belly_female.BYo3gZ7_.webp` },
        { value: "arms", label: "Brazos", img: `${CDN}/target_zone_arms_female.DrWOmxB4.webp` },
        { value: "hips", label: "Caderas", img: `${CDN}/target_zone_hips_female.BKwn9xrk.webp` },
        { value: "butt", label: "Glúteos", img: `${CDN}/target_zone_butt_female.CA37oyQY.webp` },
        { value: "chest", label: "Pecho", img: `${CDN}/target_zone_chestt_female.BhpdY4rI.webp` },
        { value: "legs", label: "Piernas", img: `${CDN}/target_zone_legs_female.BM_yfn_b.webp` },
      ],
      male: [
        { value: "belly", label: "Abdomen", img: `${CDN}/target_zone_belly_male.CplNAaPX.webp` },
        { value: "butt", label: "Glúteos", img: `${CDN}/target_zone_butt_male.anKpF_od.webp` },
        { value: "chest", label: "Pecho", img: `${CDN}/target_zone_chest_male.CuH3Jd0t.webp` },
        { value: "legs", label: "Piernas", img: `${CDN}/target_zone_legs_male.DW2R7HUg.webp` },
      ],
    },
  },
  {
    id: "social_proof",
    type: "social_proof",
    title: "Más de 2 millones de personas confían en BitePal",
    subtitle: "Personas como tú ya están transformando su vida",
  },
  {
    id: "activity",
    type: "single",
    title: "¿Cuál es tu nivel de actividad?",
    subtitle: "Sé honesto/a para calibrar mejor tu plan",
    options: [
      { value: "sedentary", label: "Sedentario (poco o ningún ejercicio)", emoji: "🛋️" },
      { value: "light", label: "Ligero (1–3 días/semana)", emoji: "🚶" },
      { value: "moderate", label: "Moderado (3–5 días/semana)", emoji: "🏃" },
      { value: "active", label: "Muy activo (6–7 días/semana)", emoji: "🏋️" },
    ],
  },
  {
    id: "diet",
    type: "single",
    title: "¿Tienes alguna preferencia alimentaria?",
    subtitle: "Tu plan se adaptará a tus preferencias",
    options: [
      { value: "everything", label: "Como de todo", emoji: "🍽️" },
      { value: "vegetarian", label: "Vegetariano", emoji: "🥦" },
      { value: "vegan", label: "Vegano", emoji: "🌱" },
      { value: "keto", label: "Keto / Low carb", emoji: "🥑" },
      { value: "mediterranean", label: "Mediterráneo", emoji: "🫒" },
    ],
  },
  {
    id: "eating_habits",
    type: "multi",
    title: "¿Cuáles son tus hábitos alimenticios actuales?",
    subtitle: "Selecciona todos los que apliquen",
    options: [
      { value: "eat_at_home", label: "Como en casa", emoji: "🏠" },
      { value: "eat_out", label: "Como fuera frecuentemente", emoji: "🍔" },
      { value: "skip_meals", label: "Salteo comidas", emoji: "⏰" },
      { value: "snack_often", label: "Como snacks frecuentemente", emoji: "🍪" },
      { value: "emotional_eating", label: "Como por emociones", emoji: "😔" },
      { value: "sugar_cravings", label: "Tengo antojos de azúcar", emoji: "🍬" },
    ],
  },
  {
    id: "habits_info",
    type: "info_card",
    image: `${CDN}/habits_with_BitePal_es.yJT83A9v.webp`,
    title: "Construir hábitos saludables con BitePal",
    text: "BitePal te ayuda a crear hábitos alimenticios sostenibles que funcionan a largo plazo — sin dietas restrictivas.",
  },
  {
    id: "water",
    type: "single",
    title: "¿Cuánta agua bebes al día?",
    subtitle: "La hidratación es clave para tu metabolismo",
    options: [
      { value: "less_1l", label: "Menos de 1 litro", emoji: "💧" },
      { value: "1_2l", label: "1–2 litros", emoji: "💧💧" },
      { value: "more_2l", label: "Más de 2 litros", emoji: "💧💧💧" },
    ],
  },
  {
    id: "sleep",
    type: "single",
    title: "¿Cuántas horas duermes por noche?",
    subtitle: "El sueño afecta directamente tu metabolismo",
    options: [
      { value: "less_6", label: "Menos de 6 horas", emoji: "😴" },
      { value: "6_7", label: "6–7 horas", emoji: "🌙" },
      { value: "7_8", label: "7–8 horas", emoji: "⭐" },
      { value: "more_8", label: "Más de 8 horas", emoji: "🌟" },
    ],
  },
  {
    id: "height_weight",
    type: "measurements",
    title: "¿Cuáles son tus medidas actuales?",
    subtitle: "Para calcular tu IMC y metas personalizadas",
  },
  {
    id: "target_weight",
    type: "target_weight",
    title: "¿Cuál es tu peso objetivo?",
    subtitle: "Te ayudaremos a llegar a tu meta de forma saludable",
  },
  {
    id: "analyzing",
    type: "loading",
    title: "Analizando tus respuestas...",
    subtitle: "Creando tu plan personalizado",
  },
  {
    id: "result",
    type: "result",
    title: "¡Tu plan personalizado está listo!",
  },
];

// ---- BODY OPTIONS DATA ----
const bodyOptions = {
  current: {
    female: [
      { value: "regular", label: "Regular", img: `${CDN}/body_current_regular_male.Bms_fp2g.webp` },
      { value: "flabby", label: "Algo de grasa", img: `${CDN}/body_current_flabby_female.lYjcCvVK.webp` },
      { value: "extra", label: "Sobrepeso", img: `${CDN}/body_current_extra_female.Bouc7izy.webp` },
      { value: "shapely", label: "Curvilínea", img: `${CDN}/body_current_shapely_female.WOOmmx4X.webp` },
    ],
    male: [
      { value: "regular", label: "Regular", img: `${CDN}/body_current_regular_male.Bms_fp2g.webp` },
      { value: "flabby", label: "Algo de grasa", img: `${CDN}/body_current_flabby_male.BO-U-xWU.webp` },
      { value: "extra", label: "Sobrepeso", img: `${CDN}/body_current_extra_male.DPG8hUM7.webp` },
      { value: "shapely", label: "Musculoso", img: `${CDN}/body_current_shapely_male.Boffpitk.webp` },
    ],
  },
  target: {
    female: [
      { value: "fit", label: "En forma", img: `${CDN}/body_target_fit_female.DullmeDy.webp` },
      { value: "athletic", label: "Atlética", img: `${CDN}/body_target_athletic_female.BVROhJko.webp` },
    ],
    male: [
      { value: "fit", label: "En forma", img: `${CDN}/body_target_fit_male.DKtAx4Ce.webp` },
      { value: "athletic", label: "Atlético", img: `${CDN}/body_target_athletic_male.u-sU7F4B.webp` },
    ],
  },
};

// ---- AGE IMAGES ----
const ageImages = {
  female: {
    "18-24": `${CDN}/Age_Female_ 18–24.qjoHZs3k.webp`,
    "25-34": `${CDN}/Age_Female_ 25–34.doV-ada2.webp`,
    "35-45": `${CDN}/Age_Female_ 35–45.BnSxqeSz.webp`,
    "46+": `${CDN}/Age_Female_ 46_.zHIS1EB4.webp`,
  },
  male: {
    "18-24": `${CDN}/Age_Male_ 18–24.C0B3Fcoq.webp`,
    "25-34": `${CDN}/Age_Male_ 25–34.BXIyzzxB.webp`,
    "35-45": `${CDN}/Age_Male_ 35–45.BitSxMBh.webp`,
    "46+": `${CDN}/Age_Male_ 46_.BHa4wXNF.webp`,
  },
};

// ---- REVIEWS ----
const reviews = [
  {
    name: "A. Z.",
    rating: 5,
    text: "Perdí 2 kg en una semana usando esta app. Hice algo de ejercicio aparte, pero no sentí que fuera difícil mantenerme constante gracias a esta app. BitePal me ayudó a entender mejor mi consumo de calorías y cuáles son las comidas más adecuadas para mi cuerpo, sin tener que dejar el helado ni los alimentos que me gustan. ¡10/10! Recomiendo totalmente esta app.",
  },
  {
    name: "N.",
    rating: 5,
    text: "Amo, amo, amo esta app. Es muy útil; realmente me ayudó a mejorar mi relación con la comida y a mantener mi déficit calórico. También me encanta que el equipo esté siempre buscando opiniones y aplicando mejoras. ¡Muy buen trabajo!",
  },
  {
    name: "S.",
    rating: 5,
    text: "Muy buena app. Ya bajé unos 5 kg en 3 meses. Además, comprobé su precisión y suele tener una diferencia de solo 20–30 kcal, lo cual no está nada mal.",
  },
  {
    name: "L.",
    rating: 5,
    text: "Me encanta esta app; el personaje es adorable. Siempre te trata con amabilidad sin importar lo que comas.",
  },
];

// ---- PLAN PRICES ----
// TODO: Obtener precios reales desde la API de pagos
const plans = [
  {
    id: "monthly",
    duration: "1 mes",
    price: "19.99",
    pricePerDay: "0.67",
    currency: "€",
    badge: null,
  },
  {
    id: "quarterly",
    duration: "3 meses",
    price: "39.99",
    pricePerDay: "0.44",
    currency: "€",
    badge: "MÁS POPULAR",
    highlight: true,
  },
  {
    id: "biannual",
    duration: "6 meses",
    price: "59.99",
    pricePerDay: "0.33",
    currency: "€",
    badge: "MEJOR VALOR",
  },
];

// ---- STAR COMPONENT ----
function Stars({ count = 5 }) {
  return (
    <span style={{ color: COLORS.star, fontSize: "14px", letterSpacing: "1px" }}>
      {"★".repeat(count)}{"☆".repeat(5 - count)}
    </span>
  );
}

// ---- PROGRESS BAR ----
function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ width: "100%", background: "#e5e7eb", borderRadius: "99px", height: "6px", overflow: "hidden" }}>
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
          borderRadius: "99px",
          transition: "width 0.4s ease",
        }}
      />
    </div>
  );
}

// ---- HEADER ----
function Header({ step, total, onBack }) {
  const isFirst = step === 0;
  const isResult = step >= total - 1;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px 12px",
        background: "#fff",
        borderBottom: `1px solid ${COLORS.border}`,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ width: 40 }}>
        {!isFirst && !isResult && (
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: COLORS.text,
              transition: "background 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = COLORS.bgLight)}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}
            aria-label="Volver"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <img
          src={`${CDN}/app_icon_smile.k24vAgSb.png`}
          alt="BitePal"
          style={{ width: 28, height: 28, borderRadius: "8px" }}
          onError={e => { e.target.style.display = "none"; }}
        />
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: "18px", color: COLORS.text, letterSpacing: "-0.3px" }}>
          BitePal
        </span>
      </div>

      <div style={{ width: 40, textAlign: "right" }}>
        {!isResult && (
          <span style={{ fontFamily: FONT, fontSize: "12px", color: COLORS.textMuted, fontWeight: 500 }}>
            {step}/{total - 2}
          </span>
        )}
      </div>
    </div>
  );
}

// ---- OPTION BUTTON ----
function OptionButton({ label, emoji, selected, onClick, multi }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 16px",
        borderRadius: "12px",
        border: `2px solid ${selected ? COLORS.primary : hovered ? "#d1d5db" : COLORS.border}`,
        background: selected ? COLORS.primaryLight : hovered ? "#fafafa" : "#fff",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.2s ease",
        fontFamily: FONT,
        fontSize: "15px",
        fontWeight: selected ? 600 : 500,
        color: COLORS.text,
        transform: hovered && !selected ? "translateY(-1px)" : "none",
        boxShadow: selected ? `0 0 0 1px ${COLORS.primary}20` : hovered ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
      }}
    >
      {multi && (
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "5px",
            border: `2px solid ${selected ? COLORS.primary : "#d1d5db"}`,
            background: selected ? COLORS.primary : "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.2s",
          }}
        >
          {selected && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      )}
      {emoji && <span style={{ fontSize: "22px" }}>{emoji}</span>}
      <span style={{ flex: 1 }}>{label}</span>
      {!multi && selected && (
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: COLORS.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </button>
  );
}

// ---- BODY IMAGE CARD ----
function BodyCard({ option, selected, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: "1 1 calc(50% - 8px)",
        minWidth: "calc(50% - 8px)",
        maxWidth: "calc(50% - 8px)",
        border: `2px solid ${selected ? COLORS.primary : hovered ? "#d1d5db" : COLORS.border}`,
        borderRadius: "16px",
        background: selected ? COLORS.primaryLight : "#fff",
        cursor: "pointer",
        padding: "12px 8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: selected ? `0 0 0 1px ${COLORS.primary}30, 0 4px 12px rgba(76,175,130,0.15)` : hovered ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
      }}
    >
      <img
        src={option.img}
        alt={option.label}
        style={{ width: "100%", maxWidth: "100px", height: "130px", objectFit: "contain", borderRadius: "8px" }}
        loading="lazy"
        onError={e => { e.target.src = "https://via.placeholder.com/100x130?text=imagen"; }}
      />
      <span
        style={{
          fontFamily: FONT,
          fontSize: "14px",
          fontWeight: selected ? 700 : 600,
          color: selected ? COLORS.primary : COLORS.text,
        }}
      >
        {option.label}
      </span>
    </button>
  );
}

// ---- ZONE CARD ----
function ZoneCard({ option, selected, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: "1 1 calc(33.33% - 8px)",
        minWidth: "calc(33.33% - 8px)",
        maxWidth: "calc(33.33% - 8px)",
        border: `2px solid ${selected ? COLORS.primary : hovered ? "#d1d5db" : COLORS.border}`,
        borderRadius: "16px",
        background: selected ? COLORS.primaryLight : "#fff",
        cursor: "pointer",
        padding: "10px 6px 8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-2px)" : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {selected && (
        <div
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: COLORS.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
      <img
        src={option.img}
        alt={option.label}
        style={{ width: "60px", height: "80px", objectFit: "contain" }}
        loading="lazy"
        onError={e => { e.target.src = "https://via.placeholder.com/60x80?text=zona"; }}
      />
      <span
        style={{
          fontFamily: FONT,
          fontSize: "12px",
          fontWeight: 600,
          color: selected ? COLORS.primary : COLORS.text,
        }}
      >
        {option.label}
      </span>
    </button>
  );
}

// ---- LOADING STEP ----
function LoadingStep({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Analizando tus respuestas...");
  const messages = [
    "Analizando tus respuestas...",
    "Calculando tu metabolismo...",
    "Calculando tu IMC...",
    "Creando tu plan alimenticio...",
    "Personalizando tus metas...",
    "¡Tu plan está listo!",
  ];

  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 8 + 3;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(onDone, 600);
      }
      setProgress(Math.min(p, 100));
      const idx = Math.floor((p / 100) * (messages.length - 1));
      setMessage(messages[Math.min(idx, messages.length - 1)]);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: "32px",
        padding: "40px 24px",
        textAlign: "center",
      }}
    >
      <div style={{ position: "relative", width: 120, height: 120 }}>
        <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke={COLORS.primary}
            strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 52}`}
            strokeDashoffset={`${2 * Math.PI * 52 * (1 - progress / 100)}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.3s ease" }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT,
            fontSize: "22px",
            fontWeight: 700,
            color: COLORS.primary,
          }}
        >
          {Math.round(progress)}%
        </div>
      </div>

      <div>
        <p
          style={{
            fontFamily: FONT,
            fontSize: "18px",
            fontWeight: 600,
            color: COLORS.text,
            margin: 0,
            transition: "opacity 0.3s",
          }}
        >
          {message}
        </p>
      </div>

      <div style={{ display: "flex", gap: "24px" }}>
        {["🧬", "🥗", "⚖️"].map((icon, i) => (
          <div
            key={i}
            style={{
              fontSize: "28px",
              animation: `bounce ${1 + i * 0.2}s infinite alternate`,
              opacity: progress > i * 33 ? 1 : 0.3,
              transition: "opacity 0.5s",
            }}
          >
            {icon}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- RESULT / PAYWALL ----
function ResultStep({ answers }) {
  const [selectedPlan, setSelectedPlan] = useState("quarterly");
  const [showPayModal, setShowPayModal] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const gender = answers.gender || "female";
  const age = answers.age || "25-34";
  const currentWeight = parseInt(answers.current_weight) || 75;
  const targetWeight = parseInt(answers.target_weight) || 65;
  const weightToLose = currentWeight - targetWeight;
  const weeksNeeded = Math.max(8, Math.round(weightToLose * 1.5));

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + weeksNeeded * 7);
  const dateStr = targetDate.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });

  const socialImg = gender === "female"
    ? `${CDN}/Social proof - female.JPuZUdSO.webp`
    : `${CDN}/Social proof - male.Lsw-aKfL.webp`;

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      {/* BEFORE/AFTER HERO */}
      <div style={{ background: "linear-gradient(135deg, #f0faf4 0%, #e8f5ee 100%)", padding: "28px 20px 24px" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div
            style={{
              background: COLORS.primary,
              color: "#fff",
              borderRadius: "10px",
              padding: "8px 16px",
              display: "inline-block",
              fontFamily: FONT,
              fontSize: "13px",
              fontWeight: 700,
              marginBottom: "16px",
              letterSpacing: "0.5px",
            }}
          >
            🎉 ¡TU PLAN ESTÁ LISTO!
          </div>
          <h2
            style={{
              fontFamily: FONT,
              fontSize: "24px",
              fontWeight: 800,
              color: COLORS.text,
              margin: "0 0 8px",
              lineHeight: 1.2,
            }}
          >
            Alcanza <span style={{ color: COLORS.primary }}>{targetWeight} kg</span> para el
          </h2>
          <p
            style={{
              fontFamily: FONT,
              fontSize: "20px",
              fontWeight: 700,
              color: COLORS.primaryDark,
              margin: "0 0 20px",
            }}
          >
            {dateStr}
          </p>

          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "16px",
              display: "flex",
              gap: "16px",
              alignItems: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontFamily: FONT, fontSize: "12px", color: COLORS.textMuted, marginBottom: "4px" }}>AHORA</div>
              <div style={{ fontFamily: FONT, fontSize: "28px", fontWeight: 800, color: "#ef4444" }}>{currentWeight} kg</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M8 16h16M18 10l6 6-6 6" stroke={COLORS.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div style={{ fontFamily: FONT, fontSize: "11px", color: COLORS.primary, fontWeight: 700 }}>
                -{weightToLose} kg
              </div>
            </div>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontFamily: FONT, fontSize: "12px", color: COLORS.textMuted, marginBottom: "4px" }}>META</div>
              <div style={{ fontFamily: FONT, fontSize: "28px", fontWeight: 800, color: COLORS.primary }}>{targetWeight} kg</div>
            </div>
          </div>
        </div>
      </div>

      {/* SOCIAL PROOF IMAGE */}
      <div style={{ padding: "24px 20px 0", maxWidth: 480, margin: "0 auto" }}>
        <img
          src={socialImg}
          alt="Testimonios de usuarios"
          style={{ width: "100%", borderRadius: "16px", objectFit: "cover", maxHeight: "200px" }}
          loading="lazy"
          onError={e => { e.target.src = "https://via.placeholder.com/480x200?text=Testimonios"; }}
        />
      </div>

      {/* STATS */}
      <div style={{ padding: "24px 20px", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          {[
            { label: "Usuarios activos", value: "2M+", icon: "👥" },
            { label: "Kg perdidos", value: "500K+", icon: "⚖️" },
            { label: "Valoración", value: "4.8★", icon: "⭐" },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: "#f9fafb",
                borderRadius: "12px",
                padding: "14px 8px",
                textAlign: "center",
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <div style={{ fontSize: "20px", marginBottom: "4px" }}>{stat.icon}</div>
              <div style={{ fontFamily: FONT, fontSize: "16px", fontWeight: 800, color: COLORS.text }}>{stat.value}</div>
              <div style={{ fontFamily: FONT, fontSize: "10px", color: COLORS.textMuted, marginTop: "2px" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CHOOSE PLAN */}
      <div style={{ padding: "0 20px 24px", maxWidth: 480, margin: "0 auto" }}>
        <h3
          style={{
            fontFamily: FONT,
            fontSize: "20px",
            fontWeight: 800,
            color: COLORS.text,
            margin: "0 0 6px",
            textAlign: "center",
          }}
        >
          Elige tu plan
        </h3>
        <p style={{ fontFamily: FONT, fontSize: "14px", color: COLORS.textMuted, textAlign: "center", margin: "0 0 16px" }}>
          Garantía de devolución de dinero de 30 días
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {plans.map(plan => {
            const isSelected = selectedPlan === plan.id;
            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                style={{
                  width: "100%",
                  border: `2px solid ${isSelected ? COLORS.primary : COLORS.border}`,
                  borderRadius: "14px",
                  background: isSelected ? COLORS.primaryLight : "#fff",
                  padding: "14px 16px",
                  cursor: "pointer",
                  textAlign: "left",
                  position: "relative",
                  transition: "all 0.2s",
                  boxShadow: isSelected ? `0 0 0 1px ${COLORS.primary}30` : "none",
                }}
              >
                {plan.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: -10,
                      right: 12,
                      background: plan.id === "biannual" ? COLORS.accent : COLORS.primary,
                      color: "#fff",
                      borderRadius: "6px",
                      padding: "3px 8px",
                      fontSize: "10px",
                      fontFamily: FONT,
                      fontWeight: 700,
                      letterSpacing: "0.5px",
                    }}
                  >
                    {plan.badge}
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        border: `2px solid ${isSelected ? COLORS.primary : "#d1d5db"}`,
                        background: isSelected ? COLORS.primary : "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {isSelected && (
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />
                      )}
                    </div>
                    <div>
                      <div style={{ fontFamily: FONT, fontSize: "15px", fontWeight: 700, color: COLORS.text }}>
                        {plan.duration}
                      </div>
                      <div style={{ fontFamily: FONT, fontSize: "12px", color: COLORS.textMuted }}>
                        {plan.currency}{plan.pricePerDay}/día
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: FONT, fontSize: "20px", fontWeight: 800, color: isSelected ? COLORS.primary : COLORS.text }}>
                      {plan.currency}{plan.price}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* EMAIL CAPTURE */}
      {!emailSubmitted ? (
        <div style={{ padding: "0 20px 24px", maxWidth: 480, margin: "0 auto" }}>
          <div
            style={{
              background: "#f9fafb",
              borderRadius: "16px",
              padding: "20px",
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <p style={{ fontFamily: FONT, fontSize: "14px", fontWeight: 600, color: COLORS.text, margin: "0 0 12px", textAlign: "center" }}>
              📧 Ingresa tu email para recibir tu plan
            </p>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "10px",
                border: `1.5px solid ${COLORS.border}`,
                fontFamily: FONT,
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
                marginBottom: "10px",
              }}
            />
            <button
              onClick={() => {
                if (email.includes("@")) {
                  setEmailSubmitted(true);
                  // TODO: Enviar email a backend real
                }
              }}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: "none",
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
                color: "#fff",
                fontFamily: FONT,
                fontSize: "16px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Obtener mi plan →
            </button>
          </div>
        </div>
      ) : (
        /* CTA BUTTON */
        <div style={{ padding: "0 20px 24px", maxWidth: 480, margin: "0 auto" }}>
          <button
            onClick={() => setShowPayModal(true)}
            style={{
              width: "100%",
              padding: "18px",
              borderRadius: "16px",
              border: "none",
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
              color: "#fff",
              fontFamily: FONT,
              fontSize: "18px",
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(76,175,130,0.4)",
              transition: "transform 0.2s, box-shadow 0.2s",
              letterSpacing: "-0.3px",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 28px rgba(76,175,130,0.5)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(76,175,130,0.4)";
            }}
          >
            🚀 Comenzar mi plan ahora
          </button>
          <p style={{ fontFamily: FONT, fontSize: "12px", color: COLORS.textMuted, textAlign: "center", margin: "10px 0 0" }}>
            🔒 Pago seguro · Garantía de 30 días · Cancela cuando quieras
          </p>
        </div>
      )}

      {/* REVIEWS */}
      <div style={{ padding: "8px 20px 32px", maxWidth: 480, margin: "0 auto" }}>
        <h3 style={{ fontFamily: FONT, fontSize: "18px", fontWeight: 800, color: COLORS.text, margin: "0 0 16px", textAlign: "center" }}>
          Lo que dicen nuestros usuarios
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {reviews.map((r, i) => (
            <div
              key={i}
              style={{
                background: "#f9fafb",
                borderRadius: "14px",
                padding: "16px",
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontFamily: FONT, fontSize: "14px", fontWeight: 700, color: COLORS.text }}>{r.name}</span>
                <Stars count={r.rating} />
              </div>
              <p style={{ fontFamily: FONT, fontSize: "13px", color: COLORS.textLight, margin: 0, lineHeight: 1.5 }}>
                {r.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* MONEY BACK */}
      <div style={{ padding: "0 20px 40px", maxWidth: 480, margin: "0 auto" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #f0faf4, #e8f5ee)",
            borderRadius: "16px",
            padding: "20px",
            display: "flex",
            gap: "14px",
            alignItems: "flex-start",
            border: `1px solid ${COLORS.primary}30`,
          }}
        >
          <span style={{ fontSize: "32px", flexShrink: 0 }}>🛡️</span>
          <div>
            <div style={{ fontFamily: FONT, fontSize: "15px", fontWeight: 700, color: COLORS.text, marginBottom: "4px" }}>
              Garantía de devolución de 30 días
            </div>
            <div style={{ fontFamily: FONT, fontSize: "13px", color: COLORS.textLight, lineHeight: 1.5 }}>
              Si no estás satisfecho/a con los resultados en los primeros 30 días, te devolvemos el dinero sin preguntas.
            </div>
          </div>
        </div>
      </div>

      {/* PAY MODAL */}
      {showPayModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 1000,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
          onClick={() => setShowPayModal(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "24px 24px 0 0",
              padding: "28px 24px 40px",
              width: "100%",
              maxWidth: 480,
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{
                width: 40,
                height: 4,
                background: "#e5e7eb",
                borderRadius: "2px",
                margin: "0 auto 24px",
              }}
            />
            <h3 style={{ fontFamily: FONT, fontSize: "20px", fontWeight: 800, color: COLORS.text, margin: "0 0 6px", textAlign: "center" }}>
              Completa tu compra
            </h3>
            <p style={{ fontFamily: FONT, fontSize: "14px", color: COLORS.textMuted, textAlign: "center", margin: "0 0 24px" }}>
              Plan {plans.find(p => p.id === selectedPlan)?.duration} — {plans.find(p => p.id === selectedPlan)?.currency}{plans.find(p => p.id === selectedPlan)?.price}
            </p>
            {/* TODO: Integrar Stripe Express Checkout o Yuno Express aquí */}
            <div
              style={{
                background: "#f9fafb",
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center",
                border: `1px solid ${COLORS.border}`,
                marginBottom: "16px",
              }}
            >
              <p style={{ fontFamily: FONT, fontSize: "14px", color: COLORS.textMuted, margin: 0 }}>
                🔒 Pasarela de pago segura
              </p>
              <p style={{ fontFamily: FONT, fontSize: "12px", color: COLORS.textMuted, margin: "6px 0 0" }}>
                {/* TODO: Mostrar métodos de pago reales: Apple Pay, Google Pay, tarjetas */}
                Stripe / Yuno — Integración pendiente
              </p>
            </div>
            <button
              onClick={() => setShowPayModal(false)}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: `1.5px solid ${COLORS.border}`,
                background: "#fff",
                fontFamily: FONT,
                fontSize: "15px",
                fontWeight: 600,
                color: COLORS.textLight,
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- MEASUREMENTS INPUT ----
function MeasurementsStep({ answers, onAnswer }) {
  const [unit, setUnit] = useState("metric");
  const [height, setHeight] = useState(answers.height || "");
  const [weight, setWeight] = useState(answers.current_weight || "");

  const heightLabel = unit === "metric" ? "Altura (cm)" : "Altura (ft/in)";
  const weightLabel = unit === "metric" ? "Peso (kg)" : "Peso (lbs)";

  return (
    <div>
      <div style={{ display: "flex", background: "#f3f4f6", borderRadius: "10px", padding: "3px", marginBottom: "24px" }}>
        {["metric", "imperial"].map(u => (
          <button
            key={u}
            onClick={() => setUnit(u)}
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "8px",
              border: "none",
              background: unit === u ? "#fff" : "transparent",
              fontFamily: FONT,
              fontSize: "14px",
              fontWeight: unit === u ? 700 : 500,
              color: unit === u ? COLORS.text : COLORS.textMuted,
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: unit === u ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
            }}
          >
            {u === "metric" ? "Métrico" : "Imperial"}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={{ fontFamily: FONT, fontSize: "14px", fontWeight: 600, color: COLORS.text, display: "block", marginBottom: "6px" }}>
            {heightLabel}
          </label>
          <input
            type="number"
            value={height}
            onChange={e => setHeight(e.target.value)}
            placeholder={unit === "metric" ? "ej: 170" : "ej: 5.7"}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "12px",
              border: `1.5px solid ${height ? COLORS.primary : COLORS.border}`,
              fontFamily: FONT,
              fontSize: "16px",
              outline: "none",
              boxSizing: "border-box",
              color: COLORS.text,
              transition: "border-color 0.2s",
            }}
          />
        </div>

        <div>
          <label style={{ fontFamily: FONT, fontSize: "14px", fontWeight: 600, color: COLORS.text, display: "block", marginBottom: "6px" }}>
            {weightLabel}
          </label>
          <input
            type="number"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            placeholder={unit === "metric" ? "ej: 75" : "ej: 165"}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "12px",
              border: `1.5px solid ${weight ? COLORS.primary : COLORS.border}`,
              fontFamily: FONT,
              fontSize: "16px",
              outline: "none",
              boxSizing: "border-box",
              color: COLORS.text,
              transition: "border-color 0.2s",
            }}
          />
        </div>
      </div>

      <button
        disabled={!height || !weight}
        onClick={() => {
          if (height && weight) {
            onAnswer({ height, current_weight: weight, unit });
          }
        }}
        style={{
          width: "100%",
          marginTop: "24px",
          padding: "16px",
          borderRadius: "14px",
          border: "none",
          background: height && weight
            ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`
            : "#e5e7eb",
          color: height && weight ? "#fff" : "#9ca3af",
          fontFamily: FONT,
          fontSize: "16px",
          fontWeight: 700,
          cursor: height && weight ? "pointer" : "not-allowed",
          transition: "all 0.2s",
        }}
      >
        Continuar →
      </button>
    </div>
  );
}

// ---- TARGET WEIGHT STEP ----
function TargetWeightStep({ answers, onAnswer }) {
  const currentWeight = parseInt(answers.current_weight) || 75;
  const [targetWeight, setTargetWeight] = useState(answers.target_weight || String(Math.max(currentWeight - 10, 50)));

  return (
    <div>
      <div
        style={{
          background: COLORS.primaryLight,
          borderRadius: "12px",
          padding: "14px 16px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontFamily: FONT, fontSize: "14px", color: COLORS.textLight }}>Peso actual</span>
        <span style={{ fontFamily: FONT, fontSize: "16px", fontWeight: 700, color: COLORS.text }}>{currentWeight} kg</span>
      </div>

      <label style={{ fontFamily: FONT, fontSize: "14px", fontWeight: 600, color: COLORS.text, display: "block", marginBottom: "6px" }}>
        Peso objetivo (kg)
      </label>
      <input
        type="number"
        value={targetWeight}
        onChange={e => setTargetWeight(e.target.value)}
        placeholder="ej: 65"
        style={{
          width: "100%",
          padding: "14px 16px",
          borderRadius: "12px",
          border: `1.5px solid ${targetWeight ? COLORS.primary : COLORS.border}`,
          fontFamily: FONT,
          fontSize: "16px",
          outline: "none",
          boxSizing: "border-box",
          color: COLORS.text,
          transition: "border-color 0.2s",
        }}
      />

      {targetWeight && parseInt(targetWeight) < currentWeight && (
        <div
          style={{
            background: COLORS.primaryLight,
            borderRadius: "10px",
            padding: "12px 14px",
            marginTop: "14px",
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "18px" }}>✅</span>
          <span style={{ fontFamily: FONT, fontSize: "13px", color: COLORS.primaryDark, fontWeight: 500 }}>
            ¡Excelente meta! Perderás {currentWeight - parseInt(targetWeight)} kg con nuestro plan personalizado.
          </span>
        </div>
      )}

      <button
        disabled={!targetWeight || parseInt(targetWeight) >= currentWeight}
        onClick={() => {
          if (targetWeight && parseInt(targetWeight) < currentWeight) {
            onAnswer({ target_weight: targetWeight });
          }
        }}
        style={{
          width: "100%",
          marginTop: "24px",
          padding: "16px",
          borderRadius: "14px",
          border: "none",
          background: targetWeight && parseInt(targetWeight) < currentWeight
            ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`
            : "#e5e7eb",
          color: targetWeight && parseInt(targetWeight) < currentWeight ? "#fff" : "#9ca3af",
          fontFamily: FONT,
          fontSize: "16px",
          fontWeight: 700,
          cursor: targetWeight && parseInt(targetWeight) < currentWeight ? "pointer" : "not-allowed",
          transition: "all 0.2s",
        }}
      >
        Continuar →
      </button>
    </div>
  );
}

// ---- INFO CARD STEP ----
function InfoCardStep({ step, onNext }) {
  return (
    <div style={{ textAlign: "center" }}>
      <img
        src={step.image}
        alt={step.title}
        style={{ width: "100%", maxHeight: "260px", objectFit: "contain", borderRadius: "16px", marginBottom: "20px" }}
        loading="lazy"
        onError={e => { e.target.src = "https://via.placeholder.com/400x260?text=imagen"; }}
      />
      <h3 style={{ fontFamily: FONT, fontSize: "20px", fontWeight: 800, color: COLORS.text, margin: "0 0 10px", lineHeight: 1.2 }}>
        {step.title}
      </h3>
      <p style={{ fontFamily: FONT, fontSize: "15px", color: COLORS.textLight, margin: "0 0 24px", lineHeight: 1.6 }}>
        {step.text}
      </p>
      <button
        onClick={onNext}
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: "14px",
          border: "none",
          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
          color: "#fff",
          fontFamily: FONT,
          fontSize: "16px",
          fontWeight: 700,
          cursor: "pointer",
          transition: "opacity 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >
        Continuar →
      </button>
    </div>
  );
}

// ---- SOCIAL PROOF STEP ----
function SocialProofStep({ answers, onNext }) {
  const gender = answers.gender || "female";
  const img = gender === "female"
    ? `${CDN}/Social proof - female.JPuZUdSO.webp`
    : `${CDN}/Social proof - male.Lsw-aKfL.webp`;

  return (
    <div style={{ textAlign: "center" }}>
      <img
        src={img}
        alt="Prueba social"
        style={{ width: "100%", borderRadius: "16px", marginBottom: "20px", maxHeight: "240px", objectFit: "cover" }}
        loading="lazy"
        onError={e => { e.target.src = "https://via.placeholder.com/400x240?text=Usuarios+BitePal"; }}
      />
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "12px" }}>
        {"★★★★★".split("").map((s, i) => (
          <span key={i} style={{ fontSize: "22px", color: COLORS.star }}>{s}</span>
        ))}
      </div>
      <h3 style={{ fontFamily: FONT, fontSize: "22px", fontWeight: 800, color: COLORS.text, margin: "0 0 10px" }}>
        Más de 2 millones de personas confían en BitePal
      </h3>
      <p style={{ fontFamily: FONT, fontSize: "15px", color: COLORS.textLight, margin: "0 0 16px", lineHeight: 1.6 }}>
        Personas como tú ya están transformando su vida con planes de alimentación personalizados.
      </p>
      <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "24px" }}>
        {["Sin pastillas", "Sin dietas extremas", "100% personalizado"].map((tag, i) => (
          <div
            key={i}
            style={{
              background: COLORS.primaryLight,
              borderRadius: "8px",
              padding: "6px 10px",
              fontFamily: FONT,
              fontSize: "11px",
              fontWeight: 600,
              color: COLORS.primaryDark,
            }}
          >
            ✓ {tag}
          </div>
        ))}
      </div>
      <button
        onClick={onNext}
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: "14px",
          border: "none",
          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
          color: "#fff",
          fontFamily: FONT,
          fontSize: "16px",
          fontWeight: 700,
          cursor: "pointer",
          transition: "opacity 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >
        ¡Quiero mi plan! →
      </button>
    </div>
  );
}

// ---- AGE STEP ----
function AgeStep({ step, answers, onAnswer }) {
  const gender = answers.gender || "female";
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {step.options.map(opt => {
          const img = ageImages[gender]?.[opt.value];
          return (
            <button
              key={opt.value}
              onClick={() => onAnswer({ [step.id]: opt.value })}
              onMouseEnter={() => setHovered(opt.value)}
              onMouseLeave={() => setHovered(null)}
              style={{
                border: `2px solid ${hovered === opt.value ? COLORS.primary : COLORS.border}`,
                borderRadius: "16px",
                background: "#fff",
                cursor: "pointer",
                overflow: "hidden",
                transition: "all 0.2s",
                transform: hovered === opt.value ? "translateY(-2px)" : "none",
                boxShadow: hovered === opt.value ? "0 6px 16px rgba(0,0,0,0.12)" : "none",
              }}
            >
              {img && (
                <img
                  src={img}
                  alt={opt.label}
                  style={{ width: "100%", height: "140px", objectFit: "cover", display: "block" }}
                  loading="eager"
                  onError={e => { e.target.style.display = "none"; }}
                />
              )}
              <div
                style={{
                  padding: "10px",
                  fontFamily: FONT,
                  fontSize: "16px",
                  fontWeight: 700,
                  color: COLORS.text,
                  textAlign: "center",
                }}
              >
                {opt.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---- GENDER STEP ----
function GenderStep({ onAnswer }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {[
        { value: "female", label: "Mujer", emoji: "👩", color: "#fce4ec", border: "#f48fb1" },
        { value: "male", label: "Hombre", emoji: "👨", color: "#e3f2fd", border: "#90caf9" },
      ].map(opt => (
        <button
          key={opt.value}
          onClick={() => onAnswer({ gender: opt.value })}
          onMouseEnter={() => setHovered(opt.value)}
          onMouseLeave={() => setHovered(null)}
          style={{
            width: "100%",
            padding: "20px",
            borderRadius: "16px",
            border: `2px solid ${hovered === opt.value ? opt.border : COLORS.border}`,
            background: hovered === opt.value ? opt.color : "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            transition: "all 0.2s",
            transform: hovered === opt.value ? "translateY(-2px)" : "none",
            boxShadow: hovered === opt.value ? "0 6px 16px rgba(0,0,0,0.1)" : "none",
          }}
        >
          <span style={{ fontSize: "40px" }}>{opt.emoji}</span>
          <span style={{ fontFamily: FONT, fontSize: "20px", fontWeight: 700, color: COLORS.text }}>
            {opt.label}
          </span>
        </button>
      ))}
    </div>
  );
}

// ---- MAIN APP ----
export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState("forward");
  const [multiSelected, setMultiSelected] = useState([]);
  const [loadingDone, setLoadingDone] = useState(false);

  const step = steps[currentStep];
  const quizSteps = steps.filter(s => s.type !== "loading" && s.type !== "result").length;

  // Reset multi-select on step change
  useEffect(() => {
    if (step.type === "multi") {
      setMultiSelected(answers[step.id] || []);
    }
  }, [currentStep]);

  const navigateTo = (nextStep, newAnswers = {}, dir = "forward") => {
    setAnimating(true);
    setDirection(dir);
    setTimeout(() => {
      setAnswers(prev => ({ ...prev, ...newAnswers }));
      setCurrentStep(nextStep);
      setAnimating(false);
    }, 220);
  };

  const handleAnswer = (newAnswers) => {
    navigateTo(currentStep + 1, newAnswers, "forward");
  };

  const handleBack = () => {
    if (currentStep > 0) {
      navigateTo(currentStep - 1, {}, "back");
    }
  };

  const handleMultiContinue = () => {
    navigateTo(currentStep + 1, { [step.id]: multiSelected }, "forward");
  };

  const toggleMulti = (value) => {
    setMultiSelected(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const gender = answers.gender || "female";

  const renderStep = () => {
    switch (step.type) {
      case "gender":
        return <GenderStep onAnswer={handleAnswer} />;

      case "age":
        return <AgeStep step={step} answers={answers} onAnswer={handleAnswer} />;

      case "single":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {step.options.map(opt => (
              <OptionButton
                key={opt.value}
                label={opt.label}
                emoji={opt.emoji}
                selected={answers[step.id] === opt.value}
                onClick={() => handleAnswer({ [step.id]: opt.value })}
                multi={false}
              />
            ))}
          </div>
        );

      case "multi": {
        const opts = step.gender_options ? step.gender_options[gender] : step.options;
        const isZone = step.id === "target_zones";
        return (
          <div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              {opts.map(opt =>
                isZone ? (
                  <ZoneCard
                    key={opt.value}
                    option={opt}
                    selected={multiSelected.includes(opt.value)}
                    onClick={() => toggleMulti(opt.value)}
                  />
                ) : (
                  <div key={opt.value} style={{ width: "100%" }}>
                    <OptionButton
                      label={opt.label}
                      emoji={opt.emoji}
                      selected={multiSelected.includes(opt.value)}
                      onClick={() => toggleMulti(opt.value)}
                      multi
                    />
                  </div>
                )
              )}
            </div>
            <button
              disabled={multiSelected.length === 0}
              onClick={handleMultiContinue}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "14px",
                border: "none",
                background: multiSelected.length > 0
                  ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`
                  : "#e5e7eb",
                color: multiSelected.length > 0 ? "#fff" : "#9ca3af",
                fontFamily: FONT,
                fontSize: "16px",
                fontWeight: 700,
                cursor: multiSelected.length > 0 ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}
            >
              Continuar ({multiSelected.length} seleccionado{multiSelected.length !== 1 ? "s" : ""}) →
            </button>
          </div>
        );
      }

      case "body_current": {
        const opts = bodyOptions.current[gender];
        return (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {opts.map(opt => (
              <BodyCard
                key={opt.value}
                option={opt}
                selected={answers[step.id] === opt.value}
                onClick={() => handleAnswer({ [step.id]: opt.value })}
              />
            ))}
          </div>
        );
      }

      case "body_target": {
        const opts = bodyOptions.target[gender];
        return (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
            {opts.map(opt => (
              <BodyCard
                key={opt.value}
                option={opt}
                selected={answers[step.id] === opt.value}
                onClick={() => handleAnswer({ [step.id]: opt.value })}
              />
            ))}
          </div>
        );
      }

      case "social_proof":
        return <SocialProofStep answers={answers} onNext={() => handleAnswer({})} />;

      case "info_card":
        return <InfoCardStep step={step} onNext={() => handleAnswer({})} />;

      case "measurements":
        return <MeasurementsStep answers={answers} onAnswer={handleAnswer} />;

      case "target_weight":
        return <TargetWeightStep answers={answers} onAnswer={handleAnswer} />;

      case "loading":
        return (
          <LoadingStep
            onDone={() => {
              setLoadingDone(true);
              navigateTo(currentStep + 1, {}, "forward");
            }}
          />
        );

      case "result":
        return <ResultStep answers={answers} />;

      default:
        return null;
    }
  };

  const isResult = step.type === "result";
  const isLoading = step.type === "loading";

  // Compute quiz step number (excluding info/social/loading/result)
  const quizOnlySteps = steps.filter(
    s => !["loading", "result", "social_proof", "info_card"].includes(s.type)
  );
  const currentQuizIdx = quizOnlySteps.findIndex(s => s.id === step.id);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        fontFamily: FONT,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; background: #ffffff; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeOutLeft {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(-30px); }
        }
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-8px); }
        }
        .step-enter {
          animation: ${direction === "forward" ? "fadeInRight" : "fadeInLeft"} 0.3s ease forwards;
        }
        .step-exit {
          animation: ${direction === "forward" ? "fadeOutLeft" : "fadeInRight"} 0.22s ease forwards;
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 3px; }
      `}</style>

      {/* HEADER */}
      <Header
        step={currentStep}
        total={steps.length}
        onBack={handleBack}
      />

      {/* PROGRESS (only during quiz steps) */}
      {!isResult && !isLoading && currentStep > 0 && (
        <div style={{ padding: "12px 20px 0", background: "#fff" }}>
          <div style={{ maxWidth: 480, margin: "0 auto" }}>
            <ProgressBar
              current={Math.max(currentStep, 1)}
              total={steps.filter(s => s.type !== "result").length}
            />
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div
        style={{
          flex: 1,
          maxWidth: isResult ? "none" : 480,
          width: "100%",
          margin: "0 auto",
          padding: isResult ? "0" : "24px 20px 40px",
          overflow: "hidden",
        }}
      >
        {/* STEP TITLE & SUBTITLE */}
        {!isResult && !isLoading && step.title && step.type !== "info_card" && step.type !== "social_proof" && (
          <div style={{ marginBottom: "20px" }}>
            <h2
              style={{
                fontFamily: FONT,
                fontSize: "22px",
                fontWeight: 800,
                color: COLORS.text,
                margin: "0 0 6px",
                lineHeight: 1.2,
                letterSpacing: "-0.3px",
              }}
            >
              {step.title}
            </h2>
            {step.subtitle && (
              <p
                style={{
                  fontFamily: FONT,
                  fontSize: "14px",
                  color: COLORS.textMuted,
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {step.subtitle}
              </p>
            )}
          </div>
        )}

        {isLoading && (
          <div style={{ marginBottom: "8px" }}>
            <h2
              style={{
                fontFamily: FONT,
                fontSize: "22px",
                fontWeight: 800,
                color: COLORS.text,
                margin: "0 0 6px",
                textAlign: "center",
              }}
            >
              {step.title}
            </h2>
          </div>
        )}

        {/* STEP CONTENT */}
        <div
          key={currentStep}
          className={animating ? "step-exit" : "step-enter"}
          style={{ width: "100%" }}
        >
          {renderStep()}
        </div>
      </div>

      {/* FOOTER */}
      {!isResult && (
        <div
          style={{
            textAlign: "center",
            padding: "12px 20px 20px",
            background: "#fff",
            borderTop: `1px solid ${COLORS.border}`,
          }}
        >
          <p style={{ fontFamily: FONT, fontSize: "11px", color: COLORS.textMuted, margin: 0 }}>
            🔒 Tu información es 100% privada y segura
          </p>
        </div>
      )}
    </div>
  );
}