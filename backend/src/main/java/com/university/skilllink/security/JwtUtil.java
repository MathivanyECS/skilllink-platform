package com.university.skilllink.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    // Extract username (email) from token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extract expiration date from token
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Extract specific claim from token
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Extract all claims from token
    private Claims extractAllClaims(String token) {
        return Jwts
                .parser()  // ✅ Changed from parserBuilder()
                .verifyWith(getSignInKey())  // ✅ Changed from setSigningKey()
                .build()
                .parseSignedClaims(token)  // ✅ Changed from parseClaimsJws()
                .getPayload();  // ✅ Changed from getBody()
    }

    // Check if token is expired
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Validate token
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // Generate token with user details
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userDetails.getUsername());
    }

    // Generate token with extra claims
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return createToken(extraClaims, userDetails.getUsername());
    }

    // Create token
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts
                .builder()
                .claims(claims)  // ✅ Changed from setClaims()
                .subject(subject)  // ✅ Changed from setSubject()
                .issuedAt(new Date(System.currentTimeMillis()))  // ✅ Changed from setIssuedAt()
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))  // ✅ Changed from setExpiration()
                .signWith(getSignInKey())  // ✅ Simplified, removed SignatureAlgorithm
                .compact();
    }

    // Get signing key
    private SecretKey getSignInKey() {  // ✅ Changed return type from Key to SecretKey
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}