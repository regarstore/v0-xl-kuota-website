"use client"

import Link from "next/link"
import { ArrowLeft, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

// Define the CartItem type for better type safety
type CartItem = {
  id: number
  name: string
  data: string
  validity: string
  price: number
  quantity: number
}

// Define the Product type
type Product = {
  id: string
  name: string
  data: string
  validity: string
  price: number
  description: string
  features: string[]
  instructions: string[]
  terms: string[]
}

// Sample product data
const productData: Record<string, Product> = {
  "1": {
    id: "1",
    name: "XL Lite",
    data: "2 GB",
    validity: "7 Hari",
    price: 15000,
    description: "Paket data XL Lite dengan kuota 2 GB untuk semua akses. Masa aktif 7 hari.",
    features: ["Kuota Utama 2 GB", "Akses Semua Aplikasi", "Kecepatan 4G"],
    instructions: [
      "Beli paket data melalui website",
      "Lakukan pembayaran",
      "Masukkan nomor telepon XL Anda",
      "Paket akan aktif dalam 5-10 menit setelah pembayaran berhasil",
    ],
    terms: [
      "Paket hanya berlaku untuk pengguna XL",
      "Masa aktif dihitung sejak paket berhasil diaktifkan",
      "Kuota tidak dapat digunakan untuk tethering",
      "Kecepatan internet dapat berubah tergantung jaringan dan perangkat",
    ],
  },
  "2": {
    id: "2",
    name: "XL Regular",
    data: "8 GB",
    validity: "30 Hari",
    price: 50000,
    description: "Paket data XL Regular dengan kuota 8 GB untuk semua akses. Masa aktif 30 hari.",
    features: ["Kuota Utama 8 GB", "Akses Semua Aplikasi", "Kecepatan 4G", "Bonus Nelpon 30 Menit"],
    instructions: [
      "Beli paket data melalui website",
      "Lakukan pembayaran",
      "Masukkan nomor telepon XL Anda",
      "Paket akan aktif dalam 5-10 menit setelah pembayaran berhasil",
    ],
    terms: [
      "Paket hanya berlaku untuk pengguna XL",
      "Masa aktif dihitung sejak paket berhasil diaktifkan",
      "Kuota tidak dapat digunakan untuk tethering",
      "Kecepatan internet dapat berubah tergantung jaringan dan perangkat",
    ],
  },
  "3": {
    id: "3",
    name: "XL Premium",
    data: "16 GB",
    validity: "30 Hari",
    price: 80000,
    description: "Paket data XL Premium dengan kuota 16 GB untuk semua akses. Masa aktif 30 hari.",
    features: [
      "Kuota Utama 16 GB",
      "Akses Semua Aplikasi",
      "Kecepatan 4G",
      "Bonus Nelpon 60 Menit",
      "Bonus SMS 100 Pesan",
    ],
    instructions: [
      "Beli paket data melalui website",
      "Lakukan pembayaran",
      "Masukkan nomor telepon XL Anda",
      "Paket akan aktif dalam 5-10 menit setelah pembayaran berhasil",
    ],
    terms: [
      "Paket hanya berlaku untuk pengguna XL",
      "Masa aktif dihitung sejak paket berhasil diaktifkan",
      "Kuota tidak dapat digunakan untuk tethering",
      "Kecepatan internet dapat berubah tergantung jaringan dan perangkat",
    ],
  },
  "4": {
    id: "4",
    name: "XL Super",
    data: "32 GB",
    validity: "30 Hari",
    price: 120000,
    description: "Paket data XL Super dengan kuota 32 GB untuk semua akses. Masa aktif 30 hari.",
    features: [
      "Kuota Utama 32 GB",
      "Akses Semua Aplikasi",
      "Kecepatan 4G",
      "Bonus Nelpon 100 Menit",
      "Bonus SMS 200 Pesan",
    ],
    instructions: [
      "Beli paket data melalui website",
      "Lakukan pembayaran",
      "Masukkan nomor telepon XL Anda",
      "Paket akan aktif dalam 5-10 menit setelah pembayaran berhasil",
    ],
    terms: [
      "Paket hanya berlaku untuk pengguna XL",
      "Masa aktif dihitung sejak paket berhasil diaktifkan",
      "Kuota tidak dapat digunakan untuk tethering",
      "Kecepatan internet dapat berubah tergantung jaringan dan perangkat",
    ],
  },
  "5": {
    id: "5",
    name: "XL Unlimited",
    data: "Unlimited",
    validity: "30 Hari",
    price: 200000,
    description: "Paket data XL Unlimited dengan kuota tanpa batas untuk semua akses. Masa aktif 30 hari.",
    features: [
      "Kuota Utama Unlimited",
      "Akses Semua Aplikasi",
      "Kecepatan 4G",
      "Bonus Nelpon Unlimited",
      "Bonus SMS Unlimited",
    ],
    instructions: [
      "Beli paket data melalui website",
      "Lakukan pembayaran",
      "Masukkan nomor telepon XL Anda",
      "Paket akan aktif dalam 5-10 menit setelah pembayaran berhasil",
    ],
    terms: [
      "Paket hanya berlaku untuk pengguna XL",
      "Masa aktif dihitung sejak paket berhasil diaktifkan",
      "Fair usage policy berlaku",
      "Kecepatan internet dapat berubah tergantung jaringan dan perangkat",
    ],
  },
  "6": {
    id: "6",
    name: "XL Mini",
    data: "1 GB",
    validity: "1 Hari",
    price: 5000,
    description: "Paket data XL Mini dengan kuota 1 GB untuk semua akses. Masa aktif 1 hari.",
    features: ["Kuota Utama 1 GB", "Akses Semua Aplikasi", "Kecepatan 4G"],
    instructions: [
      "Beli paket data melalui website",
      "Lakukan pembayaran",
      "Masukkan nomor telepon XL Anda",
      "Paket akan aktif dalam 5-10 menit setelah pembayaran berhasil",
    ],
    terms: [
      "Paket hanya berlaku untuk pengguna XL",
      "Masa aktif dihitung sejak paket berhasil diaktifkan",
      "Kuota tidak dapat digunakan untuk tethering",
      "Kecepatan internet dapat berubah tergantung jaringan dan perangkat",
    ],
  },
}

export default function ProductPage({ params }) {
  const { toast } = useToast()
  const productId = params.id
  const product = productData[productId] || productData["2"] // Default to XL Regular if not found

  // Function to add product to cart
  const addToCart = (buyNow = false) => {
    try {
      // Get existing cart from localStorage
      const existingCartJSON = localStorage.getItem("xlCartItems")
      const cart: CartItem[] = existingCartJSON ? JSON.parse(existingCartJSON) : []

      // Check if product already exists in cart
      const existingItemIndex = cart.findIndex((item) => item.id.toString() === product.id)

      if (existingItemIndex >= 0) {
        // Update quantity if product already in cart
        cart[existingItemIndex].quantity += 1
        toast({
          title: "Jumlah diperbarui",
          description: `${product.name} sudah ada di keranjang, jumlah diperbarui`,
          duration: 2000,
        })
      } else {
        // Add new product to cart
        cart.push({
          id: Number.parseInt(product.id),
          name: product.name,
          data: product.data,
          validity: product.validity,
          price: product.price,
          quantity: 1,
        })
        toast({
          title: "Ditambahkan ke keranjang",
          description: `${product.name} telah ditambahkan ke keranjang`,
          duration: 2000,
        })
      }

      // Save updated cart to localStorage
      localStorage.setItem("xlCartItems", JSON.stringify(cart))

      // Redirect to cart if buyNow is true
      if (buyNow) {
        window.location.href = "/cart"
      }
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

  // Related packages (excluding current product)
  const relatedPackages = Object.values(productData)
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/">
          <Button variant="outline" size="icon" className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Kembali</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Detail Paket</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex justify-center items-center bg-gray-100 rounded-lg p-6">
          <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-4xl">
            XL
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <Badge className="mb-2">Paket Data</Badge>
            <h2 className="text-3xl font-bold">{product.name}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xl font-semibold">{product.data}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">Masa Aktif {product.validity}</span>
            </div>
            <div className="mt-4 text-3xl font-bold">Rp {product.price.toLocaleString()}</div>
          </div>
          <p className="text-muted-foreground">{product.description}</p>
          <div className="space-y-2">
            <h3 className="font-semibold">Fitur Paket:</h3>
            <ul className="space-y-1">
              {product.features.map((feature, index) => (
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
          </div>
          <div className="flex gap-4">
            <Button className="flex-1" onClick={() => addToCart(true)}>
              Beli Sekarang
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={() => addToCart(false)}>
              <ShoppingCart className="h-4 w-4" />
              Tambah ke Keranjang
            </Button>
          </div>
        </div>
      </div>

      <Card className="mt-10">
        <CardContent className="p-6">
          <Tabs defaultValue="instructions">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="instructions">Cara Penggunaan</TabsTrigger>
              <TabsTrigger value="terms">Syarat & Ketentuan</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            <TabsContent value="instructions" className="p-4">
              <h3 className="text-lg font-semibold mb-4">Cara Penggunaan</h3>
              <ol className="space-y-2 list-decimal list-inside">
                {product.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </TabsContent>
            <TabsContent value="terms" className="p-4">
              <h3 className="text-lg font-semibold mb-4">Syarat & Ketentuan</h3>
              <ul className="space-y-2 list-disc list-inside">
                {product.terms.map((term, index) => (
                  <li key={index}>{term}</li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="faq" className="p-4">
              <h3 className="text-lg font-semibold mb-4">Pertanyaan Umum</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Bagaimana cara mengecek sisa kuota?</h4>
                  <p className="text-muted-foreground">
                    Anda dapat mengecek sisa kuota melalui aplikasi myXL atau dengan menghubungi *123#.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Apakah paket dapat diperpanjang?</h4>
                  <p className="text-muted-foreground">
                    Ya, paket dapat diperpanjang dengan membeli paket yang sama sebelum masa aktif berakhir.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Apa yang terjadi jika kuota habis?</h4>
                  <p className="text-muted-foreground">
                    Jika kuota habis, Anda akan dikenakan tarif normal sesuai dengan paket Anda.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6">Paket Lainnya</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {relatedPackages.map((pkg) => (
            <RelatedPackageCard
              key={pkg.id}
              id={pkg.id}
              title={pkg.name}
              data={pkg.data}
              validity={pkg.validity}
              price={pkg.price.toLocaleString()}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function RelatedPackageCard({ id, title, data, validity, price }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-2">
          <h3 className="font-bold">{title}</h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{data}</span>
            <span className="text-muted-foreground text-sm">• {validity}</span>
          </div>
          <div className="font-bold">Rp {price}</div>
          <Link href={`/product/${id}`}>
            <Button variant="outline" className="w-full mt-2">
              Lihat Detail
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
