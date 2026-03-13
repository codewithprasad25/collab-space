package com.example.collab_space.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@AllArgsConstructor
public class JwtFilter extends OncePerRequestFilter {    //OncePerRequestFilter -> as per one request the below logic will run

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;   //username ke against user ko find karega in DB if found then saved in context otherwise no

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();
        // client request -> requests are going filter out -> filtered req will be proceeded further in our controller

        String header = request.getHeader("Authorization");
        // Authorization : Bearer abc--82,,cedububw

        // Skip JWT filter for public endpoints
        if (path.equals("/login") || path.equals("/registration") || path.equals("/otp/verify")) {
            filterChain.doFilter(request, response);
            return;
        }

        if (header != null && header.startsWith("Bearer ")) {

            String token = header.substring(7);
            String username = jwtUtil.extractUsername(token);

            // authentication already set na ho
            if (username != null &&
                    SecurityContextHolder.getContext().getAuthentication() == null) {

                UserDetails user =
                        userDetailsService.loadUserByUsername(username);

                if (jwtUtil.validateToken(token, user)) {

                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(
                                    user,
                                    null,
                                    user.getAuthorities()
                            );

                    SecurityContextHolder.getContext()
                            .setAuthentication(auth);
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}