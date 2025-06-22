export function handleGoogleLoginClick(e: React.FormEvent) {
  e.preventDefault();
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
}
