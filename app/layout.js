import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import {Toaster} from 'sonner';
import Chatbot from "@/components/chatbot";

const inter=Inter({ subsets:["latin"] });

export const metadata = {
  title: "Finance App",
  description: "One stop finance Platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${inter.className}`}>
          {/*header*/}
          <Header />
          <main className="min-h-screen">{children}</main>
        <Toaster richColors />
 <Chatbot />
        {/*footerr*/}
        <footer className="bg-blue-50 py-12">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>Made by Sravanthi</p>
            </div>
            </footer>
            {/* <Chatbot />*/}
      </body>
    </html>
    </ClerkProvider>
  );
}
