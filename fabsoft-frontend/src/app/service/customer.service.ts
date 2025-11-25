import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomerModel } from '../model/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private API_URL = import.meta.env['NG_APP_API_URL'] + '/customers';

  constructor(private http: HttpClient) { }

  getCustomers() {
    return this.http.get<CustomerModel[]>(this.API_URL);
  }

  getCustomerById(id: number) {
    return this.http.get<CustomerModel>(`${this.API_URL}/${id}`);
  }

  addCustomer(customer: CustomerModel) {
    return this.http.post<CustomerModel>(this.API_URL, customer);
  }

  deleteCustomer(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  updateCustomer(customer: CustomerModel) {
    return this.http.put<CustomerModel>(`${this.API_URL}/${customer.id}`, customer);
  }
}
