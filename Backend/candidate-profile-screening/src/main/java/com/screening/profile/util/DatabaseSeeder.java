package com.screening.profile.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.nio.file.Files;
import java.util.List;

@Component
public class DatabaseSeeder {
    private final JdbcTemplate jdbcTemplate;
    private final ResourceLoader resourceLoader;

    @Autowired
    public DatabaseSeeder(JdbcTemplate jdbcTemplate, ResourceLoader resourceLoader) {
        this.jdbcTemplate = jdbcTemplate;
        this.resourceLoader = resourceLoader;
    }

    @PostConstruct
    public void seedJobsTable() {
        Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM jobs", Integer.class);
        if (count != null && count == 0) {
            try {
                Resource resource = resourceLoader.getResource("classpath:jobs_sample_data.sql");
                List<String> lines = Files.readAllLines(resource.getFile().toPath());
                String sql = String.join("\n", lines);
                for (String statement : sql.split(";")) {
                    if (!statement.trim().isEmpty()) {
                        jdbcTemplate.execute(statement);
                    }
                }
                System.out.println("Seeded jobs table with sample data.");
            } catch (Exception e) {
                System.err.println("Failed to seed jobs table: " + e.getMessage());
            }
        }
    }
}
