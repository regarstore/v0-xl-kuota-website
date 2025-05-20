"use client"

import Link from "next/link"
import { ArrowLeft, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"
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

// Default cart items if no items in localStorage
const defaultCartItems: CartItem[] = [
  {
    id: 1,
    name: "XL Regular",
    data: "8 GB",
    validity: "30 Hari",
    price: 50000,
    quantity: 1,
  },
  {
    id: 2,
    name: "XL Mini",
    data: "1 GB",
    validity: "1 Hari",
    price: 5000,
    quantity: 2,
  },
]

export default function CartPage() {
  const { toast } = useToast()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [promoCode, setPromoCode] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Load cart items from localStorage on component mount
  useEffect(() => {
    const loadCartFromStorage = () => {
      try {
        const savedCart = localStorage.getItem("xlCartItems")
        if (savedCart) {
          setCartItems(JSON.parse(savedCart))
        } else {
          setCartItems(defaultCartItems)
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
        setCartItems(defaultCartItems)
      } finally {
        setIsLoading(false)
      }
    }

    loadCartFromStorage()
  }, [])

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("xlCartItems", JSON.stringify(cartItems))
    }
  }, [cartItems, isLoading])

  // Fungsi untuk mengubah jumlah item
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))

    toast({
      title: "Keranjang diperbarui",
      description: "Jumlah item telah diperbarui",
      duration: 2000,
    })
  }

  // Fungsi untuk menghapus item dari keranjang
  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))

    toast({
      title: "Item dihapus",
      description: "Item telah dihapus dari keranjang",
      duration: 2000,
    })
  }

  // Fungsi untuk menerapkan kode promo
  const applyPromoCode = () => {
    toast({
      title: "Kode promo diterapkan",
      description: `Kode promo "${promoCode}" telah diterapkan`,
      duration: 2000,
    })
    // Implementasi logika diskon akan ditambahkan di sini
  }

  // Hitung subtotal, diskon, dan total
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const discount = 0 // Akan diimplementasikan dengan logika diskon
  const total = subtotal - discount

  // Tampilkan loading state jika masih memuat
  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Memuat keranjang belanja...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/">
          <Button variant="outline" size="icon" className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Kembali</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Keranjang Belanja</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Paket Data</CardTitle>
            </CardHeader>
            <CardContent>
              {cartItems.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produk</TableHead>
                      <TableHead>Kuota</TableHead>
                      <TableHead>Masa Aktif</TableHead>
                      <TableHead className="text-right">Harga</TableHead>
                      <TableHead className="text-center">Jumlah</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.data}</TableCell>
                        <TableCell>{item.validity}</TableCell>
                        <TableCell className="text-right">Rp {item.price.toLocaleString()}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-r-none"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                              className="h-8 w-12 rounded-none text-center"
                              min={1}
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-l-none"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">Rp {(item.price * item.quantity).toLocaleString()}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Hapus</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Keranjang belanja Anda kosong.</p>
                  <Link href="/">
                    <Button className="mt-4">Belanja Sekarang</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Diskon</span>
                <span>Rp {discount.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>Rp {total.toLocaleString()}</span>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input placeholder="Kode Promo" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                  <Button variant="outline" onClick={applyPromoCode}>
                    Terapkan
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/checkout" className="w-full">
                <Button className="w-full" disabled={cartItems.length === 0}>
                  Lanjutkan ke Pembayaran
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
