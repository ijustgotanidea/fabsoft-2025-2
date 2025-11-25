package br.univille.fabsoft_backend.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.univille.fabsoft_backend.api.dto.ExerciseDTO;
import br.univille.fabsoft_backend.api.dto.TrainingPlanDTO;
import br.univille.fabsoft_backend.domain.entity.Customer;
import br.univille.fabsoft_backend.domain.entity.Exercise;
import br.univille.fabsoft_backend.domain.entity.TrainingPlan;
import br.univille.fabsoft_backend.domain.enums.ExerciseDays;
import br.univille.fabsoft_backend.repository.CustomerRepository;
import br.univille.fabsoft_backend.repository.ExerciseRepository;
import br.univille.fabsoft_backend.repository.TrainingPlanRepository;
import br.univille.fabsoft_backend.service.CustomerService;
import br.univille.fabsoft_backend.service.ExerciseService;
import br.univille.fabsoft_backend.service.TrainingPlanService;

@Service
public class TrainingPlanServiceImpl implements TrainingPlanService {

    @Autowired
    private CustomerService customerService;
    
    @Autowired
    private ExerciseService exerciseService;
    
    @Autowired
    private TrainingPlanRepository trainingPlanRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private ExerciseRepository exerciseRepository;

    @Override
    public TrainingPlanDTO[] getAllTrainingPlansByCustomerId(Long customerId) {
        List<TrainingPlan> history = trainingPlanRepository.findAllByCustomerId(customerId);
        return history.stream()
            .map(this::convertToDTO)
            .toArray(TrainingPlanDTO[]::new);
    }

    @Override
    @Transactional
    public TrainingPlanDTO createTrainingPlan(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
            .orElse(null);
        if (customer == null) {
            return null;
        }

        TrainingPlan plan = new TrainingPlan();
        plan.setCustomer(customer);
        plan.setPlanName("New Training Plan");
        plan.setExercises(new ArrayList<>());
        trainingPlanRepository.save(plan);
        return convertToDTO(plan);
    }

    @Override
    @Transactional
    public TrainingPlanDTO createTrainingPlan(Long customerId, TrainingPlanDTO trainingPlanDTO) {
        Customer customer = customerRepository.findById(customerId)
            .orElse(null);
        if (customer == null) {
            return null;
        }

        TrainingPlan plan = new TrainingPlan();
        plan.setCustomer(customer);
        plan.setPlanName(trainingPlanDTO != null ? trainingPlanDTO.getPlanName() : "New Training Plan");

        List<Exercise> exercises = new ArrayList<>();
        if (trainingPlanDTO != null && trainingPlanDTO.getExercises() != null) {
            for (ExerciseDTO exerciseDTO : trainingPlanDTO.getExercises()) {
                Exercise exercise = exerciseRepository.findById(exerciseDTO.getId())
                    .orElse(null);
                if (exercise != null) {
                    exercises.add(exercise);
                }
            }
        }

        plan.setExercises(exercises);

        trainingPlanRepository.save(plan);
        return convertToDTO(plan);
    }

    @Override
    @Transactional
    public TrainingPlanDTO addExercisesToPlan(Long planId, Long[] exerciseIds) {
        TrainingPlan plan = trainingPlanRepository.findById(planId).orElse(null);
        if (plan == null) {
            return null;
        }

        List<Exercise> exercisesToAdd = new ArrayList<>();
        for (Long exerciseId : exerciseIds) {
            Exercise exercise = exerciseRepository.findById(exerciseId).orElse(null);
            if (exercise != null) {
                exercisesToAdd.add(exercise);
            }
        }
        plan.getExercises().addAll(exercisesToAdd);
        trainingPlanRepository.save(plan);
        return convertToDTO(plan);
    }

    @Override
    public TrainingPlanDTO getTrainingPlan(Long planId) {
        TrainingPlan plan = trainingPlanRepository.findById(planId).orElse(null);
        return plan != null ? convertToDTO(plan) : null;
    }

    @Override
    @Transactional
    public void deletePlan(Long planId) {
        trainingPlanRepository.deleteById(planId);
    }

    @Override
    @Transactional
    public void removeExerciseFromPlan(Long planId, Long exerciseId) {
        TrainingPlan plan = trainingPlanRepository.findById(planId).orElse(null);

        if (plan != null && plan.getExercises() != null) {
            plan.setExercises(plan.getExercises().stream()
                .filter(exercise -> !exercise.getId().equals(exerciseId))
                .collect(Collectors.toList()));
            trainingPlanRepository.save(plan);
        }
    }

    private TrainingPlanDTO convertToDTO(TrainingPlan plan) {
        TrainingPlanDTO dto = new TrainingPlanDTO();
        dto.setId(plan.getId());
        dto.setCustomerId(plan.getCustomer().getId());
        dto.setPlanName(plan.getPlanName());
        dto.setExercises(plan.getExercises().stream()
            .map(exercise -> {
                ExerciseDTO exerciseDTO = new ExerciseDTO();
                BeanUtils.copyProperties(exercise, exerciseDTO);
                return exerciseDTO;
            })
            .collect(Collectors.toList()));
        return dto;
    }

    private int getExercisesPerDay(ExerciseDays exerciseDays) {
        return switch (exerciseDays) {
            case THREE_DAYS -> 6;
            case FOUR_DAYS -> 5;
            case FIVE_DAYS -> 4;
            case MORE_THAN_FIVE -> 3;
        };
    }
}