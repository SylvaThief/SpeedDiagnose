import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HomePage } from './home.page';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let httpMock: HttpTestingController;
  let authMock: jasmine.SpyObj<AngularFireAuth>;

  // Lista de alimentos
  const foodList = {
    apple: 'Manzana',
    banana: 'Plátano',
    oats: 'Avena',
    eggs: 'Huevos',
    chicken: 'Pollo',
    rice: 'Arroz',
    salad: 'Ensalada',
    beef: 'Carne de res',
    toast: 'Tostada',
    butter: 'Mantequilla',
    cheese: 'Queso',
    tea: 'Té',
    carrot: 'Zanahoria',
    broccoli: 'Brócoli',
    potato: 'Papas',
    cucumber: 'Pepino',
    spinach: 'Espinaca',
    avocado: 'Aguacate',
    strawberry: 'Fresa',
    watermelon: 'Sandía',
    pineapple: 'Piña',
    mango: 'Mango',
    grapes: 'Uvas',
    peach: 'Durazno',
    pear: 'Pera',
    melon: 'Melón',
    tomato: 'Tomate',
    lettuce: 'Lechuga',
    cabbage: 'Repollo',
    onion: 'Cebolla',
  };

  beforeEach(async () => {
    authMock = jasmine.createSpyObj('AngularFireAuth', ['currentUser']);
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: AngularFireAuth, useValue: authMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the API with random queries and ensure 4 successful requests', async () => {
    // Simular el usuario autenticado
    authMock.currentUser = Promise.resolve({
      uid: '5D7RBtZy6SSWiQAHH4jiPmkt0vt2',
      email: 'jasmine@eromail.cl'
    } as any);

    // Función para generar un query aleatorio
    const getRandomFoodQuery = () => {
      const keys = Object.keys(foodList);
      const randomIndex = Math.floor(Math.random() * keys.length);
      return keys[randomIndex];
    };

    // Llamar a la función de búsqueda de alimentos y realizar 4 solicitudes
    let successfulRequests = 0;

    while (successfulRequests < 4) {
      const randomQuery = getRandomFoodQuery();

      // Intentar hacer una solicitud
      const request = httpMock.expectOne(`https://api.api-ninjas.com/v1/nutrition?query=${randomQuery}`);
      
      // Responder de manera exitosa, no importa el contenido de la respuesta
      request.flush({}, { status: 200, statusText: 'OK' }); // Respuesta vacía con status 200

      // Incrementar el contador de solicitudes exitosas
      successfulRequests++;
    }

    // Verificar que se hayan hecho al menos 4 solicitudes
    const requests = httpMock.match({ method: 'GET' });
    expect(requests.length).toBeGreaterThanOrEqual(4);

    // Limpiar después del test
    httpMock.verify();
  });
});
