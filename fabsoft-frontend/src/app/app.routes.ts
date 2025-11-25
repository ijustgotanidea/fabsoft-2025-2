import { Routes } from '@angular/router';
import { CustomersComponent } from './customers/customers.component';
import { AddCustomerFormComponent } from './add-customer-form/add-customer-form';
import { LandingPageComponent } from './landing-page/landing-page';
import { CustomerComponent } from './customer/customer.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'customers/new', component: AddCustomerFormComponent },
  { path: 'customers/:id', component: CustomerComponent }
];
