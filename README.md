
<div align="center">
  <img src="https://firebasestorage.googleapis.com/v0/b/linux-sandbox-5e1f3.appspot.com/o/logo.png?alt=media&token=31345245-c363-49b5-8531-933f033b2254" alt="Linux Sandbox" width="200"/>
  <h1>Linux Sandbox</h1>
  <p>
    A collaborative, web-based Linux environment for coding, experimentation, and learning.
  </p>
  <p>
    <a href="https://linux-sandbox-5e1f3.web.app/">View Demo</a>
    ·
    <a href="https://github.com/your-username/linux-sandbox/issues">Report Bug</a>
    ·
    <a href="https://github.com/your-username/linux-sandbox/issues">Request Feature</a>
  </p>
</div>

---

## 🌟 Overview

Linux Sandbox provides a fully functional and interactive Linux shell directly in your browser. It's a versatile platform designed for developers, students, and enthusiasts to:

- **Code and Collaborate:** Write, test, and debug code in a shared environment.
- **Experiment Safely:** Try out new commands and tools without affecting your local machine.
- **Learn and Explore:** Discover the power of the Linux command line in a hands-on way.

<div align="center">
  <img src="https://firebasestorage.googleapis.com/v0/b/linux-sandbox-5e1f3.appspot.com/o/demo.gif?alt=media&token=ea45b51a-4b43-4a9a-a81b-9b1c6d7e9e4a" alt="Demo GIF" width="800"/>
</div>

---

## ✨ Features

Our platform is packed with features to enhance your experience:

| Feature                | Icon                                                                                                      | Description                                                                                                                             |
| ---------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Real-time Terminal** | <img src="https://firebasestorage.googleapis.com/v0/b/linux-sandbox-5e1f3.appspot.com/o/terminal.svg?alt=media&token=df1f651f-3b2a-4875-a238-425142a3c927" width="24"/> | A fully interactive and responsive terminal with support for most standard Linux commands.                                              |
| **Code Editor**        | <img src="https://firebasestorage.googleapis.com/v0/b/linux-sandbox-5e1f3.appspot.com/o/code.svg?alt=media&token=2a3b3f2b-b4b1-4333-8b2c-3d4d3d4d3d4d" width="24"/>     | An integrated code editor with syntax highlighting for various languages.                                                               |
| **File System**        | <img src="https://firebasestorage.googleapis.com/v0/b/linux-sandbox-5e1f3.appspot.com/o/folder.svg?alt=media&token=1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" width="24"/>    | A visual file explorer to easily navigate and manage your files and directories.                                                        |
| **Collaboration**      | <img src="https://firebasestorage.googleapis.com/v0/b/linux-sandbox-5e1f3.appspot.com/o/users.svg?alt=media&token=6a7b8c9d-0e1f-2a3b-4c5d-6e7f8a9b0c1d" width="24"/>     | Share your session with others and collaborate in real-time.                                                                            |
| **Authentication**     | <img src="https://firebasestorage.googleapis.com/v0/b/linux-sandbox-5e1f3.appspot.com/o/lock.svg?alt=media&token=9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d" width="24"/>      | Secure authentication to keep your sessions and files private.                                                                          |

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- **Node.js:** Make sure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- **Firebase Account:** You'll need a Firebase account to set up the backend services. Create one at [firebase.google.com](https://firebase.google.com/).

### Installation

1.  **Clone the repo:**
    ```sh
    git clone https://github.com/your-username/linux-sandbox.git
    cd linux-sandbox
    ```

2.  **Install NPM packages for the frontend:**
    ```sh
    cd packages/frontend
    npm install
    ```

3.  **Install NPM packages for the backend:**
    ```sh
    cd ../backend
    npm install
    ```

4.  **Set up Firebase:**
    - Create a new project in the [Firebase console](https://console.firebase.google.com/).
    - Add a web app to your project and copy the Firebase configuration.
    - Replace the placeholder configuration in `packages/frontend/src/services/firebaseConfig.js` with your own.
    - Set up Firestore and the Realtime Database.
    - Generate a private key for the Admin SDK in `Project settings > Service accounts` and save it as `packages/backend/serviceAccountKey.json`.

---

## 💻 Usage

1.  **Start the backend server:**
    ```sh
    cd packages/backend
    npm start
    ```

2.  **Start the frontend development server:**
    ```sh
    cd packages/frontend
    npm start
    ```

3.  Open your browser and navigate to `http://localhost:3000` to access the application.

---

## 🛠️ Built With

This project is built with a modern and robust technology stack:

- **Frontend:**
  - ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  - ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
  - ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
- **Backend:**
  - ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
  - ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
- **Database & Services:**
  - ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>
    Made with ❤️ by the Linux Sandbox Team
  </p>
</div>
