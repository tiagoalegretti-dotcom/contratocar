const paid = new Map<string, { createdAt: number }>();

export function createPaidToken() {
  const token = crypto.randomUUID();
  paid.set(token, { createdAt: Date.now() });
  return token;
}

export function isPaidToken(token: string | null | undefined) {
  if (!token) return false;
  const row = paid.get(token);
  if (!row) return false;
  return Date.now() - row.createdAt < 1000 * 60 * 60 * 24;
}
