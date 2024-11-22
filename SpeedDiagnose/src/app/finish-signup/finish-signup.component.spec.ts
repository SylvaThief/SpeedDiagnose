// finish-signup.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinishSignupPage } from './finish-signup.component'; // Asegúrate de que sea 'FinishSignupPage'
import { IonicModule } from '@ionic/angular';
import { AngularFireAuthModule } from '@angular/fire/compat/auth'; // Si estás usando Firebase

describe('FinishSignupPage', () => {
  let component: FinishSignupPage;
  let fixture: ComponentFixture<FinishSignupPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinishSignupPage ],
      imports: [IonicModule.forRoot(), AngularFireAuthModule] // Asegúrate de que los módulos estén importados correctamente
    }).compileComponents();

    fixture = TestBed.createComponent(FinishSignupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
