CREATE TABLE IF NOT EXISTS candidate (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date_of_birth VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    file_data LONGBLOB,
    matched_skills VARBINARY(1000),
    name VARCHAR(255),
    phone_number VARCHAR(255) NOT NULL,
    resume_text LONGTEXT,
    score INT,
    status ENUM('HIRED','IN_PROCESS','IN_PROCESS_ROUND1','IN_PROCESS_ROUND2','IN_PROCESS_ROUND3','ON_HOLD','REJECTED'),
    summary VARCHAR(1000),
    unique_id VARCHAR(255)
);
