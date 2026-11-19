
/** The portal is always shown in the brand's light theme. */

function apply(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark);
  document.querySelectorAll('meta[name="theme-color"]').forEach(m => m.setAttribute('content', dark ? '#121a13' : '#f8f5ef'));
}

export function initSystemTheme() {
  if (typeof window === 'undefined') return;
  apply(false);
}

export function useIsDark() {
  return false;
}
