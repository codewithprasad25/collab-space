# 🚀 Collab-Space  
### Real-Time Workspace Collaboration Platform  

<p align="center">
  <img src="https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=java" />
  <img src="https://img.shields.io/badge/SpringBoot-3.x-brightgreen?style=for-the-badge&logo=springboot" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-blue?style=for-the-badge&logo=postgresql" />
  <img src="https://img.shields.io/badge/WebSocket-RealTime-red?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Maven-Build-purple?style=for-the-badge&logo=apachemaven" />
</p>

---

## 📌 Overview

**Collab-Space** is a backend-driven collaboration platform built using **Spring Boot** that enables:

- Workspace creation  
- Role-based access control  
- Secure invitation system  
- Real-time messaging with WebSockets  
- Email-based invite workflow  

Designed using clean layered architecture and scalable backend principles.

---

## ✨ Key Features

- 🔐 Secure User Registration & Login  
- 📩 UUID-based Workspace Invitation  
- 👥 Role-Based Authorization (Owner | Admin | Member)  
- 🏢 Multi-Workspace Support  
- 💬 Real-Time Messaging (WebSocket + STOMP)  
- ⏳ Invite Expiry & Status Tracking  
- 📦 Clean Controller → Service → Repository architecture  

---

Controller Layer
↓
Service Layer
↓
Repository Layer
↓
PostgreSQL Database


---

## 🛠 Tech Stack

### Backend
- Java 17  
- Spring Boot  
- Spring Data JPA  
- Hibernate  
- Spring Mail  
- WebSocket (STOMP)  

### Database
- PostgreSQL  

### Tools
- Maven  
- Postman  
- IntelliJ IDEA  
- pgAdmin  

---

## 🔐 Authentication & Invitation Flow

1. User registers with email & password  
2. Workspace Owner creates workspace  
3. Admin/Owner invites user  
4. UUID token generated  
5. Invite link sent via email  
6. Token validation + expiry check  
7. User joins workspace with assigned role  

---

## 📡 Important APIs

### 🔹 Create Workspace

POST /create/workspace/{workspaceName}?loggedInEmail=email


### 🔹 Invite User

POST /invite/workspace/{workspaceId}


Request Body:

{
  "adminEmail": "admin@gmail.com",
  "userEmail": "user@gmail.com",
  "userRole": "Member"
}
/n


Fetch Invited Email :- 

GET /fetch/invited/email/{inviteToken



Real-Time Messaging

WebSocket endpoint configuration

STOMP messaging protocol

Workspace-level message broadcasting

Persistent message storage



🗄 Database Tables

users

workspace

workspace_member

workspace_invite

otp

channel

message



⚙️ Run Locally
1️⃣ Clone Repository

git clone https://github.com/your-username/collab-space.git
cd collab-space


2️⃣ Configure Database


Update application.properties:

spring.datasource.url=jdbc:postgresql://localhost:5432/collab_space
spring.datasource.username=your_username
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true



Start Application

mvn spring-boot:run



Server runs at:

http://localhost:8080



What This Project Demonstrates

Clean REST API Design

Advanced JPA Relationships

Optional Handling

Enum Mapping with PostgreSQL

Foreign Key Constraint Handling

Token-Based Invite Workflow

CORS Configuration

WebSocket Integration



🚀 Future Enhancements

JWT Authentication

Refresh Tokens

React Frontend Integration

Docker Deployment

Cloud Deployment (AWS)


👨‍💻 Author

Prasad Shinde
Java Backend Developer
Pune, Maharashtra


## 🧠 Architecture

