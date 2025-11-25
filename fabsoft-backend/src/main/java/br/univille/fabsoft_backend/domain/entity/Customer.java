package br.univille.fabsoft_backend.domain.entity;

import java.util.List;

import br.univille.fabsoft_backend.domain.enums.ExerciseDays;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private Integer age;
    private Integer weight;
    private Integer height;
    private String gender;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = true)  // Explicitly tells JPA this column can be null
    private ExerciseDays exerciseDays;
    
    @OneToMany(mappedBy = "customer")
    private List<ExecutedExercise> executedExercises;
}
