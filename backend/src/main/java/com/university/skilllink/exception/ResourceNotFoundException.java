package com.university.skilllink.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    // No-argument constructor
    public ResourceNotFoundException() {
        super();
    }

    // Constructor with custom message
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
