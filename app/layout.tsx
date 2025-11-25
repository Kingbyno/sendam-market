import { AuthProvider } from "@/components/providers/auth-provider"
import { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { QueryProvider } from "@/components/providers/query-provider"
import { Header } from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import "./globals.css"
import { ThemeProvider } from "next-themes"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: { default: "Xendam", template: "%s | Xendam" },
  description: "Buy and sell with confidence using our secure escrow service.",
  icons: [{ rel: "icon", url: "/placeholder-logo.png" }],
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
  ],
  openGraph: {
    title: "Xendam - Secure P2P Marketplace",
    description: "Buy and sell with confidence using our secure escrow service.",
    url: "/",
    siteName: "Xendam",
    images: ["/placeholder.jpg"],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Xendam - Secure P2P Marketplace",
    description: "Buy and sell with confidence using our secure escrow service.",
    images: ["/placeholder.jpg"],
  },
  viewport: { width: "device-width", initialScale: 1 },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.className} antialiased`}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <div className="relative flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-background/95">
                <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
                <Header />
                <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
                  <div className="mx-auto w-full max-w-7xl">
                    {children}
                  </div>
                </main>
                <Footer />
              </div>
              <Toaster 
                position="top-right"
                closeButton
                richColors
                expand
                visibleToasts={3}
              />
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
