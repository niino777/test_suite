import { mount, RouterLinkStub } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import ProductCard from '@/components/ProductCard.vue'

const vuetify = createVuetify({ components, directives })

const product = {
  id: 7,
  title: 'Polera básica',
  price: 25,
  description: 'Polera de algodón',
  image: 'https://example.com/polera.jpg',
  section: 'ropa-masculina'
}

const mountCard = (props = {}) =>
  mount(ProductCard, {
    props: { product, ...props },
    global: { plugins: [vuetify], stubs: { RouterLink: RouterLinkStub } }
  })

describe('ProductCard', () => {
  it('muestra el título, la imagen y la categoría del producto', () => {
    const wrapper = mountCard()

    expect(wrapper.text()).toContain('Polera básica')
    expect(wrapper.text()).toContain('Ropa Masculina')
    expect(wrapper.find('img').attributes('alt')).toBe('Polera básica')
  })

  it('emite "toggle-favorite" con el id al presionar el corazón', async () => {
    const wrapper = mountCard()

    await wrapper.find('[data-test="favorite-btn"]').trigger('click')

    expect(wrapper.emitted('toggle-favorite')[0]).toEqual([7])
  })

  it('emite "add-to-cart" con el producto al presionar Agregar', async () => {
    const wrapper = mountCard()

    await wrapper.find('[data-test="add-to-cart-btn"]').trigger('click')

    expect(wrapper.emitted('add-to-cart')[0]).toEqual([product])
  })
})
