export default function calcularTotalConImpuesto(subtotal) {
    const impuesto = subtotal * 0.19;
    const total = subtotal + impuesto;

    return {
        subtotal,
        impuesto,
        total
    };
}