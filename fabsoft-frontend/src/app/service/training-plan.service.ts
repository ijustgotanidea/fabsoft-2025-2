import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NewTrainingPlan, TrainingPlanModel } from '../model/training-plan';

@Injectable({
  providedIn: 'root'
})
export class TrainingPlanService {
  private API_URL = import.meta.env['NG_APP_API_URL'] + '/training-plans';

  constructor(private http: HttpClient) { }

  getTrainingPlansByCustomerId(customerId: number) {
    return this.http.get<TrainingPlanModel[]>(`${this.API_URL}/customers/${customerId}`);
  }

  createTrainingPlan(trainingPlan: NewTrainingPlan) {
    return this.http.post(`${this.API_URL}/customers/${trainingPlan.customer.id}`, trainingPlan);
  }

  addExercisesToPlan(planId: number, exerciseIds: number[]) {
    return this.http.post(`${this.API_URL}/plan/${planId}/add-exercises`, exerciseIds);
  }

  deleteTrainingPlan(id: number) {
    return this.http.delete(`${this.API_URL}/plan/${id}`);
  }

  removeExerciseFromPlan(planId: number, exerciseId: number) {
    return this.http.delete(`${this.API_URL}/plan/${planId}/exercises/${exerciseId}`);
  }
}
