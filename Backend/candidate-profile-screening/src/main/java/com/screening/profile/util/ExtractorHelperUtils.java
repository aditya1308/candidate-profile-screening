package com.screening.profile.util;

import com.screening.profile.model.Candidate;
import lombok.experimental.UtilityClass;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@UtilityClass
public class ExtractorHelperUtils {

    private static final Set<String> SECTION_HEADERS = new HashSet<>(Arrays.asList(
            "PROFESSIONAL SUMMARY", "TECHNICAL SKILLS", "EDUCATION", "PROJECTS",
            "EXPERIENCE", "WORK EXPERIENCE", "SUMMARY", "OBJECTIVE", "SKILLS"
    ));

    private static final Set<String> INSTITUTE_KEYWORDS = new HashSet<>(Arrays.asList(
            "COLLEGE", "UNIVERSITY", "INSTITUTE", "TECHNOLOGY", "ENGINEERING", "SCHOOL", "ACADEMY"
    ));

    public static  String extractEmail(String text) {
        Matcher matcher = Pattern.compile("[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+")
                .matcher(text);
        return matcher.find() ? matcher.group() : null;
    }

    public static String extractPhone(String text) {
        Matcher matcher = Pattern.compile("(?:(?:\\+\\d{1,3}[\\s-]?)?(?:\\(\\d{2,4}\\)[\\s-]?|\\d{2,4}[\\s-]?)?\\d{6,12})").matcher(text);
        while (matcher.find()) {
            String phone = matcher.group().replaceAll("[^0-9+]", "");
            if (phone.length() >= 10 && phone.length() <= 15) return phone;
        }
        return null;
    }

    public static String extractDob(String text) {
        Matcher matcher = Pattern.compile(
                        "(?:DOB|Date of Birth)[:\\s]+((?:\\d{1,2}[/-]\\d{1,2}[/-]\\d{2,4})|(?:\\d{4}[/-]\\d{1,2}[/-]\\d{1,2})|(?:\\d{1,2}\\s[A-Za-z]{3,9}\\s\\d{4}))",
                        Pattern.CASE_INSENSITIVE)
                .matcher(text);
        if (matcher.find()) {
            return matcher.group(1);
        }

        // If there’s a date on the first few lines, treat as possible DOB
        matcher = Pattern.compile(
                "(\\d{1,2}[/-]\\d{1,2}[/-]\\d{2,4}|\\d{4}[/-]\\d{1,2}[/-]\\d{1,2}|\\d{1,2}\\s[A-Za-z]{3,9}\\s\\d{4})"
        ).matcher(firstLines(text));
        if (matcher.find()) return matcher.group(1);

        return null;
    }

    public static String extractName(String text, Candidate candidate) {
        String[] lines = text.split("\\r?\\n");
        for (String line : lines) {
            line = line.trim();
            if (SECTION_HEADERS.contains(line.toUpperCase())) continue;
            if (!line.isEmpty() &&
                    (candidate.getEmail() == null || !line.contains(candidate.getEmail())) &&
                    (candidate.getPhoneNumber() == null || !line.contains(candidate.getPhoneNumber())) &&
                    !line.toLowerCase().contains("curriculum") &&
                    !line.toLowerCase().contains("resume"))
            {

                String upper = line.toUpperCase();
                boolean containsInstituteKeyword = INSTITUTE_KEYWORDS.stream().anyMatch(upper::contains);
                if (containsInstituteKeyword) continue;

                if (line.equals(line.toUpperCase())
                        && line.matches("^[A-Z ,.'-]+$")
                        && !line.toLowerCase().contains("engineer")) {
                    return line;
                }

                if (line.matches("^[A-Z][a-zA-Z ]+$") && line.split("\\s+").length <= 4) {
                    return line;
                }
            }
        }
        return null;
    }

    public static String firstLines(String text) {
        String[] lines = text.split("\\r?\\n");
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < Math.min(10, lines.length); i++) sb.append(lines[i]).append(" ");
        return sb.toString();
    }

    public static String createUniqueId(String name, String email, String phone)
    {
        try {
            String combined = name + email + phone;
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hashBytes = md.digest(combined.getBytes(StandardCharsets.UTF_8));

            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.substring(0, 10);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error generating hash", e);
        }
    }

    public static String formatPhoneNumber(String phoneNumber) {

        String digits = phoneNumber.replaceAll("\\D", "");
        if (digits.length() > 10) {
            digits = digits.substring(digits.length() - 10);
        }
        return digits;
    }

}
