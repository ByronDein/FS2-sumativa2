import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Tienda } from './tienda';

describe('Tienda', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [Tienda],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    const fixture = TestBed.createComponent(Tienda);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
