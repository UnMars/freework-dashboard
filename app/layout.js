import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dashboard Free-Work",
  description: "Optimisez votre recherche de missions freelance en IT avec notre outil d'analyse de marché basé sur Free-Work",
  metadataBase: new URL('https://freework-dashboard.vercel.app/'),
  alternates: {
    canonical: '/',
    languages: {
      'fr-FR': '/',
    },
  },
  openGraph: {
    images: '/opengraph-image.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
