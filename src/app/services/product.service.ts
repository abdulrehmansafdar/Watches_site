import { Injectable, signal } from '@angular/core';
import { ApiCallService } from './api-call.service';
import { Sign } from 'crypto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {




  constructor(private apicall:ApiCallService) { }
  getDropdownData(type: string, endpoint: string) {
  if( type.toLocaleLowerCase() === 'category'|| type.toLocaleLowerCase() === 'brand' ) {
      return this.apicall.GetcallWithoutToken(`${type}/${endpoint}`);
    }
    else{
      return this.apicall.GetcallWithToken(`${type}/${endpoint}`);
    }
}
}
