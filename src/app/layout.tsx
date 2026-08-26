import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Git Rescue — Fix Git mistakes safely', template: '%s — Git Rescue' },
  description: 'Interactive Git recovery guides for undoing commits, recovering branches, fixing merges, restoring files and safely recovering from common Git mistakes.',
  applicationName: 'Git Rescue',
  keywords: ['Git recovery', 'undo Git commit', 'git reflog', 'fix merge conflict', 'restore Git branch'],
  openGraph: {
    type: 'website', title: 'Git Rescue — Fix Git mistakes safely',
    description: 'Answer a few questions and get the safest Git command for your situation.',
  },
  twitter: { card: 'summary', title: 'Git Rescue — Fix Git mistakes safely', description: 'Safe, interactive Git recovery guides.' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: [
  { media: '(prefers-color-scheme: light)', color: '#fbfbfa' }, { media: '(prefers-color-scheme: dark)', color: '#090a09' },
] };

const themeScript = `(function(){try{var s=localStorage.getItem('git-rescue-theme');var d=s?s==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d)}catch(e){}})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>{children}</body>
    </html>
  );
}
