<div align="center">
  <img src="https://firebasestorage.googleapis.com/v0/b/linux-sandbox-5e1f3.appspot.com/o/logo.png?alt=media&token=31345245-c363-49b5-8531-933f033b2254" alt="Linux Sandbox Logo" width="200"/>
  <h1>Linux Sandbox</h1>
  <p>
    A collaborative, web-based Linux environment for coding, experimentation, and learning.
  </p>
  <p>
    <a href="https://linux-sandbox-5e1f3.web.app/">View Demo</a>
    ·
    <a href="https://github.com/vinayydv3695/linux-sandbox/issues">Report Bug</a>
    ·
    <a href="https://github.com/vinayydv3695/linux-sandbox/issues">Request Feature</a>
  </p>
</div>

---

## 🌟 Overview

**Linux Sandbox** provides a fully functional, interactive Linux shell directly in your browser.  
It’s perfect for:

- **💻 Coding and Collaboration:** Write, test, and debug code in a shared environment.
- **🧪 Safe Experimentation:** Try commands and tools without touching your local setup.
- **📚 Learning and Exploration:** Get hands-on with Linux commands and workflows.

<div align="center">
  <img src="https://firebasestorage.googleapis.com/v0/b/linux-sandbox-5e1f3.appspot.com/o/demo.gif?alt=media&token=ea45b51a-4b43-4a9a-a81b-9b1c6d7e9e4a" alt="Linux Sandbox Demo" width="800"/>
</div>

---

## ✨ Features

| Feature                | Icon                                                                                                                                                     | Description                                                                 |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| **Real-time Terminal** | <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/gnubash.svg" width="24"/>                                                          | Fully interactive terminal supporting most Linux commands.                   |
| **Code Editor**        | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" width="24"/>                                                    | Integrated editor with syntax highlighting for various languages.            |
| **File System**        | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/folder/folder-original.svg" width="24"/>                                                    | Visual file explorer for easy navigation and file management.                |
| **Collaboration**      | <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/microsoftteams.svg" width="24"/>                                                  | Share sessions and collaborate with others in real-time.                     |
| **Authentication**     | <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/lock.svg" width="24"/>                                                             | Secure authentication to keep your sessions and files private.               |

---

## 🚀 Getting Started

### **Prerequisites**

- **Node.js** → [Download here](https://nodejs.org/)  
- **Firebase Account** → [Create one here](https://firebase.google.com/)

### **Installation**

1. **Clone the repository**

   ```sh
   git clone https://github.com/vinayydv3695/linux-sandbox.git
   cd linux-sandbox
   ```

2. **Install frontend dependencies**

   ```sh
   cd packages/frontend
   npm install
   ```

3. **Install backend dependencies**

   ```sh
   cd ../backend
   npm install
   ```

4. **Configure Firebase**
   - Create a new Firebase project at the [Firebase Console](https://console.firebase.google.com/).
   - Add a web app and copy your Firebase config.
   - Replace placeholders in `packages/frontend/src/services/firebaseConfig.js`.
   - Enable **Firestore** and **Realtime Database**.
   - Generate a **Service Account private key** from **Project Settings → Service Accounts** and save it as:
     ```
     packages/backend/serviceAccountKey.json
     ```

---

## 💻 Usage

Start the backend and frontend servers locally:

```sh
# Start backend
cd packages/backend
npm start

# Start frontend
cd ../frontend
npm start
```

Open your browser and go to **http://localhost:3000**

---

## 🛠️ Built With

**Frontend**

- ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
- ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

**Backend**

- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
- ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

**Database & Services**

- ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

---

## 🤝 Contributing

Contributions make the open-source community thrive! Here's how you can contribute:

1. Fork the repository  
2. Create a new branch  
   ```sh
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes  
   ```sh
   git commit -m 'Add some AmazingFeature'
   ```
4. Push the branch  
   ```sh
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

---

## 📜 License

Distributed under the **MIT License**.  
See the [`LICENSE`](LICENSE) file for details.

---

<div align="center">
  <p>
    Made with ❤️ by the <strong>Linux Sandbox Team</strong>
  </p>
</div>