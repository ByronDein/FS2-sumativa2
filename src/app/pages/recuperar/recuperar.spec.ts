import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Recuperar } from './recuperar';

describe('Recuperar', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [Recuperar],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(Recuperar);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
