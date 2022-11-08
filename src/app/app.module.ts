import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { LoginComponent } from './login/login.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

//Components Material.
import  { ComponentsMaterialModule } from './components-material/components-material.module';
import { FormsModule } from '@angular/forms';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SolicitudesComponent } from './components/solicitudes/solicitudes.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { EstadoComponent } from './dialogs/estado/estado.component';
import { EstadosComponent } from './components/estados/estados.component';
import { CiudadesComponent } from './components/ciudades/ciudades.component';
import { CiudadComponent } from './dialogs/ciudad/ciudad.component';
import { EstatusComponent } from './components/estatus/estatus.component';
import { StopsComponent } from './components/stops/stops.component';
import { StopComponent } from './dialogs/stop/stop.component';
import { TiposUsuariosComponent } from './components/tipos-usuarios/tipos-usuarios.component';
import { TipoUsuarioComponent } from './dialogs/tipo-usuario/tipo-usuario.component';
import { EstatusComponentDialog } from './dialogs/estatus/estatus.component';
import { ClienteComponent } from './dialogs/cliente/cliente.component';
import { UsuarioComponent } from './dialogs/usuario/usuario.component';
import { TiposOperacionesComponent } from './components/tipos-operaciones/tipos-operaciones.component';
import { TipoOperacionComponent } from './dialogs/tipo-operacion/tipo-operacion.component';
import { SolicitudComponent } from './dialogs/solicitud/solicitud.component';
import { SelectClientComponent } from './tools/select-client/select-client.component';
import { DeletesComponent } from './dialogs/deletes/deletes.component';
import { UploadFileComponent } from './dialogs/upload-file/upload-file.component';
import { TmwOrderComponent } from './dialogs/tmw-order/tmw-order.component';
import { NumeroCporteComponent } from './dialogs/numero-cporte/numero-cporte.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavigationComponent,
    DashboardComponent,
    SolicitudesComponent,
    ClientesComponent,
    ReportesComponent,
    UsuariosComponent,
    EstadosComponent,
    EstadoComponent,
    CiudadesComponent,
    CiudadComponent,
    EstatusComponent,
    EstatusComponentDialog,
    StopsComponent,
    StopComponent,
    TiposUsuariosComponent,
    TipoUsuarioComponent,
    ClienteComponent,
    UsuarioComponent,
    TiposOperacionesComponent,
    TipoOperacionComponent,
    SelectClientComponent,
    DeletesComponent,
    SolicitudComponent,
    SelectClientComponent,
    UploadFileComponent,
    TmwOrderComponent,
    NumeroCporteComponent


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    ComponentsMaterialModule,
    FormsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    FlexLayoutModule,
    HttpClientModule,
    NgxMatSelectSearchModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
