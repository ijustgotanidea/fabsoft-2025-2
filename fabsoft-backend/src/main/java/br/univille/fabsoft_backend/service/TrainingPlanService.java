package br.univille.fabsoft_backend.service;

import br.univille.fabsoft_backend.api.dto.TrainingPlanDTO;

public interface TrainingPlanService {
    TrainingPlanDTO[] getAllTrainingPlansByCustomerId(Long customerId);
    TrainingPlanDTO createTrainingPlan(Long customerId);
    TrainingPlanDTO createTrainingPlan(Long customerId, TrainingPlanDTO trainingPlanDTO);
    TrainingPlanDTO addExercisesToPlan(Long planId, Long[] exerciseIds);
    TrainingPlanDTO getTrainingPlan(Long planId);
    void deletePlan(Long planId);
    void removeExerciseFromPlan(Long planId, Long exerciseId);
}