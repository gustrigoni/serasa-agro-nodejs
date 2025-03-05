## serasa-agro-nodejs

This repository is the result of the Brain Agriculture's challenge for the NodeJS developer position. You can find the challenge details at [brain-ag/trabalhe-conosco](https://github.com/brain-ag/trabalhe-conosco).

# Story telling
This API has 6 endpoints where you can manage the creation of producers and properties. Simulating what it would be like to control an agricultural partner. If you are interested in how it was developed, see how the development was thought out in the brainstorming below.
- [API Brainstroming - MIRO](https://miro.com/welcomeonboard/UXZ2YWRXQjJiZHNHWUU5RkJzUjJEMHpZS1NtM1hlVUo4QjhCZEFtSkF1RUpmS2cvVW1GRHRUMWkzTFpPQjgvNTAvUDBCREJzOEEzK0g4aXM4ajBqakcrYVlYVGdtQmZhYlpTcmpGcTdOeWYrSGVXdk1vRW1xYms5S1lTQ2oyZFVzVXVvMm53MW9OWFg5bkJoVXZxdFhRPT0hdjE=?share_link_id=713397351517)
  
  ![image](https://github.com/user-attachments/assets/6c0c248e-fec0-4453-8348-a72dbd1f1804)

# Technologies
  - [NestJS](https://nestjs.com/) - A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
  - [Prisma ORM](https://www.prisma.io/orm) - Next-generation Node.js and TypeScript ORM
  - [Prisma Postgres](https://www.prisma.io/postgres) - Instant Postgres for Global Applications
  - [Render](https://render.com/) - Build, deploy, and scale your apps with unparalleled ease – from your first user to your billionth.

# Demo
You can access the demo version of the API by clicking in this link [https://serasa-agro-nodejs.onrender.com](https://serasa-agro-nodejs.onrender.com/api)

# Run locally
To run this repository on your local machine, follow these simple steps. It will only take a few commands!

### Prerequisites
Before you begin, ensure you have the following installed:

- [Docker](https://www.docker.com/products/docker-desktop/) - A platform to develop, ship, and run applications in containers.
- [Git](https://git-scm.com/downloads) - A version control system to clone the repository.

### Step #1 - Clone the repository
1. Create a new directory on your machine where you want to store the repository, and open your terminal in that directory.
2. Run the following commands to clone this repository:

```bash
$ mkdir serasa-agro-nodejs
$ cd serasa-agro-nodejs
$ git clone https://github.com/gustrigoni/serasa-agro-nodejs .
```

### Step #2 - Run Docker
Excute this command in your terminal to run the project (please, before this step make sure your Docker is open)
```bash
$ docker compose up
```

### Step #3 - Try it!
Now, your API is up! You can access the API locally by clicking in this link [http://localhost:3000](http://localhost:3000/api)

## Tests
Our project leverages the **Jest** framework to ensure code quality through automated testing. We run both **unit tests** and **end-to-end (E2E) tests** to cover different layers of the application. Below are the most recent test results:

### How to Run the Tests
To run the tests locally, use the following commands:

```bash
# Unit Tests
docker exec -it brainag-node npm run test

# E2E Tests
docker exec -it brainag-node npm run test:e2e
```

### Unit tests
![image](https://github.com/user-attachments/assets/fcc880a0-0b10-470d-91af-355400a49703)

### Tests E2E
![image](https://github.com/user-attachments/assets/96761f6b-60a3-4314-b041-a62ed67fe347)

