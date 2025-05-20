import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "XL Paket Data - Beli Paket Internet XL Terbaik",
  description:
    "Beli paket data internet XL terbaik dengan harga terjangkau. Nikmati kecepatan internet yang stabil untuk kebutuhan Anda.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
