import { Component } from '@angular/core';
import { CustomerModel } from "../model/customer";
import { CustomerService } from '../service/customer.service';
import { AuthService } from '../service/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-customer-form',
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './add-customer-form.html',
  styleUrl: './add-customer-form.css',
  providers: [CustomerService, Router]
})

export class AddCustomerFormComponent {
  customer: CustomerModel = new CustomerModel();
  isAuthenticated: boolean = false;
  isSubmitting: boolean = false;
  bmi: number | null = null;

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private authService: AuthService
  ) {
    this.checkAuthentication();
  }

  checkAuthentication() {
    if (this.authService.isAuthenticated()) {
      this.isAuthenticated = true;
    } else {
      if (this.authService.promptForPassword()) {
        this.isAuthenticated = true;
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  calculateBMI() {
    if (this.customer.weight && this.customer.height) {
      const heightInMeters = this.customer.height / 100;
      this.bmi = this.customer.weight / (heightInMeters * heightInMeters);
    } else {
      this.bmi = null;
    }
  }

  getBMICategory(): string {
    if (!this.bmi) return '';

    if (this.bmi < 18.5) return 'Underweight';
    if (this.bmi < 25) return 'Normal';
    if (this.bmi < 30) return 'Overweight';
    return 'Obese';
  }

  getBMIClass(): string {
    if (!this.bmi) return '';

    if (this.bmi < 18.5) return 'bg-warning';
    if (this.bmi < 25) return 'bg-success';
    if (this.bmi < 30) return 'bg-warning';
    return 'bg-danger';
  }

  saveCustomer() {
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    this.customerService.addCustomer(this.customer).subscribe({
      next: (response) => {
        console.log('Customer added successfully:', response);
        this.router.navigate(['/customers']);
      },
      error: (error) => {
        console.error('Error adding customer:', error);
        this.isSubmitting = false;
        alert('Error registering customer. Please try again.');
      }
    });
  }

  cancelForm() {
    if (confirm('Are you sure you want to cancel? All unsaved data will be lost.')) {
      this.router.navigate(['/customers']);
    }
  }
}
