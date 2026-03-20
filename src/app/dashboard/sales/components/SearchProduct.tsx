'use client'

type Props = {
  products: any[]
  setFilteredProducts: (products: any[]) => void
}

export default function SearchProduct({ products, setFilteredProducts }: Props) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase()
    setFilteredProducts(
      products.filter(
        p =>
          p.name.toLowerCase().includes(term) ||
          p.sku.toLowerCase().includes(term)
      )
    )
  }

  return (
    <input
      type="text"
      placeholder="Buscar producto por nombre o SKU"
      className="border p-2 w-full mb-2 rounded"
      onChange={handleSearch}
    />
  )
}