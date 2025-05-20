"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"

// Define the CartItem type for better type safety
type CartItem = {
  id: number
  name: string
  data: string
  validity: string
  price: number
  quantity: number
}

export default function Home() {
  const { toast } = useToast()
  const [cartItemCount, setCartItemCount] = useState(0)

  // Load cart item count from localStorage on component mount
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const savedCart = localStorage.getItem("xlCartItems")
        if (savedCart) {
          const cartItems: CartItem[] = JSON.parse(savedCart)
          const count = cartItems.reduce((total, item) => total + item.quantity, 0)
          setCartItemCount(count)
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }

    // Update cart count on initial load
    updateCartCount()

    // Set up event listener for storage changes
    window.addEventListener("storage", updateCartCount)

    // Custom event for cart updates within the same window
    window.addEventListener("cartUpdated", updateCartCount)

    return () => {
      window.removeEventListener("storage", updateCartCount)
      window.removeEventListener("cartUpdated", updateCartCount)
    }
  }, [])

  // Function to add product to cart
  const addToCart = (id: number, name: string, data: string, validity: string, price: number) => {
    try {
      // Get existing cart from localStorage
      const existingCartJSON = localStorage.getItem("xlCartItems")
      const cart: CartItem[] = existingCartJSON ? JSON.parse(existingCartJSON) : []

      // Check if product already exists in cart
      const existingItemIndex = cart.findIndex((item) => item.id === id)

      if (existingItemIndex >= 0) {
        // Update quantity if product already in cart
        cart[existingItemIndex].quantity += 1
        toast({
          title: "Jumlah diperbarui",
          description: `${name} sudah ada di keranjang, jumlah diperbarui`,
          duration: 2000,
        })
      } else {
        // Add new product to cart
        cart.push({
          id,
          name,
          data,
          validity,
          price,
          quantity: 1,
        })
        toast({
          title: "Ditambahkan ke keranjang",
          description: `${name} telah ditambahkan ke keranjang`,
          duration: 2000,
        })
      }

      // Save updated cart to localStorage
      localStorage.setItem("xlCartItems", JSON.stringify(cart))

      // Update cart count
      const count = cart.reduce((total, item) => total + item.quantity, 0)
      setCartItemCount(count)

      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event("cartUpdated"))
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Gagal menambahkan ke keranjang",
        description: "Terjadi kesalahan saat menambahkan produk ke keranjang",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              XL
            </div>
            <span className="font-bold text-xl">XL Paket Data</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Beranda
            </Link>
            <Link href="#packages" className="text-sm font-medium transition-colors hover:text-primary">
              Paket Data
            </Link>
            <Link href="#promo" className="text-sm font-medium transition-colors hover:text-primary">
              Promo
            </Link>
            <Link href="#contact" className="text-sm font-medium transition-colors hover:text-primary">
              Kontak
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/cart">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
                <span className="sr-only">Keranjang</span>
              </Button>
            </Link>
            <Button>Masuk</Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Paket Data XL Terbaik untuk Kebutuhan Internet Anda
                </h1>
                <p className="max-w-[600px] text-white/90 md:text-xl">
                  Nikmati kecepatan internet yang stabil dengan harga terjangkau. Pilih paket data yang sesuai dengan
                  kebutuhan Anda.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="#packages">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90">
                      Lihat Paket
                    </Button>
                  </Link>
                  <Link href="#promo">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      Promo Spesial
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  alt="XL Internet Packages"
                  width={400}
                  height={400}
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="packages" className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="outline" className="border-blue-600 text-blue-600">
                  Paket Data
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Pilih Paket Data Anda</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Kami menyediakan berbagai pilihan paket data yang sesuai dengan kebutuhan Anda.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <PackageCard
                id={1}
                title="XL Lite"
                data="2 GB"
                validity="7 Hari"
                price={15000}
                features={["Kuota Utama 2 GB", "Akses Semua Aplikasi", "Kecepatan 4G"]}
                onAddToCart={addToCart}
              />
              <PackageCard
                id={2}
                title="XL Regular"
                data="8 GB"
                validity="30 Hari"
                price={50000}
                features={["Kuota Utama 8 GB", "Akses Semua Aplikasi", "Kecepatan 4G", "Bonus Nelpon 30 Menit"]}
                popular={true}
                onAddToCart={addToCart}
              />
              <PackageCard
                id={3}
                title="XL Premium"
                data="16 GB"
                validity="30 Hari"
                price={80000}
                features={[
                  "Kuota Utama 16 GB",
                  "Akses Semua Aplikasi",
                  "Kecepatan 4G",
                  "Bonus Nelpon 60 Menit",
                  "Bonus SMS 100 Pesan",
                ]}
                onAddToCart={addToCart}
              />
              <PackageCard
                id={4}
                title="XL Super"
                data="32 GB"
                validity="30 Hari"
                price={120000}
                features={[
                  "Kuota Utama 32 GB",
                  "Akses Semua Aplikasi",
                  "Kecepatan 4G",
                  "Bonus Nelpon 100 Menit",
                  "Bonus SMS 200 Pesan",
                ]}
                onAddToCart={addToCart}
              />
              <PackageCard
                id={5}
                title="XL Unlimited"
                data="Unlimited"
                validity="30 Hari"
                price={200000}
                features={[
                  "Kuota Utama Unlimited",
                  "Akses Semua Aplikasi",
                  "Kecepatan 4G",
                  "Bonus Nelpon Unlimited",
                  "Bonus SMS Unlimited",
                ]}
                onAddToCart={addToCart}
              />
              <PackageCard
                id={6}
                title="XL Mini"
                data="1 GB"
                validity="1 Hari"
                price={5000}
                features={["Kuota Utama 1 GB", "Akses Semua Aplikasi", "Kecepatan 4G"]}
                onAddToCart={addToCart}
              />
            </div>
          </div>
        </section>

        <section id="promo" className="w-full py-12 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="outline" className="border-blue-600 text-blue-600">
                  Promo Spesial
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Dapatkan Penawaran Spesial</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Nikmati promo spesial untuk pembelian paket data XL.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 md:grid-cols-2">
              <PromoCard
                title="Diskon 20%"
                description="Dapatkan diskon 20% untuk pembelian paket XL Regular dan Premium. Berlaku hingga akhir bulan."
                code="XL20OFF"
              />
              <PromoCard
                title="Bonus 5GB"
                description="Dapatkan bonus kuota 5GB untuk pembelian paket XL Super dan Unlimited. Berlaku untuk pembelian pertama."
                code="BONUS5GB"
              />
            </div>
          </div>
        </section>

        <section id="contact" className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Hubungi Kami</h2>
                <p className="text-muted-foreground md:text-xl">
                  Jika Anda memiliki pertanyaan atau membutuhkan bantuan, jangan ragu untuk menghubungi kami.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-blue-600"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span>0800-123-4567</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-blue-600"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <span>info@xlpaketdata.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-blue-600"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>Jl. Gatot Subroto No. 123, Jakarta Selatan</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Nama
                      </label>
                      <input
                        id="name"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Masukkan nama Anda"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Masukkan email Anda"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Subjek
                    </label>
                    <input
                      id="subject"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Masukkan subjek pesan"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Pesan
                    </label>
                    <textarea
                      id="message"
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Masukkan pesan Anda"
                    />
                  </div>
                  <Button className="w-full">Kirim Pesan</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              XL
            </div>
            <span className="font-bold">XL Paket Data</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} XL Paket Data. Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Syarat & Ketentuan
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Kebijakan Privasi
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function PackageCard({ id, title, data, validity, price, features, popular = false, onAddToCart }) {
  return (
    <Card className={`relative overflow-hidden ${popular ? "border-blue-600 shadow-lg" : ""}`}>
      {popular && (
        <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-xs font-medium">Populer</div>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-4xl font-bold">
            {data}
            <span className="text-sm font-normal text-muted-foreground"> / {validity}</span>
          </div>
          <div className="text-2xl font-bold">Rp {price.toLocaleString()}</div>
        </div>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-blue-600"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <div className="flex w-full gap-2">
          <Link href={`/product/${id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              Detail
            </Button>
          </Link>
          <Button className="flex-1" onClick={() => onAddToCart(id, title, data, validity, price)}>
            Beli
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

function PromoCard({ title, description, code }) {
  const { toast } = useToast()

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast({
          title: "Kode disalin",
          description: `Kode promo ${code} telah disalin ke clipboard`,
          duration: 2000,
        })
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
        toast({
          title: "Gagal menyalin kode",
          description: "Silakan salin kode secara manual",
          variant: "destructive",
          duration: 3000,
        })
      })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{description}</p>
        <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-md">
          <code className="font-mono font-bold">{code}</code>
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            Salin
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Gunakan Sekarang</Button>
      </CardFooter>
    </Card>
  )
}
