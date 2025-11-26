import { CustomerModel } from './customer';
import { ExerciseModel } from './exercise';

//interface to create a training plan
export interface NewTrainingPlan {
  planName: string;
  customer: CustomerModel;
  exercises: ExerciseModel[];
}

export class TrainingPlanModel {
  id!: number;
  planName!: string;
  shareToken?: string;
  customer!: CustomerModel;
  exercises!: ExerciseModel[];
}

