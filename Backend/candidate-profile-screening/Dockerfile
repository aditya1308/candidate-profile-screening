# -------- STAGE 1: Build Stage --------
FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy pom.xml first (dependency caching)
COPY pom.xml .

RUN mvn dependency:go-offline

# Copy source
COPY src ./src

# Package app
RUN mvn clean package -DskipTests


# -------- STAGE 2: Runtime Stage --------
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

# Use Render's injected PORT
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -jar app.jar"]
