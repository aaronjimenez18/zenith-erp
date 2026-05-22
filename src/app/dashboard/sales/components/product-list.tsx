type Props = {
  products: any[]
  addToCart: (product: any) => void
}

export default function ProductList({ products, addToCart }: Props) {
  return (
    <div className="w-1/2">
      <h2 className="text-xl font-bold mb-2">Productos</h2>
      {products.map(p => (
        <div key={p.id} className="flex justify-between mb-1 p-2 border">
          <span>{p.name}</span>
          <span>${p.price}</span>
          <button onClick={() => addToCart(p)} className="bg-blue-500 text-white px-2 rounded">
            +
          </button>
        </div>
      ))}
    </div>
  )
}