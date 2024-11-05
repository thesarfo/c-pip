FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/lab-crud-0.0.1-SNAPSHOT.jar lab-crud.jar
EXPOSE 8080
CMD ["java", "-jar", "lab-crud.jar"]
