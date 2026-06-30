import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Pedidos } from './pedidos';

describe('Pedidos', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [Pedidos],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(Pedidos);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
