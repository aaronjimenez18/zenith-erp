"use client";

import { useState } from "react";

import { createProduct } from "../app/dashboard/inventory/actions";

export default function ProductForm() {
  const [isOpen, setIsOpen] = useState(false);

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
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Agregar Nuevo Producto</h2>

            <form
              action={async (formData) => {
                await createProduct(formData);
                setIsOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full border rounded-md p-2 mt-1"
                  placeholder="Ej. Producto A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  SKU
                </label>
                <input
                  name="sku"
                  type="text"
                  required
                  className="w-full border rounded-md p-2 mt-1"
                  placeholder="PROD-001"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Precio
                  </label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    required
                    className="w-full border rounded-md p-2 mt-1"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stock Inicial
                  </label>
                  <input
                    name="stock"
                    type="number"
                    required
                    className="w-full border rounded-md p-2 mt-1"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
