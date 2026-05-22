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
      wholesalePrice: product.wholesalePrice,
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
      wholesalePrice: editData.wholesalePrice,
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
      alert(result.error || "No se pudo guardar. Verifica los datos e intenta de nuevo.");
    }
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`¿Estás seguro de eliminar "${productName}"?`)) return;

    const result = await deleteProduct(productId);

    if (result.success) {
      setLocalProducts((prev) => prev.filter((p) => p.id !== productId));
    } else {
      alert(result.error || "No se pudo eliminar el producto. Intenta de nuevo.");
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
      <div className="px-6 py-12 text-center text-slate-500">
        <div className="flex flex-col items-center">
          <p>{searchTerm ? "No se encontraron productos." : "No hay productos registrados aún."}</p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="mt-2 text-slate-600 hover:underline"
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
      <div className="p-4 border-b border-white/40 bg-white/20">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, SKU o código de barras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 glass-input rounded-xl text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/20">
        <thead className="bg-white/30 backdrop-blur-md text-slate-500 text-xs uppercase font-bold">
          <tr>
            <th className="px-4 py-3.5 pl-6 text-left tracking-wider">Imagen</th>
            <th className="px-4 py-3.5 text-left tracking-wider">Nombre</th>
            <th className="px-3 py-3.5 text-left tracking-wider">SKU</th>
            <th className="px-3 py-3.5 text-left tracking-wider">Barras</th>
            <th className="px-4 py-3.5 text-right tracking-wider">P. Compra</th>
            <th className="px-4 py-3.5 text-right tracking-wider">P. Mayoreo</th>
            <th className="px-4 py-3.5 text-right tracking-wider">P. Venta</th>
            <th className="px-3 py-3.5 text-right tracking-wider">Stock</th>
            <th className="px-3 py-3.5 text-center tracking-wider">Estado</th>
            <th className="px-3 py-3.5 pr-6 text-center tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/20 bg-transparent">
          {filteredProducts.map((product) => (
            <tr
              key={product.id}
              className="hover:bg-white/40 transition-colors"
            >
              <td className="px-4 py-3 pl-6">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-10 w-10 rounded-md object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-md bg-white/30 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-slate-400" />
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
                      className="w-full border border-white/40 bg-white/30 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-slate-400 transition-colors"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="text"
                      value={editData.sku || ""}
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                      className="w-24 border border-white/40 bg-white/30 rounded-lg px-2 py-1.5 text-sm font-mono outline-none focus:border-slate-400 transition-colors"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="text"
                      value={editData.barcode || ""}
                      onChange={(e) =>
                        handleInputChange("barcode", e.target.value)
                      }
                      className="w-28 border border-white/40 bg-white/30 rounded-lg px-2 py-1.5 text-sm font-mono outline-none focus:border-slate-400 transition-colors"
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
                      className="w-20 border border-white/40 bg-white/30 rounded-lg px-2 py-1.5 text-sm text-right outline-none focus:border-slate-400 transition-colors"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      step="0.01"
                      value={editData.wholesalePrice || 0}
                      onChange={(e) =>
                        handleInputChange(
                          "wholesalePrice",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-20 border border-white/40 bg-white/30 rounded-lg px-2 py-1.5 text-sm text-right outline-none focus:border-slate-400 transition-colors"
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
                      className="w-20 border border-white/40 bg-white/30 rounded-lg px-2 py-1.5 text-sm text-right outline-none focus:border-slate-400 transition-colors"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="number"
                      value={editData.stock || 0}
                      onChange={(e) =>
                        handleInputChange(
                          "stock",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-16 border border-white/40 bg-white/30 rounded-lg px-2 py-1.5 text-sm text-right outline-none focus:border-slate-400 transition-colors"
                    />
                  </td>
                  <td className="px-3 py-3 text-center">
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
                  <td className="px-3 py-3 pr-6">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => saveEdit(product.id)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-md"
                        title="Guardar"
                        aria-label="Guardar cambios"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md"
                        title="Cancelar"
                        aria-label="Cancelar edición"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-4 py-3 font-semibold text-slate-800 truncate max-w-[200px]">
                    {product.name}
                  </td>
                  <td className="px-3 py-3 font-mono text-sm text-slate-500 truncate max-w-[120px]">
                    {product.sku}
                  </td>
                  <td className="px-3 py-3 font-mono text-sm text-slate-500 truncate max-w-[120px]">
                    {product.barcode || "-"}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600 tabular-nums">
                    ${product.purchasePrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600 tabular-nums">
                    ${product.wholesalePrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-800 tabular-nums">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-3 py-3 text-right font-medium text-slate-700 tabular-nums">
                    {product.stock}
                  </td>
                  <td className="px-3 py-3 text-center">
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
                  <td className="px-3 py-3 pr-6">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => startEdit(product)}
                        className="p-1.5 text-slate-500 hover:bg-white/30 rounded-md transition-colors"
                        title="Editar"
                        aria-label={`Editar ${product.name}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="p-1.5 text-destructive/60 hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                        title="Eliminar"
                        aria-label={`Eliminar ${product.name}`}
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
