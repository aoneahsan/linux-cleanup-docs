/**
 * Each locale's script face (self-hosted Noto, SIL OFL) loads only on that locale's pages: one stylesheet link,
 * added once. Latin and Cyrillic pages load nothing extra.
 */
const FONTS: Record<string, string> = {
  'zh-Hans': 'noto-sans-sc',
  hi: 'noto-sans-devanagari',
  ar: 'noto-sans-arabic',
  ja: 'noto-sans-jp',
  ur: 'noto-nastaliq-urdu',
};

if (typeof document !== 'undefined') {
  const font = FONTS[document.documentElement.lang];
  if (font && !document.querySelector('link[data-script-font]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/fonts/${font}/font.css`;
    link.dataset.scriptFont = font;
    document.head.append(link);
  }
}
