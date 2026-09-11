export function siteUrl() {
  const raw =
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://contratocar.vercel.app";
  return raw.replace(/\/$/, "");
}
