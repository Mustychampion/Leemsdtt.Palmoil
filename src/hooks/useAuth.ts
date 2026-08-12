import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/integrations/firebase/client";

export type AppRole = "super_admin" | "content" | "sales" | "support" | "marketing";

export interface AuthState {
  loading: boolean;
  session: any;
  user: User | null;
  roles: AppRole[];
}

export function useAuth(): AuthState & { refreshRoles: () => Promise<void> } {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRoles = async (userId: string | undefined) => {
    if (!userId) { setRoles([]); return; }
    try {
      const q = query(collection(db, "user_roles"), where("user_id", "==", userId));
      const querySnapshot = await getDocs(q);
      const fetchedRoles = querySnapshot.docs.map(doc => doc.data().role as AppRole);
      setRoles(fetchedRoles);
    } catch (e) {
      console.error("Failed to load roles", e);
      setRoles([]);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadRoles(currentUser.uid).finally(() => setLoading(false));
      } else {
        setRoles([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return {
    loading,
    session: user ? { user } : null,
    user,
    roles,
    refreshRoles: async () => loadRoles(user?.uid),
  };
}

export function hasAnyRole(roles: AppRole[], allowed: AppRole[]) {
  return roles.some((r) => allowed.includes(r));
}