import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardEstatisticasComponent } from './card-estatisticas.component';

describe('CardEstatisticasComponent', () => {
  let component: CardEstatisticasComponent;
  let fixture: ComponentFixture<CardEstatisticasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardEstatisticasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardEstatisticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
