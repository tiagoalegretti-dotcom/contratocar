export function siteUrl() {
  const raw =
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://contratocar.com.br";
  return raw.replace(/\/$/, "");
}

export const SITE_URL = "https://contratocar.com.br";
