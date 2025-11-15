# Pixel Grid 3 🎨

Une application collaborative de dessin en temps réel où les utilisateurs peuvent placer des pixels sur une grille commune.

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Démarrage](#-démarrage)
- [Documentation](#-documentation)
- [Structure du projet](#-structure-du-projet)

## ✨ Fonctionnalités

- **Authentification JWT** - Inscription et connexion sécurisées
- **Grille collaborative** - Placez et modifiez des pixels en temps réel
- **WebSocket** - Communication en temps réel avec Socket.io
- **Admin panel** - Suppression de pixels (admins uniquement)
- **Rate limiting** - Protection contre les abus
- **CORS configuré** - Sécurité multi-origine
- **Swagger UI** - Documentation API interactive

## 🏗️ Architecture

**Frontend:** React + Vite  
**Backend:** Node.js + Express  
**Base de données:** MongoDB ou PostgreSQL (configurable)  
**Real-time:** Socket.io  
**Documentation:** Swagger/OpenAPI 3.0

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm ou yarn
- MongoDB ou PostgreSQL

### Backend

```bash
cd /path/to/Pixel-Grid-3
npm install
```

### Frontend

```bash
cd client
npm install
```

## 🎮 Démarrage

### Backend (port 3001)
```bash
npm start          # Production
npm run dev        # Développement (nodemon)
```

### Frontend (port 5173)
```bash
cd client
npm run dev
```

### Accès

- **Application (Local):** http://localhost:5173
- **Application (Production):** https://pixel-grid-3-4qzmj6czd-erwan1202s-projects.vercel.app/
- **API:** http://localhost:3001
- **Swagger UI:** http://localhost:3001/api/docs

## 📚 Documentation

- [Backend README](./README-BACKEND.md) - API, configuration, et détails techniques
- [Frontend README](./client/README.md) - Interface utilisateur et composants
- **Swagger UI:** Documentation interactive disponible à `/api/docs`

## 📁 Structure du projet

```
Pixel-Grid-3/
├── src/                    # Code backend
│   ├── controllers/        # Logique métier
│   ├── routes/            # Points d'entrée API
│   ├── services/          # Services métier
│   ├── middlewares/       # Middlewares Express
│   ├── models/            # Modèles de données
│   ├── schemas/           # Validation Joi
│   └── swagger.js         # Configuration Swagger
├── client/                # Application React
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── services/      # Services API/WebSocket
│   │   └── App.jsx
│   └── vite.config.js
├── tests/                 # Tests E2E
├── server.js              # Configuration Express
└── index.js              # Point d'entrée
```

## 🤝 Contribution

Pour contribuer, créez une branche et soumettez une pull request.

## 📝 License

ISC
