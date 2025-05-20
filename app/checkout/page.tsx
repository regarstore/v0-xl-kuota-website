"use client"

import Link from "next/link"
import { ArrowLeft, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// Define the CartItem type for better type safety
type CartItem = {
  id: number
  name: string
  data: string
  validity: string
  price: number
  quantity: number
}

export default function CheckoutPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [orderItems, setOrderItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [paymentMethod, setPaymentMethod] = useState({
    type: "ewallet",
    provider: "dana",
  })

  // Load cart items from localStorage on component mount
  useEffect(() => {
    const loadCartFromStorage = () => {
      try {
        const savedCart = localStorage.getItem("xlCartItems")
        if (savedCart) {
          const items = JSON.parse(savedCart)
          if (items.length === 0) {
            // Redirect to cart if no items
            router.push("/cart")
            return
          }
          setOrderItems(items)
        } else {
          // Redirect to cart if no items
          router.push("/cart")
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat memuat keranjang belanja",
          variant: "destructive",
          duration: 3000,
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadCartFromStorage()
  }, [router, toast])

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target
    setCustomerInfo((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  // Handle payment method changes
  const handlePaymentTypeChange = (value) => {
    setPaymentMethod((prev) => ({
      ...prev,
      type: value,
    }))
  }

  const handlePaymentProviderChange = (value) => {
    setPaymentMethod((prev) => ({
      ...prev,
      provider: value,
    }))
  }

  // Handle checkout submission
  const handleCheckout = () => {
    // Validate form
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast({
        title: "Form tidak lengkap",
        description: "Silakan lengkapi semua informasi pelanggan",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    // In a real app, you would send this data to your backend
    // For now, we'll just show a success message and clear the cart
    toast({
      title: "Pesanan berhasil",
      description: "Terima kasih telah berbelanja di XL Paket Data",
      duration: 3000,
    })

    // Clear cart
    localStorage.removeItem("xlCartItems")

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("cartUpdated"))

    // Redirect to home page
    setTimeout(() => {
      router.push("/")
    }, 2000)
  }

  const subtotal = orderItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const discount = 0
  const total = subtotal - discount

  // Tampilkan loading state jika masih memuat
  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Memuat data checkout...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/cart">
          <Button variant="outline" size="icon" className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Kembali</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pelanggan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    placeholder="Masukkan nama lengkap"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Masukkan email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon XL</Label>
                <Input
                  id="phone"
                  placeholder="Masukkan nomor telepon XL"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-muted-foreground">Paket data akan diaktifkan pada nomor ini</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metode Pembayaran</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={paymentMethod.type} onValueChange={handlePaymentTypeChange}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="ewallet">E-Wallet</TabsTrigger>
                  <TabsTrigger value="bank">Transfer Bank</TabsTrigger>
                  <TabsTrigger value="card">Kartu Kredit</TabsTrigger>
                </TabsList>
                <TabsContent value="ewallet" className="p-4">
                  <RadioGroup defaultValue={paymentMethod.provider} onValueChange={handlePaymentProviderChange}>
                    <div className="flex items-center space-x-2 border rounded-md p-3 mb-3">
                      <RadioGroupItem value="dana" id="dana" />
                      <Label htmlFor="dana" className="flex-1">
                        DANA
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-3 mb-3">
                      <RadioGroupItem value="ovo" id="ovo" />
                      <Label htmlFor="ovo" className="flex-1">
                        OVO
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-3 mb-3">
                      <RadioGroupItem value="gopay" id="gopay" />
                      <Label htmlFor="gopay" className="flex-1">
                        GoPay
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-3">
                      <RadioGroupItem value="linkaja" id="linkaja" />
                      <Label htmlFor="linkaja" className="flex-1">
                        LinkAja
                      </Label>
                    </div>
                  </RadioGroup>
                </TabsContent>
                <TabsContent value="bank" className="p-4">
                  <RadioGroup defaultValue="bca" onValueChange={handlePaymentProviderChange}>
                    <div className="flex items-center space-x-2 border rounded-md p-3 mb-3">
                      <RadioGroupItem value="bca" id="bca" />
                      <Label htmlFor="bca" className="flex-1">
                        Bank BCA
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-3 mb-3">
                      <RadioGroupItem value="mandiri" id="mandiri" />
                      <Label htmlFor="mandiri" className="flex-1">
                        Bank Mandiri
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-3 mb-3">
                      <RadioGroupItem value="bni" id="bni" />
                      <Label htmlFor="bni" className="flex-1">
                        Bank BNI
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-3">
                      <RadioGroupItem value="bri" id="bri" />
                      <Label htmlFor="bri" className="flex-1">
                        Bank BRI
                      </Label>
                    </div>
                  </RadioGroup>
                </TabsContent>
                <TabsContent value="card" className="p-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Nomor Kartu</Label>
                      <Input id="card-number" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Tanggal Kadaluarsa</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-name">Nama pada Kartu</Label>
                      <Input id="card-name" placeholder="Nama pada kartu" />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.data} • {item.validity} • x{item.quantity}
                    </div>
                  </div>
                  <div className="font-medium">Rp {(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}
              <Separator />
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
            </CardContent>
            <CardFooter>
              <Button className="w-full flex items-center gap-2" onClick={handleCheckout}>
                <CreditCard className="h-4 w-4" />
                Bayar Sekarang
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
