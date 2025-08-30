package com.screening.profile.exception;

public class DuplicateCandidateException extends RuntimeException {
    public DuplicateCandidateException(String message) {
        super(message);
    }
}