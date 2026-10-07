import { api, BASE_URL } from './api'

// Las imágenes vienen como ruta relativa ("img/products/..."): les agregamos la base del sitio
export async function getProducts () {
  const { data } = await api.get('products.json')
  return data.map((product) => ({ ...product, image: `${BASE_URL}${product.image}` }))
}
