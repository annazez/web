const root = document.documentElement;

const platform = (() => {
  const ua = navigator.userAgent.toLowerCase();
  const platformName = (navigator.userAgentData?.platform ?? '').toLowerCase();
  const fingerprint = `${platformName} ${ua}`;

  if (fingerprint.includes('android')) return 'android';
  if (
    fingerprint.includes('iphone') ||
    fingerprint.includes('ipad') ||
    fingerprint.includes('ipod')
  ) {
    return 'apple';
  }
  if (fingerprint.includes('mac')) return 'apple';
  if (fingerprint.includes('win')) return 'windows';
  if (fingerprint.includes('linux')) return 'linux';
  return 'other';
})();

root.classList.add(`platform-${platform}`);

const theme = (() => {
  if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
    return localStorage.getItem('theme');
  }
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
})();
if (theme === 'dark') {
  root.classList.add('dark');
  root.style.colorScheme = 'dark';
} else {
  root.classList.remove('dark');
  root.style.colorScheme = 'light';
}
