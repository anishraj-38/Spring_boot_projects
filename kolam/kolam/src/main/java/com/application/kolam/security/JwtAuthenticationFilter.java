package com.application.kolam.security;

import com.application.kolam.service.CustomUserDetailsService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private static final String BEARER_PREFIX = "Bearer ";
    private static final String AUTHORIZATION_HEADER = "Authorization";

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService, CustomUserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        try {
            String requestPath = request.getRequestURI();
            logger.debug("Processing request: {} {}", request.getMethod(), requestPath);

            // Extract JWT token from request
            String jwt = extractJwtFromRequest(request);

            if (jwt == null) {
                logger.debug("No JWT token found in request");
                filterChain.doFilter(request, response);
                return;
            }

            // Extract username from token
            String username = extractUsernameFromToken(jwt);

            if (username == null) {
                logger.warn("Could not extract username from JWT token");
                filterChain.doFilter(request, response);
                return;
            }

            // Check if user is already authenticated
            if (SecurityContextHolder.getContext().getAuthentication() != null) {
                logger.debug("User {} is already authenticated", username);
                filterChain.doFilter(request, response);
                return;
            }

            // Authenticate user
            authenticateUser(request, jwt, username);

        } catch (ExpiredJwtException e) {
            logger.warn("JWT token is expired: {}", e.getMessage());
            handleJwtException(response, "Token expired", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
            handleJwtException(response, "Token unsupported", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        } catch (MalformedJwtException e) {
            logger.error("JWT token is malformed: {}", e.getMessage());
            handleJwtException(response, "Token malformed", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        } catch (SignatureException e) {
            logger.error("JWT signature validation failed: {}", e.getMessage());
            handleJwtException(response, "Invalid token signature", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        } catch (IllegalArgumentException e) {
            logger.error("JWT token compact is invalid: {}", e.getMessage());
            handleJwtException(response, "Invalid token", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        } catch (Exception e) {
            logger.error("Unexpected error during JWT authentication", e);
            handleJwtException(response, "Authentication error", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return;
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Extract JWT token from the Authorization header
     */
    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);

        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX)) {
            String token = bearerToken.substring(BEARER_PREFIX.length());
            logger.debug("JWT token extracted from Authorization header");
            return token;
        }

        return null;
    }

    /**
     * Extract username from JWT token
     */
    private String extractUsernameFromToken(String jwt) {
        try {
            String username = jwtService.extractUsername(jwt);
            logger.debug("Username extracted from token: {}", username);
            return username;
        } catch (Exception e) {
            logger.error("Failed to extract username from JWT token", e);
            throw e; // Re-throw to be caught by the main exception handler
        }
    }

    /**
     * Authenticate user and set security context
     */
    private void authenticateUser(HttpServletRequest request, String jwt, String username) {
        try {
            // Load user details
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            logger.debug("User details loaded for username: {}", username);

            // Validate token
            if (jwtService.validateToken(jwt, userDetails)) {
                // Create authentication token
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

                // Set authentication details
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Set authentication in security context
                SecurityContextHolder.getContext().setAuthentication(authToken);

                logger.info("Successfully authenticated user: {} with authorities: {}",
                        username, userDetails.getAuthorities());
            } else {
                logger.warn("JWT token validation failed for user: {}", username);
            }

        } catch (UsernameNotFoundException e) {
            logger.warn("User not found: {}", username);
            throw new IllegalArgumentException("User not found: " + username, e);
        } catch (Exception e) {
            logger.error("Error during user authentication for username: {}", username, e);
            throw e;
        }
    }

    /**
     * Handle JWT exceptions by setting appropriate response
     */
    private void handleJwtException(HttpServletResponse response, String message, int status) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String jsonResponse = String.format(
                "{\"error\": \"Authentication Failed\", \"message\": \"%s\", \"status\": %d}",
                message, status
        );

        response.getWriter().write(jsonResponse);
        logger.debug("JWT exception response sent: {}", message);
    }

    /**
     * Skip filtering for certain paths (optional - you can customize this)
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();

        // Skip JWT validation for public endpoints
        return path.startsWith("/api/auth/") ||
                path.startsWith("/api/public/") ||
                path.equals("/error") ||
                path.startsWith("/swagger-ui") ||
                path.startsWith("/v3/api-docs");
    }
}