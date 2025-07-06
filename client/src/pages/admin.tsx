import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { User } from '@/lib/supabase';
import AdminLayout from '@/components/admin/admin-layout';
import LoginForm from '@/components/admin/login-form';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Admin Debug] AuthStateChange event:', event, 'session:', session);
        if (session?.user) {
          console.log('[Admin Debug] session.user.id utilisé pour la requête users:', session.user.id);
          setTimeout(async () => {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            console.log('[Admin Debug] Résultat requête users:', userData, userError);
            if (userError) {
              alert('Erreur SQL Supabase : ' + userError.message);
            }
            if (userData && isMounted) {
              setUser({ ...session.user, email: session.user.email || '', role: userData.role });
            } else if (isMounted) {
              setUser(null);
              alert("Votre compte n'est pas autorisé à accéder à l'administration. Contactez l'administrateur.");
              console.log('[Admin Debug] Utilisateur non trouvé dans la table users, setUser(null)');
            }
            if (isMounted) setLoading(false);
          }, 1000);
        } else if (isMounted) {
          setUser(null);
          console.log('[Admin Debug] Pas de session utilisateur (AuthStateChange), setUser(null)');
          if (isMounted) setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleLogout = async () => {
    console.log('[Admin Debug] Déconnexion demandée');
    await supabase.auth.signOut();
    setUser(null);
    // Nettoyage du cache local Supabase
    localStorage.removeItem('supabase.auth.token');
    console.log('[Admin Debug] Déconnexion terminée, setUser(null)');
  };

  if (loading) {
    console.log('[Admin Debug] Affichage du spinner de chargement');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Si pas de user, afficher le login (pas de reload infini)
  if (!user) {
    console.log('[Admin Debug] Affichage du LoginForm (pas de user)');
    return <LoginForm onLogin={(user) => setUser(user)} />;
  }

  console.log('[Admin Debug] Affichage de l\'AdminLayout (user connecté)');
  return <AdminLayout user={user} onLogout={handleLogout} />;
} 