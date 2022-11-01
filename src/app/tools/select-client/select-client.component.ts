import { Component, forwardRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { ServicesBackendService } from 'src/app/services/services-backend-service.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-select-client',
  templateUrl: './select-client.component.html',
  styleUrls: ['./select-client.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectClientComponent),
      multi: true
    }
  ]
})
export class SelectClientComponent implements OnInit, ControlValueAccessor {


  onChange = (_: any) => { };
  onTouch = () => { };
  clients = ''
  isDisabled: boolean | undefined;

  changeText($event: any){
    this.onChange($event.target.value);
  }
  
  writeValue(value: any): void {
    this.clients = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  clientList: any = [

    {"firstName":"Jason", "lastName":"Smith"},
    {"firstName":"Joan", "lastName":"Smith"},
    {"firstName":"Jennifer", "lastName":"Jones"}

  ];

  /** control for the selected item */
  public clientCtrl: UntypedFormControl = new UntypedFormControl();
    
  /** control for the MatSelect filter keyword */
  public clientFilterCtrl: UntypedFormControl = new UntypedFormControl();
      
  /** list of items filtered by search keyword */

  public filteredClient: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  @ViewChild('singleSelect3', { static: true })
  singleSelect3!: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  constructor(    public _backEndService: ServicesBackendService,
    private _snackBar: MatSnackBar,) { }

  async ngOnInit() {
    await this.getClient();
  }

  async getClient(){

    console.log(1,'getStaff');
    console.log(2,this.clientCtrl);
    //this._backEndService.getCustomers().subscribe((responsables: any) => { 
      //if(responsables.length > 0 && responsables.numberRecords !== 0){
      //  this.clientList = responsables
        this.clientCtrl.setValue(this.clientList[4]);
        this.filteredClient.next(this.clientList.slice());
        this.clientFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterClient(); 
          });
      //}
    //});
  }

  /**
   * Sets the initial value after the filteredCompanies are loaded initially
   */
  protected setInitialValue() {
      this.filteredClient
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {       
        this.singleSelect3.compareWith = (a: any, b: any) => a && b && a.id === b.id;
      });
  }

  protected filterClient(){

    if (!this.clientList){
      return;
    }
    let search = this.clientFilterCtrl.value;
    if(!search){
      this.filteredClient.next(this.clientList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredClient.next(
      this.clientList.filter((client: { firstName: string ; }) => client.firstName.toLowerCase().indexOf(search) > -1)
    );
  }
}
