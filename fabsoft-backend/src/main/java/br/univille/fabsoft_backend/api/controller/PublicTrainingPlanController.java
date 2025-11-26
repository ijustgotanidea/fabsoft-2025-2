package br.univille.fabsoft_backend.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.univille.fabsoft_backend.api.dto.TrainingPlanDTO;
import br.univille.fabsoft_backend.service.TrainingPlanService;

@RestController
@RequestMapping("/api/v1/public/training-plans")
public class PublicTrainingPlanController {

    @Autowired
    private TrainingPlanService trainingPlanService;

    @GetMapping("/share/{token}")
    public ResponseEntity<TrainingPlanDTO> getTrainingPlanByShareToken(@PathVariable("token") String token) {
        TrainingPlanDTO trainingPlan = trainingPlanService.getTrainingPlanByShareToken(token);
        if (trainingPlan != null) {
            return new ResponseEntity<>(trainingPlan, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
