How ​​to Run Project

1. Move into the project directory:

----> cd attendance-web-app

2. Move to the directory containing the docker-compose.yml file:
Make sure you are in the directory containing the Docker configuration file:

----> cd path/to/docker-compose

3. Build and run Docker containers:
Run the following command to build and start the Docker containers with service scaling:

----> docker-compose up --scale user-service=3 --scale classroom-service=3 --scale attendance-service=3 --build

4. Access the application on the browser:

Normally, the application will run at http://localhost:5173.

Replace 5173 with the port declared in the docker-compose.yml file.

5. Stop Docker containers:
To stop running containers, you can use the command:

----> docker-compose down

6. Available Accounts:
Here are some pre-configured accounts you can use for testing:

**Admin Account
url: http://localhost:5173/admin
Email: admin@gmail.com
Password: 123

**User Account
url: http://localhost:5173/login
Email: whitechemical@freesourcecodes.com
Password: 123456

Thank you for using our project!