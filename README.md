# Kingstone Kongo — Site 2 : Plateforme d'Investissement

Site d'investissement coopératif lié au Site 1 (présentation). Même design system : noir, or #F5B041, Playfair Display + Inter, Framer Motion.

## Stack
- **React 18 + Vite** — frontend
- **Tailwind CSS** — design system identique au Site 1
- **Framer Motion** — animations (word-by-word reveal, parallax, spring)
- **Three.js (canvas natif)** — globe 3D interactif avec highlight Afrique
- **Supabase** — auth (même projet que Site 1) + base de données
- **Stripe** — paiements sécurisés (à brancher via webhook)
- **Lucide React** — icônes

## Pages
| Route | Description |
|---|---|
| `/` | Landing : globe 3D, compteur animé, bento grid 12 piliers, CTA |
| `/investir` | Tunnel de contribution 4 étapes (pilier → montant → paiement → confirmation) |
| `/partenariat` | Niveaux de partenariat, formulaire contact, FAQ |
| `/dashboard` | Espace coopérateur : stats, historique, reçus PDF |
| `/auth` | Login / Register / Forgot Password (split-screen) |
| `/legal` | Mentions légales & politique de confidentialité |

## Installation

```bash
npm install
cp .env.local.example .env.local   # renseigner les clés
npm run dev
```

## Configuration requise (`.env.local`)

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_STRIPE_PUBLIC_KEY=pk_live_...
VITE_SITE1_URL=https://kingstonekongo.com
```

## Connexion Supabase

Utilisez le **même projet Supabase** que le Site 1. Les tables `auth.users` et `profiles` sont déjà en place. Ajoutez ces tables pour les contributions :

```sql
create table contributions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users,
  pillar_slug text not null,
  amount numeric(10,2) not null,
  currency text not null default 'USD',
  payment_provider text default 'stripe',
  payment_status text default 'pending',
  transaction_ref text,
  created_at timestamptz default now()
);

alter table contributions enable row level security;
create policy "Users see own contributions"
  on contributions for select using (auth.uid() = user_id);
create policy "Users insert own contributions"
  on contributions for insert with check (auth.uid() = user_id);
```

## Connexion Stripe (Webhook)

1. Dashboard Stripe → Webhooks → Ajouter endpoint : `https://investir.kingstonekongo.com/api/stripe-webhook`
2. Événements à écouter : `payment_intent.succeeded`, `payment_intent.payment_failed`
3. Le secret webhook va dans une Supabase Edge Function (voir `/supabase/functions/stripe-webhook/`)

## Déploiement Vercel

```bash
vercel --prod
```
Variables d'environnement à ajouter dans le dashboard Vercel : identiques au `.env.local`.

URL recommandée : `investir.kingstonekongo.com`

## Liaison avec le Site 1

Dans le Site 1, `src/lib/config.js` :
```js
export const INVEST_PLATFORM_URL = "https://investir.kingstonekongo.com";
```

Le bouton "Rejoindre" de la Navbar du Site 1 pointe déjà sur cette URL.
