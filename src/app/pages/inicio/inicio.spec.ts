import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Inicio } from './inicio';

describe('Inicio', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [Inicio],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(Inicio);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
