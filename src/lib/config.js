export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://inwycdkjipsactpjvekj.supabase.co";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable__Fe8j8KX8dabwd-EFNNLeA_5zjo5wRV";
export const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_your_stripe_key";
export const SITE1_URL = import.meta.env.VITE_SITE1_URL || "http://localhost:5175/";
export const CONTACT_EMAIL = "Africakingstone.ndp@gmail.com";

// Montant minimum pour une contribution "standard" (hors Fonds Général qui est le point d'entrée obligatoire).
export const MIN_CONTRIBUTION = 1000;

// Durée de blocage du capital investi, en années. Le capital est restitué à l'échéance,
// et un rendement annuel (variable selon le pilier) est versé chaque année tant que le
// capital reste investi. Voir la page /investissement-info pour le détail.
export const LOCK_PERIOD_YEARS = 5;

// Fonds Général = le fonds mère. Personne ne peut investir dans un pilier spécifique sans
// investir d'abord dans le Fonds Général — c'est donc l'objectif global réel de la plateforme,
// et PAS la somme des 12 piliers (qui ont leurs propres sous-objectifs, plus modestes).
export const GLOBAL_GOAL = 1500000000;

export const PILLARS = [
  { slug: "agriculture",  label: "Agriculture",          color: "#10B981", icon: "🌾", goal: 25000000,  tagline: "80M d'hectares de terres arables pour la souveraineté alimentaire." },
  { slug: "banque",       label: "Banque de Dépt.",       color: "#F5B041", icon: "🏛️", goal: 100000000, tagline: "Mini-banques coopératives et monnaie du peuple pour le peuple." },
  { slug: "sante",        label: "Santé",                 color: "#EF4444", icon: "❤️", goal: 50000000,  tagline: "Un CHU dans chaque province, cliniques flottantes sur le Congo." },
  { slug: "education",    label: "Éducation",             color: "#8B5CF6", icon: "🎓", goal: 75000000,  tagline: "Former la jeunesse congolaise dans chaque sous-province." },
  { slug: "energie",      label: "Énergie Renouvelable",  color: "#F59E0B", icon: "⚡", goal: 50000000,  tagline: "44 000 MW de potentiel solaire, hydro et biomasse." },
  { slug: "commerce",     label: "Commerce",              color: "#EC4899", icon: "🛍️", goal: 25000000,  tagline: "Supermarchés coopératifs, produits congolais transformés localement." },
  { slug: "transport",    label: "Transport",             color: "#06B6D4", icon: "🚢", goal: 30000000,  tagline: "Relier les 26 provinces par route, fleuve, rail et air." },
  { slug: "btp",          label: "BTP & Infrastructure",  color: "#D97706", icon: "🏗️", goal: 50000000,  tagline: "Briques de terre comprimée, coût 3× moindre qu'importer." },
  { slug: "tourisme",     label: "Tourisme",              color: "#10B981", icon: "🌿", goal: 40000000,  tagline: "9 parcs nationaux, gorilles, bonobos — biodiversité unique." },
  { slug: "biomasse",     label: "Biomasse",              color: "#84CC16", icon: "🌱", goal: 30000000,  tagline: "Déchets agricoles → énergie. L'économie circulaire africaine." },
  { slug: "digital",      label: "Digital",               color: "#6366F1", icon: "📱", goal: 20000000,  tagline: "Souveraineté numérique — wallet, télémédecine, data center." },
  { slug: "gouvernance",  label: "Gouvernance",           color: "#F97316", icon: "⚖️", goal: 1000000,   tagline: "1 personne = 1 voix. Démocratie coopérative vraie." },
];

// URL des Edge Functions Supabase (déployées via `supabase functions deploy`)
export const FUNCTIONS_URL =
  import.meta.env.VITE_SUPABASE_FUNCTIONS_URL ||
  `${SUPABASE_URL.replace(".supabase.co", ".functions.supabase.co")}`;