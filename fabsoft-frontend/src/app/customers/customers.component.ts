import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CustomerModel } from '../model/customer';
import { CustomerService } from '../service/customer.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customers',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './customers.html',
  styleUrls: ['./customers.css'],
  providers: [CustomerService, Router]
})
export class CustomersComponent {
  customerList: CustomerModel[] = [];

  constructor(private customerService: CustomerService, private router: Router) { }

  ngOnInit(): void {
    this.customerService.getCustomers().subscribe((data: CustomerModel[]) => {
      this.customerList = data;
      console.log(this.customerList);
    });
  }

  addCustomer(): void {
    this.router.navigateByUrl('/customers/new');
  }

  editCustomer(id: number): void {
    this.router.navigateByUrl(`/customers/${id}`);
  }

  deleteCustomer(id: number): void {
    this.customerService.deleteCustomer(id).subscribe(() => {
      this.customerList = this.customerList.filter(customer => customer.id !== id);
    });
  }
}
