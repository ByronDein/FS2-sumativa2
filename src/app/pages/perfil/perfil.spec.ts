import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Perfil } from './perfil';

describe('Perfil', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [Perfil],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(Perfil);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
