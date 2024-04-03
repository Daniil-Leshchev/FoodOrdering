import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import React from "react";
import { supabase } from "@/src/lib/supabase";
import { Session } from "@supabase/supabase-js";

type AuthData = {
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthData>({
  session: null,
  loading: true,
});

export default function AuthProvider({children}: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
      const fetchSession = async () => {
        const {data, error} = await supabase.auth.getSession();
        setSession(data.session);
        setLoading(false);//закончили проверку аутентификации
      };

      fetchSession();
      supabase.auth.onAuthStateChange((_event, session) => {//отслеживаем изменения сессии, таким образом
        //нас будет автоматически перебрасывать на sign in screen, когда сессия вновь будет null/undefined
        setSession(session);
      });
  }, [])
  return <AuthContext.Provider value={{session, loading}}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);