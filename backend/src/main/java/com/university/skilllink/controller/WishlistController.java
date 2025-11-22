package com.university.skilllink.controller;

import com.university.skilllink.dto.auth.AddWishlistRequest;
import com.university.skilllink.model.SkillWishlist;
import com.university.skilllink.repository.SkillWishlistRepository;
import com.university.skilllink.service.UserService;
import com.university.skilllink.service.WishlistService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class WishlistController {

    private final WishlistService wishlistService;
    private final SkillWishlistRepository wishlistRepository;
    private final UserService userService;


    @PostMapping
public ResponseEntity<?> addToWishlist(@RequestBody AddWishlistRequest req) {

    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    String email = auth.getName();

    // Convert email → userId
    String userId = userService.getUserByEmail(email).getId();

    // Call the wishlist service
    wishlistService.addWishlist(userId, req.getSkillName());

    return ResponseEntity.status(HttpStatus.CREATED).body("Wishlist added");
}


    // Simple admin / dev endpoint to list all wishlist entries
    @GetMapping
    public ResponseEntity<List<SkillWishlist>> getAll() {
        List<SkillWishlist> items = wishlistRepository.findAll();
        return ResponseEntity.ok(items);
    }
}
