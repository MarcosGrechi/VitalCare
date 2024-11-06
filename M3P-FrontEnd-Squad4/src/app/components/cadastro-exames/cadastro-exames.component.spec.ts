import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroExamesComponent } from './cadastro-exames.component';

describe('CadastroExamesComponent', () => {
  let component: CadastroExamesComponent;
  let fixture: ComponentFixture<CadastroExamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroExamesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastroExamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
