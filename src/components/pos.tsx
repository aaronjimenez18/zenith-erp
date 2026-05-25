"use client";

import { useState, useMemo } from "react";
import { Product } from "@prisma/client";
import { createSale } from "@/app/dashboard/inventory/actions";
import { Search, X } from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";

interface CartItem extends Product {
  quantity: number;
}

export default function POS({ products }: { products: Product[] }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const searchTerm = useDebounce(searchInput, 250);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    const term = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast.error("Producto agotado", { description: "Este producto no tiene existencias." });
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast.error("Stock insuficiente", { description: "No hay más unidades disponibles." });
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

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prev) => {
      const product = prev.find((item) => item.id === id);
      if (!product) return prev;
      if (quantity < 1) return prev.filter((item) => item.id !== id);
      if (quantity > product.stock) {
        toast.error("Stock insuficiente", { description: `Solo hay ${product.stock} unidades disponibles.` });
        return prev;
      }
      return prev.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      );
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
      toast.success("Venta registrada", { description: "El stock se ha actualizado." });
      setCart([]);
    } else {
      toast.error("Error al procesar la venta", { description: res?.error || "Verifica el stock e intenta de nuevo." });
    }
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Zona de Productos */}
      <div className="md:col-span-2 flex flex-col gap-4">
        <div className="p-4 rounded-2xl border border-[#e3e2df] bg-white">
          <div className="flex gap-4 items-center">
            <h2 className="text-lg font-semibold text-slate-800 shrink-0">Productos</h2>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o SKU..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-10 py-2 glass-input rounded-xl text-sm"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-medium">
            {searchTerm ? "No se encontraron productos." : "No hay productos disponibles."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
      <div
        key={product.id}
        role="button"
        tabIndex={0}
        onClick={() => addToCart(product)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); addToCart(product); } }}
        className="p-4 rounded-2xl border border-[#e3e2df] bg-white cursor-pointer hover:bg-slate-50 hover:shadow-sm transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
                <h3 className="font-semibold text-slate-800">{product.name}</h3>
                <p className="text-sm text-slate-500 font-mono mt-0.5">{product.sku}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-slate-800 font-bold text-lg tabular-nums">
                    ${product.price.toFixed(2)}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      product.stock > 0
                    ? "bg-slate-100 text-slate-600"
                    : "bg-red-50 text-red-600"
                    }`}
                  >
                    {product.stock > 0 ? `${product.stock} uds.` : "Agotado"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Zona de Carrito */}
      <div className="rounded-2xl border border-[#e3e2df] bg-white flex flex-col sticky top-6 h-[calc(100vh-8rem)] shadow-sm">
        <div className="p-5 border-b border-[#e3e2df]">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-6 bg-[#134235] rounded-full" />
            Carrito
            {cart.length > 0 && (
              <span className="text-xs font-bold text-slate-500 ml-auto bg-slate-100 px-2 py-0.5 rounded-full">
                {cart.length} {cart.length === 1 ? "item" : "items"}
              </span>
            )}
          </h2>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-slate-500 font-medium text-sm text-center px-4">
              El carrito está vacío
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2.5 border-b border-[#e3e2df] last:border-0"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-700 truncate">{item.name}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-slate-100 border border-[#e3e2df] flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-all text-sm leading-none font-bold"
                        aria-label={`Reducir cantidad de ${item.name}`}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={item.stock}
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val)) updateQuantity(item.id, val);
                        }}
                        className="w-14 text-center text-sm font-semibold text-slate-800 bg-white border border-[#e3e2df] rounded-lg py-1 tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-slate-100 border border-[#e3e2df] flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-all text-sm leading-none font-bold"
                        aria-label={`Aumentar cantidad de ${item.name}`}
                      >
                        +
                      </button>
                      <span className="text-xs text-slate-500 ml-1">× ${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-destructive/60 hover:text-destructive text-lg ml-3 shrink-0 leading-none"
                    aria-label={`Quitar ${item.name} del carrito`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="p-5 border-t border-[#e3e2df] bg-slate-50/50 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total</span>
                <span className="text-2xl font-extrabold text-slate-800 tabular-nums">${total.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-[0.98] ${
                  loading
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                {loading ? "Procesando..." : "Confirmar Venta"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
