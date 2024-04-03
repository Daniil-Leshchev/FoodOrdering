import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import React from "react";
import { supabase } from "@/src/lib/supabase";
import { Session } from "@supabase/supabase-js";

type AuthData = {
  session: Session | null;
  profile: any;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthData>({
  session: null,
  loading: true,
  profile: null,
  isAdmin: false,
});

export default function AuthProvider({children}: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
      const fetchSession = async () => {
        const {data: {session}} = await supabase.auth.getSession();
        setSession(session);

        //настройка профиля для публичной таблицы
        if (session) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setProfile(data || null);
        }

        setLoading(false);//закончили проверку аутентификации
      };

      fetchSession();
      supabase.auth.onAuthStateChange((_event, session) => {//отслеживаем изменения сессии, таким образом
        //нас будет автоматически перебрасывать на sign in screen, когда сессия вновь будет null/undefined
        setSession(session);
      });
  }, [])

  return <AuthContext.Provider value={{session, loading, profile, isAdmin: profile?.group === 'ADMIN'}}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);