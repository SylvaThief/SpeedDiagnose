import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'menu', // Asegúrate que sea 'menu'
    pathMatch: 'full'
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'calorias',
    loadChildren: () => import('./calorias/calorias.module').then( m => m.CaloriasPageModule)
  },
  {
    path: 'finish-signup', // Añadir la ruta para la página de verificación
    loadChildren: () => import('./finish-signup/finish-signup.module').then( m => m.FinishSignupPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
