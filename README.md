# 🎯 Candidate Profile Screening

A project for **automating the evaluation of job candidate profiles** using Java, Spring Boot, and AI integrations.  

---

## 🗂️ Overview

### 🚀 AI-Powered Candidate Profile Screening & Feedback Tracking

Traditional hiring processes face multiple bottlenecks that reduce efficiency and increase workload for the TA (Talent Acquisition) team:

Profile Screening → Limited resources often lead to ineffective resume screening and repeated evaluation of the same candidate across multiple roles.

Candidate Tracking → Difficulty in maintaining structured feedback across different interview rounds and discussions.

Resource Constraints → Scarcity of TA resources impacts hiring efficiency and turnaround time.

Duplicate Management → High risk of the same candidate being screened multiple times for different positions.

👉 To solve these challenges, this project introduces an AI-driven Recruitment Automation Platform with the following core features:

🤖 AI-powered Resume Screening – Matches resumes against Job Descriptions (JDs), flags duplicates, and provides similarity scoring.

🗂 Centralized Feedback Tracking – Logs, stores, and analyzes structured feedback from different interview rounds.

⚡ Automated Feedback Collection – Uses AI tools to streamline initial screening and capture interviewer evaluations.

📊 Candidate Status & History Database – Maintains candidate lifecycle data to prevent re-screening and ensure consistent tracking.

---

## 🌟 Features

- ⚡ Automated resume and profile screening  
- 🔌 AI-powered integration with Perplexity APIs  
- 🗃️ MySQL-backed data persistence (Server version **8.0.21**)  
- 🛠️ Built with Java 17 and Maven 3.9.11
- 📦 Scalable backend for integration with HR systems
- 🎨 Modern React frontend with Tailwind CSS
- 👥 Dual portal system (Applicants & Employers)

---

## 🛠️ Requirements

Before running the project, ensure you have:

### Backend Requirements
- **Java:** 17
- **Maven:** 3.9.11  
- **MySQL Database:** Server version **8.0.21** (configured in `application.yml`)  

### Frontend Requirements
- **Node.js:** 18+ (recommended: latest LTS version)
- **npm:** 9+ (comes with Node.js)

---

## 🚀 Getting Started

### Backend Setup (Windows, first run)

The backend targets **Java 17** and uses **MySQL Server**. The project documents MySQL **8.0.21**. MySQL Workbench is optional; the backend connects to the MySQL server running locally on port `3306`.

1. **Check Java and Maven.** Open PowerShell and run:

   ```powershell
   java -version
   mvn -version
   ```
   Install a JDK (17 or newer) and Maven 3.9.11 if either command is not found. Java 17 is the project target; newer JDKs such as Java 21 can run this build.

2. **Start the MySQL service.** In Windows Services, start the installed MySQL Server service. Or, from an elevated PowerShell, find its service name and start it (the name may differ):

3. **Create the application database and a local database user.** From PowerShell, open the MySQL command-line client:

   ```powershell
   mysql -u root -p
   ```

   Enter the MySQL root password when prompted, then run these SQL statements at the MySQL prompt. Replace the example password with one you choose:

   ```sql
   CREATE DATABASE IF NOT EXISTS candidate
   ```

4. **Configure the datasource credentials in the same PowerShell window.** These must match the user and password created above. The project connects to `jdbc:mysql://localhost:3306/candidate`.

   ```powershell
   mvn spring-boot:run
   ```


### Frontend Setup
- `npm install` - Install dependencies
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
