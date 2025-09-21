package com.application.kolam.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private static final Logger logger = LoggerFactory.getLogger(JwtService.class);

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Generate JWT token with additional claims
    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return generateToken(claims, username);
    }

    // Generate JWT token with custom claims
    public String generateToken(Map<String, Object> extraClaims, String username) {
        try {
            String token = Jwts.builder()
                    .setClaims(extraClaims)
                    .setSubject(username)
                    .setIssuedAt(new Date(System.currentTimeMillis()))
                    .setExpiration(new Date(System.currentTimeMillis() + expiration))
                    .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                    .compact();

            logger.info("Token generated successfully for user: {}", username);
            return token;
        } catch (Exception e) {
            logger.error("Error generating token for user: {}", username, e);
            throw new RuntimeException("Could not generate JWT token", e);
        }
    }

    // Extract username from token
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
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            logger.warn("JWT token is expired: {}", e.getMessage());
            throw e;
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
            throw e;
        } catch (MalformedJwtException e) {
            logger.error("JWT token is malformed: {}", e.getMessage());
            throw e;
        } catch (SignatureException e) {
            logger.error("JWT signature validation failed: {}", e.getMessage());
            throw e;
        } catch (IllegalArgumentException e) {
            logger.error("JWT token compact of handler are invalid: {}", e.getMessage());
            throw e;
        }
    }

    // Check if token is expired
    private Boolean isTokenExpired(String token) {
        try {
            Date expiration = extractExpiration(token);
            boolean expired = expiration.before(new Date());
            if (expired) {
                logger.warn("Token is expired. Expiration date: {}", expiration);
            }
            return expired;
        } catch (Exception e) {
            logger.error("Error checking token expiration", e);
            return true;
        }
    }

    // Validate token against user details
    public Boolean validateToken(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            boolean isValid = (username.equals(userDetails.getUsername()) && !isTokenExpired(token));

            logger.info("Token validation for user {}: {}", username, isValid ? "SUCCESS" : "FAILED");

            if (!isValid) {
                if (!username.equals(userDetails.getUsername())) {
                    logger.warn("Username mismatch - Token: {}, UserDetails: {}", username, userDetails.getUsername());
                }
                if (isTokenExpired(token)) {
                    logger.warn("Token is expired for user: {}", username);
                }
            }

            return isValid;
        } catch (Exception e) {
            logger.error("Token validation failed", e);
            return false;
        }
    }

    // Validate token against username (legacy method)
    public boolean validateToken(String token, String username) {
        try {
            final String tokenUsername = extractUsername(token);
            boolean isValid = username.equals(tokenUsername) && !isTokenExpired(token);

            logger.info("Token validation for user {}: {}", username, isValid ? "SUCCESS" : "FAILED");
            return isValid;
        } catch (Exception e) {
            logger.error("Token validation failed for user: {}", username, e);
            return false;
        }
    }

    // Check if token is valid (without comparing username)
    public boolean isTokenValid(String token) {
        try {
            extractAllClaims(token);
            return !isTokenExpired(token);
        } catch (Exception e) {
            logger.error("Token is invalid", e);
            return false;
        }
    }

    // Get remaining time until token expires (in milliseconds)
    public long getTokenRemainingTime(String token) {
        try {
            Date expiration = extractExpiration(token);
            return expiration.getTime() - System.currentTimeMillis();
        } catch (Exception e) {
            logger.error("Error getting token remaining time", e);
            return 0;
        }
    }
}