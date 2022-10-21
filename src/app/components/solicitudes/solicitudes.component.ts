import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { FloatLabelType } from '@angular/material/form-field';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


const ELEMENT_DATA: any = [
  { 
    prioridad: 1, folio:'3493', cliente:'Corning', numCaja:'tca3443' , tipoOp:'Maritimo' ,  stops:'3' ,fechaHora:'Today',
    ordTMW: '43949', estatus: 'Completa' ,factMx:'PDF' , factUS:'XML', factuMX:'XML' , factuUS:'XML', BOL:'493030043043', 
    InwardManif:'3340043034' ,ACE:'34934034' ,layout:'393403', layoutAcep:'43003' , NumCartPorte:'3993494' , XML:'XML' ,
    PDFOrig:'PDF',PDFOper:'PDF' ,comentarios:'NA'
  },
  { 
    prioridad: 1, folio:'3493', cliente:'Corning', numCaja:'tca3443' , tipoOp:'Maritimo' ,  stops:'3' ,fechaHora:'Today',
    ordTMW: '43949', estatus: 'Completa' ,factMx:'PDF' , factUS:'XML', factuMX:'XML' , factuUS:'XML', BOL:'493030043043', 
    InwardManif:'3340043034' ,ACE:'34934034' ,layout:'393403', layoutAcep:'43003' , NumCartPorte:'3993494' , XML:'XML' ,
    PDFOrig:'PDF',PDFOper:'PDF' ,comentarios:'NA'
  },
  { 
    prioridad: 1, folio:'3493', cliente:'Corning', numCaja:'tca3443' , tipoOp:'Maritimo' ,  stops:'3' ,fechaHora:'Today',
    ordTMW: '43949', estatus: 'Completa' ,factMx:'PDF' , factUS:'XML', factuMX:'XML' , factuUS:'XML', BOL:'493030043043', 
    InwardManif:'3340043034' ,ACE:'34934034' ,layout:'393403', layoutAcep:'43003' , NumCartPorte:'3993494' , XML:'XML' ,
    PDFOrig:'PDF',PDFOper:'PDF' ,comentarios:'NA'
  },
  { 
    prioridad: 1, folio:'3493', cliente:'Corning', numCaja:'tca3443' , tipoOp:'Maritimo' ,  stops:'3' ,fechaHora:'Today',
    ordTMW: '43949', estatus: 'Completa' ,factMx:'PDF' , factUS:'XML', factuMX:'XML' , factuUS:'XML', BOL:'493030043043', 
    InwardManif:'3340043034' ,ACE:'34934034' ,layout:'393403', layoutAcep:'43003' , NumCartPorte:'3993494' , XML:'XML' ,
    PDFOrig:'PDF',PDFOper:'PDF' ,comentarios:'NA'
  },
  { 
    prioridad: 1, folio:'3493', cliente:'Corning', numCaja:'tca3443' , tipoOp:'Maritimo' ,  stops:'3' ,fechaHora:'Today',
    ordTMW: '43949', estatus: 'Completa' ,factMx:'PDF' , factUS:'XML', factuMX:'XML' , factuUS:'XML', BOL:'493030043043', 
    InwardManif:'3340043034' ,ACE:'34934034' ,layout:'393403', layoutAcep:'43003' , NumCartPorte:'3993494' , XML:'XML' ,
    PDFOrig:'PDF',PDFOper:'PDF' ,comentarios:'NA'
  },
  { 
    prioridad: 1, folio:'3493', cliente:'Corning', numCaja:'tca3443' , tipoOp:'Maritimo' ,  stops:'3' ,fechaHora:'Today',
    ordTMW: '43949', estatus: 'Completa' ,factMx:'PDF' , factUS:'XML', factuMX:'XML' , factuUS:'XML', BOL:'493030043043', 
    InwardManif:'3340043034' ,ACE:'34934034' ,layout:'393403', layoutAcep:'43003' , NumCartPorte:'3993494' , XML:'XML' ,
    PDFOrig:'PDF',PDFOper:'PDF' ,comentarios:'NA'
  },
  { 
    prioridad: 1, folio:'3493', cliente:'Corning', numCaja:'tca3443' , tipoOp:'Maritimo' ,  stops:'3' ,fechaHora:'Today',
    ordTMW: '43949', estatus: 'Completa' ,factMx:'PDF' , factUS:'XML', factuMX:'XML' , factuUS:'XML', BOL:'493030043043', 
    InwardManif:'3340043034' ,ACE:'34934034' ,layout:'393403', layoutAcep:'43003' , NumCartPorte:'3993494' , XML:'XML' ,
    PDFOrig:'PDF',PDFOper:'PDF' ,comentarios:'NA'
  }
];

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss']
})




export class SolicitudesComponent implements OnInit {
  displayedColumns: string[] = ['prioridad', 'folio', 'cliente','numCaja','tipoOp','stops','fechaHora','ordTMW', 'estatus','factMX',
                                'factUS', 'factuMX','factuUS','BOL', 'InwardManif','ACE','layout','layoutAcep','NumCartPorte',
                               'XML','PDFOrig','PDFOper','comentarios','edit','delete'];
  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  })
  options = this._formBuilder.group({
    numCaja: new FormControl(''),
    folio: new FormControl(''),
    estatus: new FormControl(''),
    type: new FormControl(''),
    cliente: new FormControl(''),
    prioridad: false
  });

  matcher = new MyErrorStateMatcher();

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  search(){
    console.log('search');
  }

  add(){
    console.log('add');
  }

  edit( _element: any ){
    console.log('update', _element);
  }

  delete( _folio: number ){
    console.log('delete', _folio);
  }

  pdfclick( _id: any ){

  }


}
