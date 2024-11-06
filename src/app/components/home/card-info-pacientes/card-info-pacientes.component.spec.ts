import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardInfoPacientesComponent } from './card-info-pacientes.component';

describe('CardInfoPacientesComponent', () => {
  let component: CardInfoPacientesComponent;
  let fixture: ComponentFixture<CardInfoPacientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardInfoPacientesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardInfoPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
