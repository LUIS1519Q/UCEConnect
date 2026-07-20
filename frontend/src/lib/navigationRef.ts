import type { NavigateFunction } from "react-router-dom";

let navigateRef: NavigateFunction | null = null;

export function setNavigate(navigate: NavigateFunction) {
  navigateRef = navigate;
}

export function redirectToLogin() {
  if (navigateRef) {
    navigateRef("/login", { replace: true });
  } else {
    // Fallback solo para el caso raro de que el interceptor se dispare
    // antes de que React monte (no debería pasar en la práctica).
    window.location.href = "/login";
  }
}