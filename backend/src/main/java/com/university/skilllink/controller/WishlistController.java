package com.university.skilllink.controller;

import com.university.skilllink.model.SkillWishlist;
import com.university.skilllink.service.WishlistService;
import com.university.skilllink.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:5173"})
public class WishlistController {

    private final WishlistService wishlistService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<SkillWishlist> addToWishlist(@RequestParam String skillName, Authentication auth) {
        String email = auth.getName();
        String userId = userService.getUserByEmail(email).getId();
        SkillWishlist w = wishlistService.addToWishlist(userId, skillName);
        return ResponseEntity.status(201).body(w);
    }

    @GetMapping
    public ResponseEntity<List<SkillWishlist>> getWishlist() {
        return ResponseEntity.ok(wishlistService.getAll());
    }

    @GetMapping("/top")
    public ResponseEntity<List<SkillWishlist>> topWishlist() {
        return ResponseEntity.ok(wishlistService.getTop());
    }
}
