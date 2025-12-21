package com.university.skilllink.repository;

import com.university.skilllink.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Aggregation;
import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByReviewedId(String reviewedId);
    Optional<Review> findBySessionIdAndReviewerId(String sessionId, String reviewerId);
    List<Review> findByReviewedIdAndIsPublicTrue(String reviewedId);
    
    @Aggregation(pipeline = {
        "{ $match: { reviewedId: ?0 } }",
        "{ $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } }"
    })
    RatingStats getRatingStatsByReviewedId(String reviewedId);
    
    interface RatingStats {
        Double getAverage();
        Long getCount();
    }
}