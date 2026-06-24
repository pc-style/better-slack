import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc, Id } from "../../convex/_generated/dataModel";

type SessionValue = {
  users: Doc<"users">[];
  currentUser: Doc<"users"> | undefined;
  currentUserId: Id<"users"> | undefined;
  setCurrentUserId: (id: Id<"users">) => void;
};

const SessionContext = createContext<SessionValue | null>(null);
const STORAGE_KEY = "postwork:userId";

export function SessionProvider({ children }: { children: ReactNode }) {
  const users = useQuery(api.users.list);
  const [currentUserId, setCurrentUserIdState] = useState<
    Id<"users"> | undefined
  >(() => {
    return (localStorage.getItem(STORAGE_KEY) as Id<"users"> | null) ?? undefined;
  });

  // Default to the first user once the list loads if nothing is selected
  // (or the stored id is stale).
  useEffect(() => {
    if (!users || users.length === 0) return;
    const valid = currentUserId && users.some((u) => u._id === currentUserId);
    if (!valid) setCurrentUserIdState(users[0]._id);
  }, [users, currentUserId]);

  const setCurrentUserId = (id: Id<"users">) => {
    localStorage.setItem(STORAGE_KEY, id);
    setCurrentUserIdState(id);
  };

  const value = useMemo<SessionValue>(() => {
    const currentUser = users?.find((u) => u._id === currentUserId);
    return {
      users: users ?? [],
      currentUser,
      currentUserId: currentUser?._id,
      setCurrentUserId,
    };
  }, [users, currentUserId]);

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
