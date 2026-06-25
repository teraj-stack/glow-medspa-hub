/**
 * Above-the-fold CSS inlined into the SSR <head> so the first paint can
 * happen before the full Tailwind stylesheet downloads.
 *
 * Keep this tight: design tokens + body baseline + typography + container
 * + the handful of hero/header utilities used before scroll. Everything
 * else loads via the async stylesheet swap (see __root.tsx).
 */
export const CRITICAL_CSS = `
:root{
  --background:oklch(0.985 0.004 80);
  --foreground:oklch(0.16 0.005 60);
  --ink:oklch(0.16 0.005 60);
  --alabaster:oklch(0.985 0.004 80);
  --champagne:oklch(0.54 0.078 65);
  --champagne-light:oklch(0.86 0.05 78);
  --gold:oklch(0.82 0.09 80);
  --border:oklch(0.9 0.01 70);
  --muted-foreground:oklch(0.48 0.01 60);
  --secondary:oklch(0.95 0.008 75);
  --font-serif:"Cormorant Garamond","Times New Roman",serif;
  --font-sans:"Inter",system-ui,-apple-system,sans-serif;
}
*,*::before,*::after{box-sizing:border-box;border:0 solid var(--border)}
html{-webkit-font-smoothing:antialiased;line-height:1.5;-webkit-text-size-adjust:100%}
body{margin:0;background:var(--background);color:var(--foreground);font-family:var(--font-sans);text-wrap:pretty;hyphens:auto}
h1,h2,h3,h4{font-family:var(--font-serif);font-weight:400;letter-spacing:-0.01em;text-wrap:balance;margin:0}
h1{font-size:clamp(2.5rem,5vw + 1rem,5rem);line-height:1.05}
h2{font-size:clamp(1.875rem,3vw + 0.5rem,3rem);line-height:1.15}
p{margin:0}
img,picture,video{display:block;max-width:100%;height:auto}
a{color:inherit;text-decoration:none}
.container-luxury{width:100%;margin-inline:auto;padding-inline:1.25rem;max-width:80rem}
@media (min-width:768px){.container-luxury{padding-inline:2rem}}
/* Hero shell so the LCP image and headline don't reflow once Tailwind arrives. */
.bg-alabaster{background-color:var(--alabaster)}
.text-ink{color:var(--ink)}
.text-champagne{color:var(--champagne)}
.font-serif{font-family:var(--font-serif)}
.relative{position:relative}
.overflow-hidden{overflow:hidden}
/* Layout-critical flex/grid utilities used on the homepage hero. */
.flex{display:flex}
.grid{display:grid}
.min-h-screen{min-height:100vh}
.flex-col{flex-direction:column}
.flex-1{flex:1 1 0%}
`;
