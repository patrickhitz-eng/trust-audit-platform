import './globals.css';

export const metadata = {
  title: 'Trust Audit Platform — Liechtenstein',
  description: 'Professionelle Audit-Software für Liechtensteiner Trustees',
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
