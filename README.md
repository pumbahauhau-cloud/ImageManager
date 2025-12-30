# ImageManager

[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![.NET](https://img.shields.io/badge/.NET-6-blue)](https://dotnet.microsoft.com/)
[![Angular](https://img.shields.io/badge/Angular-16-red)](https://angular.io/)

**ImageManager** is a full-stack application with an **ASP.NET Core Web API backend** and an **Angular frontend**, designed to manage images, users, and ratings with an intuitive web interface.

---

## 🗂 Project Structure

```
ImageManager.Api/
│
├── Controllers/           # ASP.NET API controllers
├── Models/                # Backend models
├── Services/              # Business logic
├── image-manager-ui/      # Angular frontend
│   ├── src/               # Angular app source
│   ├── angular.json
│   └── package.json
├── Program.cs
├── ImageManager.Api.csproj
├── ImageManager.Api.sln
└── README.md
```

---

## ⚙️ Prerequisites

- [.NET 6 SDK or later](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- Angular CLI (for frontend development)
  ```bash
  npm install -g @angular/cli
  ```

---

## 🚀 Running the Application

### 1. Backend (ASP.NET Core API)

1. Open `ImageManager.Api.sln` in **Visual Studio 2022**.
2. Restore NuGet packages.
3. Run the project (F5 or `dotnet run`).
4. API runs at `https://localhost:5001` by default.

### 2. Frontend (Angular)

1. Open `image-manager-ui` folder in **VS Code**.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Angular app:
   ```bash
   ng serve
   ```
4. Open browser at `http://localhost:4200`.

> ⚠ Make sure Angular is configured to call the correct API URL (via `environment.ts` or proxy).

---

## 🎯 Features

- Upload and manage images
- Rate images (face, hair, body, cuteness, sexiness)
- User management
- Folder management
- JSON-based storage for ratings/users

---

## 🛠 Future Improvements

- Replace JSON storage with a proper database (SQL Server, MySQL, etc.)
- Authentication & authorization
- Deployment with Docker and CI/CD pipelines
- Enhanced UI/UX with modern design

---

## 🖼 Screenshots

*(Add screenshots of the Angular UI and API responses here to make it visually appealing)*

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

## 💻 How to Contribute

1. Fork the repository  
2. Create a new branch (`git checkout -b feature-name`)  
3. Commit your changes (`git commit -m "Add feature"`)  
4. Push to the branch (`git push origin feature-name`)  
5. Create a Pull Request

