import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListagemProntuarioComponent } from './listagem-prontuario.component';

describe('ListagemProntuarioComponent', () => {
  let component: ListagemProntuarioComponent;
  let fixture: ComponentFixture<ListagemProntuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListagemProntuarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListagemProntuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
