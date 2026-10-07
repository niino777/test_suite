import { getProducts } from '@/services/productService'
import { api } from '@/services/api'

jest.mock('@/services/api', () => ({ api: { get: jest.fn() }, BASE_URL: '/' }))

describe('getProducts', () => {
  it('pide el catálogo y completa la ruta de las imágenes', async () => {
    api.get.mockResolvedValue({
      data: [{ id: 1, title: 'Camiseta básica negra', price: 9990, section: 'ropa-masculina', image: 'img/products/01.svg' }]
    })

    const result = await getProducts()

    expect(api.get).toHaveBeenCalledWith('products.json')
    expect(result[0].image).toBe('/img/products/01.svg')
  })
})
