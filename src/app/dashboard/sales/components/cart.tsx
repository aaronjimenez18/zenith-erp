type Props = { cart: any[] }

export default function Cart({ cart }: Props) {
  return (
    <div className="w-1/4">
      <h2 className="text-xl font-bold mb-2">Carrito</h2>
      {cart.map((item, i) => (
        <div key={i} className="flex justify-between mb-1">
          <span>{item.name}</span>
          <span>{item.quantity}</span>
          <span>${item.price}</span>
        </div>
      ))}
    </div>
  )
}