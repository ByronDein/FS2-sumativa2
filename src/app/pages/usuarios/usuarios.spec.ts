import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Usuarios } from './usuarios';

describe('Usuarios', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [Usuarios],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(Usuarios);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
