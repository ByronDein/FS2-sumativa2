import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Carrito } from './carrito';

describe('Carrito', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [Carrito],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(Carrito);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
