const priceFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0
})

export const formatPrice = (value) => priceFormatter.format(value)

export const formatDate = (isoDate) =>
  new Date(isoDate).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })

// Imagen de respaldo (SVG en línea) para cuando una foto no carga
export const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'>" +
  "<rect width='100%' height='100%' fill='%23e9e9e9'/>" +
  "<text x='50%' y='50%' font-family='sans-serif' font-size='24' fill='%23888' text-anchor='middle'>ModaUno</text></svg>"
