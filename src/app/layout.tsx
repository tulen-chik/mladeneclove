import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {GlobalProvider} from "@/context/context";
import styles from "./page.module.css"
import NavBar from "@/components/navBar/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "writheinfi",
  description: "Portfolio of Anastasia Soldatsenko",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <GlobalProvider>
          <html lang="en">
          <head>
              <meta name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>

          </head>

          <body className={inter.className}>
              <NavBar/>
              {children}
          </body>
          </html>
      </GlobalProvider>
  );
}
