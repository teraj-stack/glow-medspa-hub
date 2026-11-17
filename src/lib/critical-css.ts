// Krytyczny CSS dla pierwszego ekranu — inline w <head>, żeby renderowanie
// nie czekało na pełny styles.css. Trzymamy poniżej ~3 KB.
export const CRITICAL_CSS = `
@layer base{
:root{--background:oklch(0.985 0.004 80);--foreground:oklch(0.16 0.005 60);--ink:oklch(0.16 0.005 60);--alabaster:oklch(0.985 0.004 80);--champagne:oklch(0.54 0.078 65);--border:oklch(0.9 0.01 70);--muted-foreground:oklch(0.48 0.01 60);--font-serif:"Cormorant Garamond","Times New Roman",serif;--font-sans:"Inter",system-ui,-apple-system,sans-serif;--spacing:0.25rem}
*{box-sizing:border-box;border-color:var(--border)}
html{-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
body{margin:0;background-color:var(--background);color:var(--foreground);font-family:var(--font-sans);text-wrap:pretty;hyphens:auto}
h1,h2,h3,h4{font-family:var(--font-serif);font-weight:400;letter-spacing:-0.01em;text-wrap:balance;margin:0}
h1{font-size:clamp(2.5rem,5vw + 1rem,5rem);line-height:1.05}
h2{font-size:clamp(1.875rem,3vw + 0.5rem,3rem);line-height:1.15}
p{margin:0}
a{color:inherit;text-decoration:none}
img,svg,video{display:block;max-width:100%}
.flex{display:flex}
.flex-col{flex-direction:column}
.flex-1{flex:1 1 0%}
.min-h-screen{min-height:100vh}
[hidden]{display:none!important}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
}
`;
