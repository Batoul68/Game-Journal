package com.tulip.gamejournalapi.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

@Entity
@Table(name = "games")
public class Game {

    // Variables
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Game name cannot be blank")
    @Size(max = 200, message = "Game name cannot exceed 200 characters")
    private String name;

    @Column(name = "cover_image_url", length=550)
    private String coverImageUrl;

    @DecimalMin("0.0")
    @DecimalMax("5.0")
    @Digits(integer = 1, fraction = 1)
    @Column(precision = 3, scale = 1)
    private BigDecimal rating;

    @Size(max = 50, message = "Genre cannot exceed 50 characters")
    private String genre;

    @Column(columnDefinition = "TEXT")
    private String review;

    @Column(name = "release_year")
    private Integer releaseYear;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;


    // Constructors
    public Game() {}

    public Game(Long id, String name, User user) {
        this.id = id;
        this.name = name;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }

    public BigDecimal getRating() {
        return rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }

    public Integer getReleaseYear() {
        return releaseYear;
    }

    public void setReleaseYear(Integer releaseYear) {
        this.releaseYear = releaseYear;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
