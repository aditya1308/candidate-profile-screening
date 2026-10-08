package com.screening.profile.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeAutofillDTO {
    private String name;
    private String dateOfBirth;
    private String phoneNumber;
    private String email;
}
