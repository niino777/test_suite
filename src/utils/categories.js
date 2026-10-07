// Categorías de la tienda. Cada producto de la API trae su categoría en el campo "section".
export const SECTIONS = [
  { slug: 'ropa-masculina', label: 'Ropa Masculina', icon: 'mdi-tshirt-crew' },
  { slug: 'ropa-femenina', label: 'Ropa Femenina', icon: 'mdi-hanger' },
  { slug: 'ropa-infantil', label: 'Ropa Infantil', icon: 'mdi-human-child' },
  { slug: 'calzado', label: 'Calzado', icon: 'mdi-shoe-sneaker' }
]

export const isValidSlug = (slug) => SECTIONS.some((section) => section.slug === slug)

export const getSectionLabel = (slug) => {
  const section = SECTIONS.find((item) => item.slug === slug)
  return section ? section.label : 'Moda'
}
