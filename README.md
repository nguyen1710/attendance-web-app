 attendancec-web-app

# Dự Án Công Nghệ Thông Tin 1
### Information Technology Project 1

# 🌟 **How ​​to Install a Project Using Docker**

## 📖 **Table of Contents**
- [Requirements](#-requirements)
- [How to Install](#-how-to-install)
- [Running the Project](#-running-the-project)

---

## 🛠 **Requirements**
Before you start, make sure you have installed:
- **Git**: To clone the repository. [Download Git](https://git-scm.com/)
- **Docker**: To run the container. [Download Docker](https://www.docker.com/)

---

## 📂 **How ​​to Install**
1. **Clone or Download the project to your computer:**
```bash
git clone https://github.com/nguyen1710/attendance-web-app.git
```

2. **Move into the project directory:**
After the clone is successful, move into the project directory:
```bash
cd attendance-web-app
```

## 🚀 **Run the Project**
1. **Move to the directory containing the `docker-compose.yml` file:**
Make sure you are in the directory containing the Docker configuration file:
```bash
cd path/to/docker-compose
```

2. **Build Docker containers:**
Run the following command to build the Docker containers from the `docker-compose.yml` configuration file:
```bash
docker-compose build
```

3. **Run Docker containers:**
After the build is successful, run the containers:
```bash
docker-compose up
```

4. **Access the application on the browser:**
- Normally the application will run at `http://localhost:5173`.

- Replace `5173` with the port declared in the `docker-compose.yml` file.

5. **Stop Docker containers:**
To stop running containers, you can use the command:
```bash
docker-compose down
```

---

## 📫 **Contact**
If you have any questions or encounter difficulties during the installation process, please contact:
- **Author**: [Thanh Nguyen - Khoa Nam](https://github.com/nguyen1710)
- **Email**: nguyenthanhnguyen17102003@gmail.com

---

Thank you for using our project! 😊

