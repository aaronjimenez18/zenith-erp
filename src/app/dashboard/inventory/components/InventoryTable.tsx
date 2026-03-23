"use client";

import { useState, useMemo } from "react";
import { Product } from "@prisma/client";
import { Pencil, Trash2, Check, X, ImageIcon, Search } from "lucide-react";
import { updateProduct, deleteProduct } from "../actions";

type ProductWithEditable = Product & {
  isEditing?: boolean;
};

export function InventoryTable({ products }: { products: Product[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Product>>({});
  const [localProducts, setLocalProducts] = useState<ProductWithEditable[]>(products);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return localProducts;
    const term = searchTerm.toLowerCase();
    return localProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term) ||
        (p.barcode && p.barcode.toLowerCase().includes(term))
    );
  }, [localProducts, searchTerm]);

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditData({
      name: product.name,
      sku: product.sku,
      price: product.price,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
      barcode: product.barcode,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async (productId: string) => {
    const result = await updateProduct(productId, {
      name: editData.name,
      sku: editData.sku,
      price: editData.price,
      purchasePrice: editData.purchasePrice,
      stock: editData.stock,
      barcode: editData.barcode || null,
    });

    if (result.success) {
      setLocalProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, ...editData, barcode: editData.barcode || null }
            : p
        )
      );
      setEditingId(null);
      setEditData({});
    } else {
      alert(result.error || "Error al actualizar");
    }
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`¿Estás seguro de eliminar "${productName}"?`)) return;

    const result = await deleteProduct(productId);

    if (result.success) {
      setLocalProducts((prev) => prev.filter((p) => p.id !== productId));
    } else {
      alert(result.error || "Error al eliminar");
    }
  };

  const handleInputChange = (
    field: keyof Product,
    value: string | number | null
  ) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  if (filteredProducts.length === 0) {
    return (
      <div className="px-6 py-12 text-center text-gray-500">
        <div className="flex flex-col items-center">
          <p>{searchTerm ? "No se encontraron productos." : "No hay productos registrados aún."}</p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="mt-2 text-blue-600 hover:underline"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-4 border-b bg-gray-50">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, SKU o código de barras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
          <tr>
            <th className="px-4 py-3 text-left tracking-wider">Imagen</th>
            <th className="px-4 py-3 text-left tracking-wider">Nombre</th>
            <th className="px-4 py-3 text-left tracking-wider">SKU</th>
            <th className="px-4 py-3 text-left tracking-wider">Barras</th>
            <th className="px-4 py-3 text-right tracking-wider">P. Compra</th>
            <th className="px-4 py-3 text-right tracking-wider">P. Venta</th>
            <th className="px-4 py-3 text-right tracking-wider">Stock</th>
            <th className="px-4 py-3 text-center tracking-wider">Estado</th>
            <th className="px-4 py-3 text-center tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {filteredProducts.map((product) => (
            <tr
              key={product.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-10 w-10 rounded-md object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </td>

              {editingId === product.id ? (
                <>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={editData.name || ""}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={editData.sku || ""}
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                      className="w-24 border rounded px-2 py-1 text-sm font-mono"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={editData.barcode || ""}
                      onChange={(e) =>
                        handleInputChange("barcode", e.target.value)
                      }
                      className="w-28 border rounded px-2 py-1 text-sm font-mono"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      step="0.01"
                      value={editData.purchasePrice || 0}
                      onChange={(e) =>
                        handleInputChange(
                          "purchasePrice",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-20 border rounded px-2 py-1 text-sm text-right"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      step="0.01"
                      value={editData.price || 0}
                      onChange={(e) =>
                        handleInputChange(
                          "price",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-20 border rounded px-2 py-1 text-sm text-right"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={editData.stock || 0}
                      onChange={(e) =>
                        handleInputChange(
                          "stock",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-16 border rounded px-2 py-1 text-sm text-right"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        (editData.stock || 0) > 10
                          ? "bg-green-100 text-green-700"
                          : (editData.stock || 0) > 0
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {(editData.stock || 0) > 10
                        ? "En Stock"
                        : (editData.stock || 0) > 0
                          ? "Bajo Stock"
                          : "Agotado"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => saveEdit(product.id)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-md"
                        title="Guardar"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md"
                        title="Cancelar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-gray-500">
                    {product.sku}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-gray-500">
                    {product.barcode || "-"}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    ${product.purchasePrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {product.stock}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        product.stock > 10
                          ? "bg-green-100 text-green-700"
                          : product.stock > 0
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.stock > 10
                        ? "En Stock"
                        : product.stock > 0
                          ? "Bajo Stock"
                          : "Agotado"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => startEdit(product)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
}
