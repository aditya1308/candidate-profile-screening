package com.screening.profile.util.httperrors;

import org.springframework.http.HttpStatus;

import java.util.Map;

public class HttpErrors {

    private static final Map<String, HttpStatus> errorCodeToStatus = Map.of(
            "UNAUTHORIZED", HttpStatus.UNAUTHORIZED,
            "INVALID_RESUME_FORMAT", HttpStatus.BAD_REQUEST,
            "JOB_DESCRIPTION_MISSING", HttpStatus.UNPROCESSABLE_ENTITY,
            "INTERNAL_ERROR", HttpStatus.INTERNAL_SERVER_ERROR
    );

    public static HttpStatus getStatusForCode(String errorCode) {
        return errorCodeToStatus.getOrDefault(errorCode, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
