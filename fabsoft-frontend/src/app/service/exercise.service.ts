import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExerciseModel } from '../model/exercise';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private API_URL = import.meta.env['NG_APP_API_URL'] + '/exercises';

  constructor(private http: HttpClient) { }

  getExercises() {
    return this.http.get<ExerciseModel[]>(this.API_URL);
  }

  getExerciseById(id: number) {
    return this.http.get<ExerciseModel>(`${this.API_URL}/${id}`);
  }

  addExercise(exercise: ExerciseModel) {
    return this.http.post<ExerciseModel>(this.API_URL, exercise);
  }

  deleteExercise(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  updateExercise(exercise: ExerciseModel) {
    return this.http.put<ExerciseModel>(`${this.API_URL}/${exercise.id}`, exercise);
  }
}
