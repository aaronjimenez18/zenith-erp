"use client";

import { useState, useEffect } from "react";
import { createProduct } from "../app/dashboard/inventory/actions";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

export default function ProductForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [marginsEnabled, setMarginsEnabled] = useState(false);
  const [margins, setMargins] = useState({ profitMargin: 30, wholesaleMargin: 15 });
  const [autoPrice, setAutoPrice] = useState(true);
  const [autoWholesale, setAutoWholesale] = useState(true);
  const [purchasePrice, setPurchasePrice] = useState("");
  const [calculatedPrice, setCalculatedPrice] = useState("");
  const [calculatedWholesale, setCalculatedWholesale] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setIsOpen(false); resetForm(); }
    };
    document.addEventListener("keydown", handler);
    const controller = new AbortController();
    fetch("/api/business", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        setMarginsEnabled(data.marginsEnabled ?? false);
        if (data.profitMargin !== undefined) {
          setMargins({ profitMargin: data.profitMargin, wholesaleMargin: data.wholesaleMargin });
        }
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error(err);
      });
    return () => { document.removeEventListener("keydown", handler); controller.abort(); };
  }, [isOpen]);

  useEffect(() => {
    if (!marginsEnabled) return;
    if (purchasePrice && autoPrice) {
      const pp = parseFloat(purchasePrice) || 0;
      const price = pp * (1 + margins.profitMargin / 100);
      setCalculatedPrice(price.toFixed(2));
    }
  }, [purchasePrice, margins.profitMargin, autoPrice, marginsEnabled]);

  useEffect(() => {
    if (!marginsEnabled) return;
    if (purchasePrice && autoWholesale) {
      const pp = parseFloat(purchasePrice) || 0;
      const wholesale = pp * (1 + margins.wholesaleMargin / 100);
      setCalculatedWholesale(wholesale.toFixed(2));
    }
  }, [purchasePrice, margins.wholesaleMargin, autoWholesale, marginsEnabled]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setImagePreview(data.url);
        const imageInput = document.querySelector(
          'input[name="imageUrl"]'
        ) as HTMLInputElement;
        if (imageInput) {
          imageInput.value = data.url;
        }
      } else {
        toast.error("Error al subir imagen", { description: data.error || "Verifica el formato e intenta de nuevo." });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error de conexión al subir la imagen.");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setImagePreview(null);
    setIsUploading(false);
    setPurchasePrice("");
    setCalculatedPrice("");
    setCalculatedWholesale("");
    setAutoPrice(true);
    setAutoWholesale(true);
  };

  const handlePriceManualChange = () => {
    setAutoPrice(false);
  };

  const handleWholesaleManualChange = () => {
    setAutoWholesale(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition font-medium shadow-sm"
      >
        + Nuevo Producto
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={(e) => { if (e.target === e.currentTarget) { setIsOpen(false); resetForm(); } }}>
          <div className="glass-modal p-6 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">Agregar Nuevo Producto</h2>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  resetForm();
                }}
                className="p-2 hover:bg-white/30 rounded-xl transition-colors text-slate-500"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              action={async (formData) => {
                await createProduct(formData);
                setIsOpen(false);
                resetForm();
              }}
              className="space-y-4"
            >
              <input type="hidden" name="imageUrl" value={imagePreview || ""} />

              <div>
                <label htmlFor="prod-name" className="block text-sm font-bold text-slate-600 mb-1">
                  Nombre
                </label>
                <input
                  id="prod-name"
                  name="name"
                  type="text"
                  required
                  className="w-full p-3 glass-input rounded-xl text-sm"
                  placeholder="Ej. Producto A"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="prod-sku" className="block text-sm font-bold text-slate-600 mb-1">
                    SKU
                  </label>
                  <input
                    id="prod-sku"
                    name="sku"
                    type="text"
                    required
                    className="w-full p-3 glass-input rounded-xl text-sm"
                    placeholder="PROD-001"
                  />
                </div>
                <div>
                  <label htmlFor="prod-barcode" className="block text-sm font-bold text-slate-600 mb-1">
                    Código de Barras
                  </label>
                  <input
                    id="prod-barcode"
                    name="barcode"
                    type="text"
                    className="w-full p-3 glass-input rounded-xl text-sm"
                    placeholder="123456789"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="prod-purchase" className="block text-sm font-bold text-slate-600 mb-1">
                  Precio de Compra
                </label>
                <input
                  id="prod-purchase"
                  name="purchasePrice"
                  type="number"
                  step="0.01"
                  value={purchasePrice}
                  onChange={(e) => {
                    setPurchasePrice(e.target.value);
                    setAutoPrice(true);
                    setAutoWholesale(true);
                  }}
                  className="w-full p-3 glass-input rounded-xl text-sm"
                  placeholder="0.00"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {marginsEnabled
                    ? "Al ingresar, se calculan automáticamente los precios de venta."
                    : "Ingresa los precios de venta manualmente."}
                </p>
              </div>

              {marginsEnabled ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="prod-price" className="text-sm font-bold text-slate-600">
                        Precio de Venta
                      </label>
                      {calculatedPrice && autoPrice && (
                        <span className="text-xs text-slate-500">
                          +{margins.profitMargin}%
                        </span>
                      )}
                    </div>
                    <input
                      id="prod-price"
                      name="price"
                      type="number"
                      step="0.01"
                      required
                      value={autoPrice ? calculatedPrice : undefined}
                      onChange={() => {}}
                      onFocus={handlePriceManualChange}
                      className="w-full p-3 glass-input rounded-xl text-sm"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="prod-wholesale" className="text-sm font-bold text-slate-600">
                        Precio Mayoreo
                      </label>
                      {calculatedWholesale && autoWholesale && (
                        <span className="text-xs text-slate-500">
                          +{margins.wholesaleMargin}%
                        </span>
                      )}
                    </div>
                    <input
                      id="prod-wholesale"
                      name="wholesalePrice"
                      type="number"
                      step="0.01"
                      value={autoWholesale ? calculatedWholesale : undefined}
                      onChange={handleWholesaleManualChange}
                      onFocus={handleWholesaleManualChange}
                      className="w-full p-3 glass-input rounded-xl text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="prod-price" className="text-sm font-bold text-slate-600 mb-1">
                      Precio de Venta
                    </label>
                    <input
                      id="prod-price"
                      name="price"
                      type="number"
                      step="0.01"
                      required
                      className="w-full p-3 glass-input rounded-xl text-sm"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label htmlFor="prod-wholesale" className="text-sm font-bold text-slate-600 mb-1">
                      Precio Mayoreo
                    </label>
                    <input
                      id="prod-wholesale"
                      name="wholesalePrice"
                      type="number"
                      step="0.01"
                      className="w-full p-3 glass-input rounded-xl text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="prod-stock" className="block text-sm font-bold text-slate-600 mb-1">
                  Stock Inicial
                </label>
                <input
                  id="prod-stock"
                  name="stock"
                  type="number"
                  required
                  className="w-full p-3 glass-input rounded-xl text-sm"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">
                  Imagen del Producto
                </label>
                <div className="border-2 border-dashed border-white/50 rounded-2xl p-4 text-center glass-card">
                  {imagePreview ? (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-32 mx-auto rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="absolute -top-2 -right-2 bg-slate-700 text-white rounded-full p-1.5 shadow-sm"
                        aria-label="Eliminar imagen"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="flex flex-col items-center text-slate-500">
                        <Upload className="w-8 h-8 mb-2" />
                        <span className="text-sm">
                          {isUploading
                            ? "Subiendo..."
                            : "Haz clic o arrastra una imagen"}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-slate-600 hover:bg-white/30 rounded-xl font-medium text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 disabled:opacity-50 shadow-sm font-bold text-sm"
                >
                  {isUploading ? "Subiendo..." : "Guardar Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
