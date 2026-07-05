import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Investir from "@/pages/Investir";
import Partenariat from "@/pages/Partenariat";
import Dashboard from "@/pages/Dashboard";
import Auth from "@/pages/Auth";
import Legal from "@/pages/Legal";
import InvestmentInfo from "@/pages/InvestmentInfo";
import NotFound from "@/pages/NotFound";
import { supabase } from "@/lib/supabase";

// Pages sans Navbar/Footer
const AUTH_ROUTES = ["/auth"];

function Layout({ children, user, profile, onLogout }) {
  const path = window.location.pathname;
  const isAuthPage = AUTH_ROUTES.some(r => path.startsWith(r));
  if (isAuthPage) return <>{children}</>;
  return (
    <>
      <Navbar user={user} profile={profile} onLogout={onLogout} />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // 1. Session au chargement
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // 2. Écoute des changements d'auth (connexion, déconnexion, refresh de token)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);

      // Journalisation : on n'écrit dans login_history qu'à une VRAIE connexion,
      // jamais à un simple refresh de token silencieux.
      if (event === "SIGNED_IN") {
        supabase
          .rpc("log_login", {
            p_event_type: "sign_in",
            p_user_agent: navigator.userAgent,
          })
          .then(({ error }) => {
            if (error) console.error("log_login a échoué:", error.message);
          });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Charge le profil (pour le nom complet -> initiales de l'avatar) dès qu'on a un user
  useEffect(() => {
    if (!user) { setProfile(null); return; }
    supabase
      .from("profiles")
      .select("full_name, email, role")
      .eq("id", user.id)
      .single()
      .then(({ data, error }) => {
        if (!error) setProfile(data);
      });
  }, [user]);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <Router>
      <Layout user={user} profile={profile} onLogout={handleLogout}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/investir" element={<Investir />} />
            <Route path="/partenariat" element={<Partenariat />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/securite" element={<Legal />} />
            <Route path="/investissement-info" element={<InvestmentInfo />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </Router>
  );
}