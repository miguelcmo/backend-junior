interface Props {
    params: Promise<{
        id: string
    }>
}

export default async function ProductoDetalle ({ params }: Props) {
    const { id } = await params

    return (
        <div>
            <h1>Producto ID: {id}</h1>
        </div>
    )
}