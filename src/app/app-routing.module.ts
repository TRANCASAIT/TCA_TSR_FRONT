import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientesComponent } from './components/clientes/clientes.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { SolicitudesComponent } from './components/solicitudes/solicitudes.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { NavigationComponent } from './navigation/navigation.component';
import { EstadosComponent } from './components/estados/estados.component';
import { CiudadesComponent } from './components/ciudades/ciudades.component';
import { EstatusComponent } from './components/estatus/estatus.component';
import { StopsComponent } from './components/stops/stops.component';
import { TiposUsuariosComponent } from './components/tipos-usuarios/tipos-usuarios.component';
import { TiposOperacionesComponent } from './components/tipos-operaciones/tipos-operaciones.component';
import { AuthGuard } from './services/auth.guard';
import { environment } from 'src/environments/environment';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path:'login', component:LoginComponent },


  //ROL SA.
  { path:'navigation', component: NavigationComponent,
    canActivate: [AuthGuard],
    data: {
      role: [environment.UserRoles.Rol1]
    },
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path:'solicitudes', component: SolicitudesComponent},
      { path:'clientes', component: ClientesComponent},
      { path: 'reportes', component: ReportesComponent },
      { path: 'usuarios', component: UsuariosComponent},
      { path: 'estados', component: EstadosComponent},
      { path: 'ciudades', component: CiudadesComponent},
      { path: 'estatus', component: EstatusComponent},
      { path: 'stops', component: StopsComponent},
      { path: 'tipos-usuarios', component: TiposUsuariosComponent},
      { path: 'tipos-operaciones', component: TiposOperacionesComponent},

    ]
  },

  //ROL ADMINS.
  {
    path:'navigate', component: NavigationComponent,
    canActivate: [AuthGuard],
    data: { 
      role: [ environment.UserRoles.Rol2, environment.UserRoles.Rol3 ]
    },
    children: [
      { path:'solicitudes', component: SolicitudesComponent},
      { path:'clientes', component: ClientesComponent},
      { path: 'reportes', component: ReportesComponent },
      { path: 'usuarios', component: UsuariosComponent}
    ]
  },

  //ROL CLIENTS
  {
    path:'nav', component: NavigationComponent,
    canActivate: [AuthGuard],
    data: {
      role: [ environment.UserRoles.Rol4, environment.UserRoles.Rol5 ]
    },
    children: [
      { path:'solicitudes', component: SolicitudesComponent}
    ]
  },


  { path:'**', redirectTo: 'login', pathMatch: 'full'},
];  

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
