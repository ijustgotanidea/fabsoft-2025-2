package br.univille.fabsoft_backend.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.univille.fabsoft_backend.api.dto.TrainingPlanDTO;
import br.univille.fabsoft_backend.service.TrainingPlanService;

@RestController
@RequestMapping("/api/v1/training-plans")
public class TrainingPlanController {

    @Autowired
    private TrainingPlanService trainingPlanService;

    @GetMapping("/customers/{customerId}")
    public ResponseEntity<TrainingPlanDTO[]> getTrainingPlansByCustomerId(@PathVariable("customerId") Long customerId) {
        TrainingPlanDTO[] history = trainingPlanService.getAllTrainingPlansByCustomerId(customerId);
        return new ResponseEntity<>(history, HttpStatus.OK); 
    }

    @PostMapping("/customers/{customerId}")
    public ResponseEntity<TrainingPlanDTO> createTrainingPlan(
            @PathVariable("customerId") Long customerId,
            @RequestBody(required = false) TrainingPlanDTO trainingPlanDTO) {
        TrainingPlanDTO trainingPlan = trainingPlanService.createTrainingPlan(customerId, trainingPlanDTO);

        if (trainingPlan != null) {
            return new ResponseEntity<>(trainingPlan, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/plan/{planId}/add-exercises")
    public ResponseEntity<TrainingPlanDTO> addExercisesToPlan(
            @PathVariable("planId") Long planId,
            @RequestBody Long[] exerciseIds) {
        TrainingPlanDTO trainingPlan = trainingPlanService.addExercisesToPlan(planId, exerciseIds);
        if (trainingPlan != null) {
            return new ResponseEntity<>(trainingPlan, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/plan/{planId}")
    public ResponseEntity<TrainingPlanDTO> getTrainingPlan(@PathVariable("planId") Long planId) {
        TrainingPlanDTO trainingPlan = trainingPlanService.getTrainingPlan(planId);
        if (trainingPlan != null) {
            return new ResponseEntity<>(trainingPlan, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/plan/{planId}")
    public ResponseEntity<Void> deleteTrainingPlan(@PathVariable("planId") Long planId) {
        trainingPlanService.deletePlan(planId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/plan/{planId}/exercises/{exerciseId}")
    public ResponseEntity<Void> removeExerciseFromPlan(
            @PathVariable("planId") Long planId,
            @PathVariable("exerciseId") Long exerciseId) {
        trainingPlanService.removeExerciseFromPlan(planId, exerciseId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}