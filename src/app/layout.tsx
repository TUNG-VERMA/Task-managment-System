import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Secure Task Manager",
  description: "Production-ready task manager with auth, encryption and task CRUD",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
