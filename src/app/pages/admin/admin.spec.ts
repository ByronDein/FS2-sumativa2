import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Admin } from './admin';

describe('Admin', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [Admin],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(Admin);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
