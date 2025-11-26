package br.univille.fabsoft_backend.api.dto;

import java.util.List;

import lombok.Data;

@Data
public class TrainingPlanDTO {
    private Long id;
    private Long customerId;
    private String planName;
    private String shareToken;
    private List<ExerciseDTO> exercises;
}