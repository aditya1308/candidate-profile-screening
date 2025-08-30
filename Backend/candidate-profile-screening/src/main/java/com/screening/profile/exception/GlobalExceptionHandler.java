package com.screening.profile.exception;

import com.screening.profile.util.httperrors.HttpErrors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ServiceException.class)
    public ResponseEntity<ErrorResponseModel> handleServiceException(ServiceException ex) {
        ErrorResponseModel error = new ErrorResponseModel(ex.getErrorCode(), ex.getMessage());
        return ResponseEntity
                .status(HttpErrors.getStatusForCode(ex.getErrorCode()))
                .body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseModel> handleGeneralException(Exception ex) {
        ErrorResponseModel error = new ErrorResponseModel(
                "INTERNAL_SERVER_ERROR",
                ex.getMessage()
        );
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(error);
    }

    @ExceptionHandler(DuplicateCandidateException.class)
    public ResponseEntity<String> handleDuplicateCandidate(DuplicateCandidateException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ex.getMessage());
    }
}
