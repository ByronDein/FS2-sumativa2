import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProductoDetalle } from './producto-detalle';

describe('ProductoDetalle', () => {
  beforeEach(() => localStorage.clear());

  it('debe crear la pantalla de detalle', async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoDetalle],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProductoDetalle);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
