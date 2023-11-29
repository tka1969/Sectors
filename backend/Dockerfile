

FROM maven:3.9.5-eclipse-temurin-17 AS build
RUN mkdir -p /workspace
WORKDIR /workspace
COPY pom.xml /workspace
COPY src /workspace/src
RUN mvn -f pom.xml compile package


#FROM eclipse-temurin:17
FROM openjdk:15
#VOLUME /tmp
#COPY target/sectors-0.0.1-SNAPSHOT.jar sectors.jar
COPY --from=build /workspace/target/sectors-0.0.1-SNAPSHOT.jar sectors.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/sectors.jar"]


#FROM maven:3.6.1-jdk-8-slim AS build
#RUN mkdir -p /workspace
#WORKDIR /workspace
#COPY pom.xml /workspace
#COPY src /workspace/src
#RUN mvn -f pom.xml clean package

#FROM openjdk:8-alpine
#COPY --from=build /workspace/target/*.jar app.jar
#EXPOSE 8080
#ENTRYPOINT ["java","-jar","app.jar"]
