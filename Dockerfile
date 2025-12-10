# ---------- STAGE 1: Build ----------
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copy only pom first (better caching)
COPY pom.xml .

# Download dependencies (cache layer)
RUN mvn dependency:go-offline

# Now copy source code
COPY src ./src

# Build the JAR
RUN mvn -B -DskipTests clean package


# ---------- STAGE 2: Runtime ----------
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 9090

# Run the application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]

