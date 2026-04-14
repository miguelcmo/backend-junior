interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function ProductoDetalle({ params }: Props) {
  const { id } = await params

  return (
    <div>
      <h1>Detalle del Producto</h1>
      <p>ID: {id}</p>
    </div>
  )
}