import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CustomerModel } from '../model/customer';
import { CustomerService } from '../service/customer.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customers',
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './customers.html',
  styleUrls: ['./customers.css'],
  providers: [CustomerService, Router]
})
export class CustomersComponent {
  customerList: CustomerModel[] = [];
  filteredCustomers: CustomerModel[] = [];
  searchTerm: string = '';
  sortColumn: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  isLoading: boolean = false;

  constructor(private customerService: CustomerService, private router: Router) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.customerService.getCustomers().subscribe({
      next: (data: CustomerModel[]) => {
        this.customerList = data;
        this.applyFiltersAndSort();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.isLoading = false;
      }
    });
  }

  applyFiltersAndSort(): void {
    let filtered = [...this.customerList];

    // Apply search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(search) ||
        customer.gender.toLowerCase().includes(search)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[this.sortColumn as keyof CustomerModel];
      let bValue: any = b[this.sortColumn as keyof CustomerModel];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      let comparison = 0;
      if (aValue > bValue) comparison = 1;
      if (aValue < bValue) comparison = -1;

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    this.filteredCustomers = filtered;
  }

  onSearchChange(): void {
    this.applyFiltersAndSort();
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFiltersAndSort();
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return 'bi-arrow-down-up';
    return this.sortDirection === 'asc' ? 'bi-sort-up' : 'bi-sort-down';
  }

  calculateBMI(customer: CustomerModel): number {
    if (customer.weight && customer.height) {
      const heightInMeters = customer.height / 100;
      return customer.weight / (heightInMeters * heightInMeters);
    }
    return 0;
  }

  getBMIClass(bmi: number): string {
    if (bmi < 18.5) return 'badge bg-warning';
    if (bmi < 25) return 'badge bg-success';
    if (bmi < 30) return 'badge bg-warning';
    return 'badge bg-danger';
  }

  addCustomer(): void {
    this.router.navigateByUrl('/customers/new');
  }

  editCustomer(id: number): void {
    this.router.navigateByUrl(`/customers/${id}`);
  }

  confirmDelete(customer: CustomerModel): void {
    if (confirm(`Are you sure you want to delete ${customer.name}? This action cannot be undone.`)) {
      this.deleteCustomer(customer.id);
    }
  }

  deleteCustomer(id: number): void {
    this.customerService.deleteCustomer(id).subscribe({
      next: () => {
        this.customerList = this.customerList.filter(customer => customer.id !== id);
        this.applyFiltersAndSort();
      },
      error: (error) => {
        console.error('Error deleting customer:', error);
        alert('Error deleting customer. Please try again.');
      }
    });
  }

  getMaleCount(): number {
    return this.customerList.filter(c => c.gender === 'Male').length;
  }

  getFemaleCount(): number {
    return this.customerList.filter(c => c.gender === 'Female').length;
  }
}
