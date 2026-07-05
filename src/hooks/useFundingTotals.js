import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Remplace MOCK_COLLECTED / MOCK_BACKERS.
// Lit la vue publique `global_funding_totals` (somme réelle des contributions payment_status='succeeded'),
// et se met à jour en temps réel via Supabase Realtime dès qu'une contribution passe à 'succeeded' côté serveur.
export function useGlobalFundingTotals() {
  const [data, setData] = useState({ total_collected_usd: 0, global_goal: 0, approx_backers: 0, loading: true, error: null });

  const fetchTotals = useCallback(async () => {
    setData((d) => ({ ...d, loading: true, error: null }));
    const { data: row, error } = await supabase
      .from("global_funding_totals")
      .select("*")
      .single();
    if (error) {
      console.error("Erreur chargement du compteur global:", error);
      // On expose l'erreur au lieu de la cacher : sans ça, l'UI afficherait "0 $" comme
      // si personne n'avait encore contribué, alors qu'en réalité la requête a échoué.
      setData((d) => ({ ...d, loading: false, error }));
      return;
    }
    setData({ ...row, loading: false, error: null });
  }, []);

  useEffect(() => {
    let active = true;
    const run = async () => { if (active) await fetchTotals(); };
    run();

    // Realtime : dès qu'une ligne 'contributions' change (ex: webhook Stripe passe une contribution
    // à 'succeeded'), on recharge le total. Nécessite d'activer la réplication Realtime sur la table
    // `contributions` dans Supabase → Database → Replication.
    const channel = supabase
      .channel("public:contributions:funding-totals")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "contributions" }, run)
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [fetchTotals]);

  return { ...data, retry: fetchTotals };
}

export function usePillarFundingTotals() {
  const [pillars, setPillars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPillars = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from("pillar_funding_totals").select("*").order("slug");
    if (error) {
      console.error("Erreur chargement des piliers:", error);
      setError(error);
      setLoading(false);
      return;
    }
    setPillars(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    const run = async () => { if (active) await fetchPillars(); };
    run();

    const channel = supabase
      .channel("public:contributions:pillar-totals")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "contributions" }, run)
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [fetchPillars]);

  return { pillars, loading, error, retry: fetchPillars };
}