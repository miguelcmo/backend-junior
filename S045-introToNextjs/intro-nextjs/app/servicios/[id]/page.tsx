interface Props {
    params: Promise<{
        id: string
    }>
}

export default async function ServicioDetalle ({ params }: Props) {
    const { id } = await params

    return (
        <div>
            <h1>Servicio ID: {id}</h1>
        </div>
    )
}