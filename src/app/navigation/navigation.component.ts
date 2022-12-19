import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints, MediaMatcher } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { menu } from '../interfaces/menu';
import { MenuService } from '../services/menu.service';
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnDestroy{
  mobileQuery: MediaQueryList;
  _userType = localStorage.getItem("ROLE");
  menu: menu[] = [];
  userActive!:string|null;
  _mobileQueryListener: () => void;
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,private router: Router, private _menuService: MenuService, public authService: AuthService) {
    this.mobileQuery = media.matchMedia('(max-width: 800px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.cargarMenu();
  }

  cargarMenu(){

    this._menuService.getMenu(this._userType).subscribe(data=>{
       
      this.menu = data;
    })
  }

 
  shouldRun = true;
  cerrarNav(){
    this.cargarMenu()
  }
  
  logout(): void{
    this.authService.logout()
      .subscribe(res => {
        if (!res.success) {
          this.router.navigate(['/login']);
        }
      });
  }



}
