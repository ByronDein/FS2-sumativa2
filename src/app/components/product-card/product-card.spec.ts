import { TestBed } from '@angular/core/testing';
import { Product } from '../../models';
import { ProductCard } from './product-card';

describe('ProductCard', () => {
  const product: Product = {
    id: 'p-test',
    name: 'Producto Test',
    brand: 'Marca',
    category: 'Laptops',
    price: 1000,
    stock: 2,
    image: 'assets/img/products/laptop.svg',
    description: 'Descripcion de prueba',
    featured: false,
  };

  it('debe recibir un producto por Input y emitirlo por Output', async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProductCard);
    const component = fixture.componentInstance;
    let selected = null as Product | null;

    component.product = product;
    component.addProduct.subscribe((item) => (selected = item));
    component.add();

    expect(selected).toEqual(product);
  });
});
