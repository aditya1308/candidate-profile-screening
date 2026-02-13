CREATE INDEX idx_resume_text
ON candidate
USING GIN (to_tsvector('english', resume_text));
