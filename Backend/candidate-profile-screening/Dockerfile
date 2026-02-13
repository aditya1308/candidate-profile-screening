# -------- STAGE 1: Build Stage --------
FROM maven:3.9.9-eclipse-temurin-22 AS build

WORKDIR /app

# Copy pom.xml first (for dependency caching)
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build application
RUN mvn clean package -DskipTests


# -------- STAGE 2: Runtime Stage --------
FROM eclipse-temurin:22-jdk-alpine

WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Render sets PORT automatically
EXPOSE 8080

# Run application using Render's PORT
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -jar app.jar"]
