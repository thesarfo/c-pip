## Description

Upon pushing to the main branch, this application triggers a CodePipeline that pushes the application's image to Amazon ECS on a Fargate Launch Type, and AWS Apprunner

**The Application Contains**
1. A Spring Boot Backend
2. An HTML, CSS, JS Frontend
3. An in memory H2 Database

Below is a description of how the deployment flow works

### 1. **Push Code to GitHub**

- You push changes to the `main` branch in this GitHub repository.
- This triggers **GitHub Actions**, as specified in the workflow (`main.yml`) in the `.github/workflows/` directory.

### 2. **GitHub Actions Workflow Execution**

Here’s what GitHub Actions does:

- **Checkout Code**: GitHub Actions checks out the code from your repository.
- **Set up JDK**: It installs JDK 17, which is needed to build the Spring Boot application.
- **Build the Application**: It runs `mvn clean package` to build the Spring Boot application. This step packages your application as a `.jar` file.
- **AWS Authentication**: The GitHub Actions pipeline uses `aws-actions/configure-aws-credentials` to securely authenticate with AWS.
- **Login to ECR**: It logs into Amazon ECR so that GitHub Actions can push the Docker image.
- **Build and Push Docker Image to ECR**:
    - `docker build` creates a Docker image from your Spring Boot application.
    - `docker push` uploads this Docker image to your Amazon ECR repository.
- Once complete, the Docker image is available in ECR, ready to be deployed.
- **Retrieve Credentials and Deploy to AppRunner**
  - Once the Docker image is available in ECR, we will retrieve an **AccessRoleARN**, **AutoScalingConfigurationARN** and **ImageIdentifier** from Amazon **SSM Parameter Store**, which will be used to configure an **AppRunner Service** to automatically deploy our image to AppRunner. Because of this setup, anytime a new image is pushed to ECR, that imaged is also deployed to **AppRunner**

### 3. **AWS CodePipeline Triggered**

AWS CodePipeline then orchestrates the deployment:

- **Source Stage**: The CodePipeline source stage is set to pull from your GitHub repository. Every time you push to `main`, CodePipeline is triggered.
- **Build Stage (Optional)**: Since GitHub Actions already builds the image, you might skip CodeBuild here. However, some setups still use CodeBuild for additional testing, if needed - for instance, i rebuild the app's jar file in CodeBuild to ensure that it works, even if it didnt work in Github Actions. I also rebuild the application's docker image here, tag it and then push it to the ECR Repository

### 4. **Amazon ECS Deployment**

The CodePipeline’s deployment stage deploys the Docker image on Amazon ECS:

- **Task Definition Update**: CodePipeline updates the ECS service’s task definition to use the latest image tag in ECR.
- **H2 Database Configuration**: Since we’re using H2, the database is entirely managed in memory. There’s no need for an external database connection, so ECS simply deploys the container with no additional setup needed for database persistence.
- **ECS Service Update**: ECS pulls the latest image from ECR and initiates the deployment. If using a rolling deployment strategy, ECS gradually replaces old containers with new ones, ensuring uptime.

### 5. **Final ECS Deployment on ECS**

- ECS verifies the application health and maintains container uptime.
- Since there’s no external database dependency, the H2 database is automatically initialized in memory each time the container starts.

### Summary of Flow

1. **Push to GitHub** ➔ **GitHub Actions** builds & pushes the Docker image to **ECR**.
2. **Deploy Image to Apprunner** detects a new image in ECR and deploys it to an Apprunner Service
2. **CodePipeline** is triggered by a GitHub push, confirming that the new image is ready in ECR.
3. **ECS Service** deploys the updated image (H2 is in-memory).
4. **ECS** maintains container health, potentially routing traffic through an ALB if set up.