"use client";

import { useState } from "react";
import { Product } from "@prisma/client";
import { createSale } from "@/app/dashboard/inventory/actions";

interface CartItem extends Product {
  quantity: number;
}

export default function POS({ products }: { products: Product[] }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return alert("Producto sin stock");

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert("No puedes vender más de lo que hay en stock");
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);

    const items = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const res = await createSale(items);

    if (res?.success) {
      alert("¡Venta realizada con éxito!");
      setCart([]);
    } else {
      alert(res?.error || "Error al procesar la venta");
    }
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* Lista de Productos Disponibles */}
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-xl font-bold">Productos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => addToCart(product)}
              className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md cursor-pointer transition-shadow"
            >
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-sm text-gray-500 font-mono">{product.sku}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-blue-600 font-bold">
                  ${product.price.toFixed(2)}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded ${product.stock > 0 ? "bg-green-100" : "bg-red-100"}`}
                >
                  Stock: {product.stock}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carrito / Resumen de Venta */}
      <div className="bg-gray-50 p-6 rounded-lg border h-fit sticky top-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          🛒 Carrito
        </h2>

        {cart.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            El carrito está vacío
          </p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-400">
                    {item.quantity} x ${item.price}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            ))}

            <div className="pt-4 border-t border-gray-300">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Procesando..." : "Confirmar Venta"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
