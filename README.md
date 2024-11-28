### **Backend README (`EventHub-backend`)**

This repository contains the **backend code** for the EventHub project, built using **Node.js** and Express.js. The backend provides a RESTful API to manage events, venues, and user accounts, as well as authentication and authorization.

The frontend code for this project can be found [here](https://github.com/bthnyildirim/EventHub-frontend).

## Description

EventHub is a web application designed to connect event organizers and fans. Users can browse, create, edit, and manage events and venues through an intuitive interface.

### Key Features:

- RESTful API for events, venues, and user management.
- Authentication and authorization using JWT.
- Multer integration for image uploads.
- MongoDB for database storage.
- Role-based access control for organizers and fans.

## Instructions to Run This App Locally

### 1. Clone the repository:

```bash
git clone https://github.com/bthnyildirim/EventHub-backend.git
```

### 2.Navigate to the project directory:

```bash
cd cd EventHub-backend
```

### 3.Install dependencies:

```bash
npm install
```

### 4.Create a .env file in the root directory

Create a .env file in the root of the project and add the following environment variables:

```bash
ORIGIN, with the location of your frontend app (example, ORIGIN=https://mycoolapp.netlify.com)
TOKEN_SECRET: used to sign auth tokens (example, TOKEN_SECRET=ilovepizza)
```

### 5.Run the application

```bash
npm run dev
```

The API will be running at http://localhost:5000.

## DEMO

- Live Frontend Demo can be found [here](https://eventhub-project.netlify.app).

For the backend repository and API details, visit the EventHub Backend repository.

---
