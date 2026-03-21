"use client";

import { useState } from "react";
import { createProduct } from "../app/dashboard/inventory/actions";
import { Upload, X } from "lucide-react";

export default function ProductForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
        alert(data.error || "Error al subir la imagen");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error al subir la imagen");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setImagePreview(null);
    setIsUploading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-medium"
      >
        + Nuevo Producto
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Agregar Nuevo Producto</h2>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  resetForm();
                }}
                className="p-1 hover:bg-gray-100 rounded-md"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full border rounded-md p-2"
                  placeholder="Ej. Producto A"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU
                  </label>
                  <input
                    name="sku"
                    type="text"
                    required
                    className="w-full border rounded-md p-2"
                    placeholder="PROD-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código de Barras
                  </label>
                  <input
                    name="barcode"
                    type="text"
                    className="w-full border rounded-md p-2"
                    placeholder="123456789"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio de Venta
                  </label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    required
                    className="w-full border rounded-md p-2"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio de Compra
                  </label>
                  <input
                    name="purchasePrice"
                    type="number"
                    step="0.01"
                    className="w-full border rounded-md p-2"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Inicial
                </label>
                <input
                  name="stock"
                  type="number"
                  required
                  className="w-full border rounded-md p-2"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagen del Producto
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {imagePreview ? (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-32 mx-auto rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="flex flex-col items-center text-gray-500">
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
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
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
