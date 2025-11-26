import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TrainingPlanService } from '../service/training-plan.service';
import { TrainingPlanModel } from '../model/training-plan';

@Component({
  selector: 'app-shared-training-plan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shared-training-plan.html',
  styleUrls: ['./shared-training-plan.css']
})
export class SharedTrainingPlanComponent implements OnInit {
  trainingPlan: TrainingPlanModel | null = null;
  loading = true;
  error = false;
  token = '';

  constructor(
    private route: ActivatedRoute,
    private trainingPlanService: TrainingPlanService
  ) { }

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    if (this.token) {
      this.loadTrainingPlan();
    } else {
      this.loading = false;
      this.error = true;
    }
  }

  loadTrainingPlan() {
    this.loading = true;
    this.trainingPlanService.getTrainingPlanByShareToken(this.token).subscribe({
      next: (plan) => {
        this.trainingPlan = plan;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading training plan:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }
}
