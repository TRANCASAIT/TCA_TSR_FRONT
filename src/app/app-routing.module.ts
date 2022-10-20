import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientesComponent } from './components/clientes/clientes.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { SolicitudesComponent } from './components/solicitudes/solicitudes.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { NavigationComponent } from './navigation/navigation.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path:'login', component:LoginComponent },
  { path:'navigation', component: NavigationComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path:'solicitudes', component: SolicitudesComponent},
      { path:'clientes', component: ClientesComponent},
      { path: 'reportes', component: ReportesComponent },
      { path: 'usuarios', component: UsuariosComponent}
    ]
  },

  
];  

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
