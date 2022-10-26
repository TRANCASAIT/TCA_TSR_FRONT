import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { ServicesBackendService } from 'src/app/services/services-backend-service.service';

@Component({
  selector: 'app-select-client',
  templateUrl: './select-client.component.html',
  styleUrls: ['./select-client.component.scss']
})
export class SelectClientComponent implements OnInit {

  staffList: any = [];


    /** control for the selected item */
    public staffCtrl: UntypedFormControl = new UntypedFormControl();
    
    /** control for the MatSelect filter keyword */
    public staffFilterCtrl: UntypedFormControl = new UntypedFormControl();
      
     /** list of items filtered by search keyword */

     public filteredStaff: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

     @ViewChild('singleSelect3', { static: true })
     singleSelect3!: MatSelect;

         /** Subject that emits when the component has been destroyed. */
    protected _onDestroy = new Subject<void>();

  constructor(    public _backEndService: ServicesBackendService,
    private _snackBar: MatSnackBar,) { }

  ngOnInit(): void {
  }

  async getStaff(){
    this._backEndService.getCustomers().subscribe((responsables: any) => { 
      if(responsables.length > 0 && responsables.numberRecords !== 0){
        this.staffList = responsables
        this.staffCtrl.setValue(this.staffList[4]);
        this.filteredStaff.next(this.staffList.slice());
        this.staffFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterStaff(); 
          });
      }
    });
  }

 


  
  /**
   * Sets the initial value after the filteredCompanies are loaded initially
   */
  protected setInitialValue() {
      this.filteredStaff
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {       
        this.singleSelect3.compareWith = (a: any, b: any) => a && b && a.id === b.id;
      });
  }

  protected filterStaff(){
    if (!this.staffList){
      return;
    }
    let search = this.staffFilterCtrl.value;
    if(!search){
      this.filteredStaff.next(this.staffList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredStaff.next(
      this.staffList.filter((staff: { staff_Name: string; }) => staff.staff_Name.toLowerCase().indexOf(search) > -1)
    );
  }
  

}
