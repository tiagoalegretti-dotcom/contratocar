export type AuthUser = {
  uid: string;
  email: string;
  name: string;
};

export async function userFromIdToken(idToken: string): Promise<AuthUser | null> {
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!key || !idToken) return null;
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    },
  );
  if (!res.ok) return null;
  const json = (await res.json()) as {
    users?: { localId?: string; email?: string; displayName?: string }[];
  };
  const u = json.users?.[0];
  if (!u?.localId) return null;
  return {
    uid: u.localId,
    email: u.email ?? "",
    name: u.displayName ?? "você",
  };
}

export async function userFromRequest(req: Request) {
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  return userFromIdToken(token);
}
