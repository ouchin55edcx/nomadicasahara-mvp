export type AuthUser = {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  bio?: string | null;
  role: "tourist" | "guide" | string;
  is_active: boolean;
  verification_status?: "pending" | "verified" | "rejected" | string;
};

/** Public demo identity; partner preview pages do not authenticate users. */
export async function getCurrentUser(): Promise<AuthUser> {
  return {
    id: "demo-partner",
    full_name: "Youssef El Amrani",
    email: "demo@toledanoviajes.com",
    phone: "+212 600 000 000",
    bio: "Toledano Viajes partner dashboard demo account.",
    role: "partner",
    is_active: true,
    verification_status: "verified",
  };
}
