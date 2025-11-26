import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../service/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerModel } from '../model/customer';
import { NewTrainingPlan, TrainingPlanModel } from '../model/training-plan';
import { TrainingPlanService } from '../service/training-plan.service';
import { ExerciseModel } from '../model/exercise';
import { ExerciseService } from '../service/exercise.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-customer',
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './customer.html',
  styleUrl: './customer.css',
  providers: [CustomerService, TrainingPlanService, ExerciseService],
  standalone: true
})
export class CustomerComponent implements OnInit {
  customer: CustomerModel = new CustomerModel();
  trainingPlans: TrainingPlanModel[] = [];
  exercises: ExerciseModel[] = [];
  customerId: number = 0;

  isEditing: boolean = false;
  isSaving: boolean = false;
  showNewPlan: boolean = false;
  isCreatingPlan: boolean = false;

  sortBy: 'name' | 'exercises' = 'name';
  exerciseSearchTerm: string = '';
  bmi: number | null = null;
  originalCustomer: CustomerModel = new CustomerModel();

  newPlan: NewTrainingPlan = {
    planName: '',
    customer: this.customer,
    exercises: new Array<ExerciseModel>()
  };

  constructor(
    private customerService: CustomerService,
    private trainingPlanService: TrainingPlanService,
    private exerciseService: ExerciseService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.customerId = +id;
        this.loadCustomerData();
      }
    });
  }

  loadCustomerData(): void {
    this.customerService.getCustomerById(this.customerId).subscribe({
      next: (data: CustomerModel) => {
        this.customer = data;
        this.originalCustomer = { ...data };
        this.calculateBMI();
      },
      error: (error) => {
        console.error('Error loading customer data:', error);
        alert('Error loading customer data. Please try again.');
      }
    });

    this.loadTrainingPlans();
  }

  loadTrainingPlans(): void {
    this.trainingPlanService.getTrainingPlansByCustomerId(this.customerId).subscribe({
      next: (data: TrainingPlanModel[]) => {
        this.trainingPlans = data;
      },
      error: (error) => {
        console.error('Error loading training plans:', error);
      }
    });
  }

  toggleEdit(): void {
    if (this.isEditing) {
      this.isSaving = true;
      this.customerService.updateCustomer(this.customer).subscribe({
        next: () => {
          this.isEditing = false;
          this.isSaving = false;
          this.originalCustomer = { ...this.customer };
          alert('Customer information updated successfully!');
        },
        error: (error) => {
          console.error('Error updating customer:', error);
          this.isSaving = false;
          alert('Error updating customer. Please try again.');
        }
      });
    } else {
      this.isEditing = true;
    }
  }

  cancelEdit(): void {
    this.customer = { ...this.originalCustomer };
    this.isEditing = false;
    this.calculateBMI();
  }

  calculateBMI(): void {
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

  getExerciseDaysLabel(days: string): string {
    const labels: { [key: string]: string; } = {
      'THREE_DAYS': '3 Days per Week - Beginner',
      'FOUR_DAYS': '4 Days per Week - Intermediate',
      'FIVE_DAYS': '5 Days per Week - Advanced',
      'MORE_THAN_FIVE': 'More than 5 Days - Elite'
    };
    return labels[days] || days;
  }

  getTotalExercises(): number {
    return this.trainingPlans.reduce((total, plan) => total + plan.exercises.length, 0);
  }

  showNewPlanForm(): void {
    this.exerciseService.getExercises().subscribe({
      next: (data: ExerciseModel[]) => {
        this.exercises = data;
      },
      error: (error) => {
        console.error('Error loading exercises:', error);
      }
    });
    this.showNewPlan = true;
    this.newPlan = {
      planName: '',
      customer: this.customer,
      exercises: new Array<ExerciseModel>()
    };
  }

  isExerciseSelected(exercise: ExerciseModel): boolean {
    return this.newPlan.exercises.some(e => e.id === exercise.id);
  }

  toggleExercise(exercise: ExerciseModel): void {
    const index = this.newPlan.exercises.findIndex(e => e.id === exercise.id);
    if (index === -1) {
      this.newPlan.exercises.push({ ...exercise });
    } else {
      this.newPlan.exercises.splice(index, 1);
    }
  }

  removeExercise(exercise: ExerciseModel, planId: number): void {
    if (planId === 0) {
      const index = this.newPlan.exercises.indexOf(exercise);
      if (index > -1) {
        this.newPlan.exercises.splice(index, 1);
      }
    } else {
      if (exercise.id) {
        this.trainingPlanService.removeExerciseFromPlan(planId, exercise.id).subscribe({
          next: () => {
            this.loadTrainingPlans();
          },
          error: (error) => {
            console.error('Error removing exercise:', error);
          }
        });
      }
    }
  }

  createTrainingPlan(): void {
    if (!this.newPlan.planName) {
      console.error('Plan name is required');
      return;
    }
    console.log(this.newPlan);
    this.trainingPlanService.createTrainingPlan(this.newPlan).subscribe({
      next: () => {
        this.showNewPlan = false;
        this.loadTrainingPlans();
      },
      error: (error) => {
        console.error('Error creating training plan:', error);
      }
    });
  }

  cancelNewPlan(): void {
    this.showNewPlan = false;
  }

  deleteTrainingPlan(planId: number): void {
    this.trainingPlanService.deleteTrainingPlan(planId).subscribe({
      next: () => {
        this.loadTrainingPlans();
      },
      error: (error) => {
        console.error('Error deleting training plan:', error);
      }
    });
  }

  shareTrainingPlan(plan: TrainingPlanModel): void {
    this.trainingPlanService.generateShareLink(plan.id).subscribe({
      next: (token) => {
        const shareUrl = `${window.location.origin}/share/training-plan/${token}`;

        // Copiar para clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert(`Link compartilhável copiado!\n\n${shareUrl}\n\nO link foi copiado para a área de transferência. Compartilhe este link para permitir visualização do plano de treino.`);
        }).catch(err => {
          // Fallback se clipboard API falhar
          console.error('Error copying to clipboard:', err);
          prompt('Copie o link abaixo:', shareUrl);
        });
      },
      error: (error) => {
        console.error('Error generating share link:', error);
        alert('Erro ao gerar link compartilhável. Tente novamente.');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
