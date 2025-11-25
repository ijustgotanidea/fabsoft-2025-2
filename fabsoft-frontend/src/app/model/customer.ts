export class CustomerModel {
  id!: number;
  name!: string;
  age!: number;
  weight!: number;
  height!: number;
  exerciseDays!: ExerciseDays;
  gender!: 'Male' | 'Female';
}

export enum ExerciseDays {
  THREE_DAYS = 'THREE_DAYS',
  FOUR_DAYS = 'FOUR_DAYS',
  FIVE_DAYS = 'FIVE_DAYS',
  MORE_THAN_FIVE = 'MORE_THAN_FIVE'
}

