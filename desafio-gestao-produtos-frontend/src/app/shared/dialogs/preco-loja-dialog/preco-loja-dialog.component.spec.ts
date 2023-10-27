import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrecoLojaDialogComponent } from './preco-loja-dialog.component';

describe('PrecoLojaDialogComponent', () => {
  let component: PrecoLojaDialogComponent;
  let fixture: ComponentFixture<PrecoLojaDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrecoLojaDialogComponent]
    });
    fixture = TestBed.createComponent(PrecoLojaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
