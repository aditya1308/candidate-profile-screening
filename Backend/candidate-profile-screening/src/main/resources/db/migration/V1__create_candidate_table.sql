CREATE TABLE IF NOT EXISTS candidate (
    id BIGSERIAL PRIMARY KEY,
    date_of_birth VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    file_data BYTEA,
    matched_skills BYTEA,
    name VARCHAR(255),
    phone_number VARCHAR(255) NOT NULL,
    resume_text TEXT,
    score DOUBLE PRECISION,
    status VARCHAR(50),
    summary VARCHAR(1000),
    unique_id VARCHAR(255)
);
