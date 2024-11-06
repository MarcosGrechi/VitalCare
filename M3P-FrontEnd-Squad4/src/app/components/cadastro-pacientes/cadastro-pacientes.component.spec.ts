import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroPacientesComponent } from './cadastro-pacientes.component';

describe('CadastroPacientesComponent', () => {
  let component: CadastroPacientesComponent;
  let fixture: ComponentFixture<CadastroPacientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroPacientesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastroPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
