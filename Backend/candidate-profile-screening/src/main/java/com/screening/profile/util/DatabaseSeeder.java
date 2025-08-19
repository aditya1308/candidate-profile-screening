package com.screening.profile.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class DatabaseSeeder implements ApplicationRunner {
	private final JdbcTemplate jdbcTemplate;
	private final ResourceLoader resourceLoader;

	@Autowired
	public DatabaseSeeder(JdbcTemplate jdbcTemplate, ResourceLoader resourceLoader) {
		this.jdbcTemplate = jdbcTemplate;
		this.resourceLoader = resourceLoader;
	}

	@Override
	public void run(ApplicationArguments args) {
		try {
			Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM jobs", Integer.class);
			if (count != null && count == 0) {
				Resource resource = resourceLoader.getResource("classpath:jobs_sample_data.sql");
				try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
					StringBuilder sqlBuilder = new StringBuilder();
					String line;
					while ((line = reader.readLine()) != null) {
						sqlBuilder.append(line).append('\n');
					}
					String[] statements = sqlBuilder.toString().split(";");
					for (String statement : statements) {
						if (!statement.trim().isEmpty()) {
							jdbcTemplate.execute(statement);
						}
					}
				}
				System.out.println("Seeded jobs table with sample data.");
			}
		} catch (Exception e) {
			System.err.println("DatabaseSeeder skipped or failed: " + e.getMessage());
		}
	}
}
