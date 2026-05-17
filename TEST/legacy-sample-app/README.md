# legacy-sample-app

Enterprise user management application built with Java 8 and standard J2EE components.

## Requirements

- Java 8
- Maven 3.x
- MySQL 5.x
- Tomcat 7.x

## Build

```bash
mvn clean package
```

## Deploy

Deploy the generated `target/legacy-sample-app-1.0.0.war` to a Tomcat 7 instance.

## Database Setup

```sql
CREATE DATABASE mydb;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(100),
    role VARCHAR(20),
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    action VARCHAR(50),
    detail TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

All endpoints are servlet-based under `/users`:

| Method | Parameter `action` | Description          |
|--------|--------------------|----------------------|
| GET    | `getUser`          | Get user by `id`     |
| GET    | `listUsers`        | List all users       |
| GET    | `searchUser`       | Search by `name`     |
| POST   | `createUser`       | Create a new user    |
| POST   | `updateUser`       | Update user by `id`  |
| POST   | `deleteUser`       | Delete user by `id`  |

## Configuration

Database credentials are hardcoded in `ConnectionPool.java`. Update before deploying to any environment.
