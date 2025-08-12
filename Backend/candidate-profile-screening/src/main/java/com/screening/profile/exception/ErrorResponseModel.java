package com.screening.profile.exception;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ErrorResponseModel {
    private String code;
    private String message;

    public ErrorResponseModel(String code, String message) {
        this.code = code;
        this.message = message;
    }
}