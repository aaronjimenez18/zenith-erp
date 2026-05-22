type Props = {
  cart: any[]
  handleSale: () => void
}

export default function SaleSummary({ cart, handleSale }: Props) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="w-1/4 p-2 border">
      <h2 className="text-xl font-bold mb-2">Resumen</h2>
      <div>Total: ${total}</div>
      <button onClick={handleSale} className="bg-green-500 text-white px-4 py-2 mt-2 rounded">
        Registrar venta
      </button>
    </div>
  )
}