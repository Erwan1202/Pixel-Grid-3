# Pixel Grid - Frontend 🎨

Application React pour l'interface utilisateur collaborative de dessinage en temps réel.

## 📋 Table des matières

- [Démarrage rapide](#-démarrage-rapide)
- [Scripts disponibles](#-scripts-disponibles)
- [Structure du projet](#-structure-du-projet)
- [Composants](#-composants)
- [Services](#-services)
- [Configuration](#-configuration)

## 🚀 Démarrage rapide

### Installation
```bash
npm install
```

### Développement
```bash
npm run dev
```
L'application sera accessible à **http://localhost:5173**

### Production
Application déployée sur Vercel : https://pixel-grid-3-4qzmj6czd-erwan1202s-projects.vercel.app/

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

## 📜 Scripts disponibles

| Command | Description |
|---------|-------------|
| `npm run dev` | Démarrer le serveur de développement avec HMR |
| `npm run build` | Build pour la production |
| `npm run preview` | Prévisualiser le build de production |
| `npm run lint` | Exécuter ESLint |

## 📁 Structure du projet

```
client/
├── src/
│   ├── components/
│   │   ├── auth.component.jsx        # Authentification
│   │   ├── colorPicker.jsx           # Sélecteur de couleur
│   │   ├── grid.component.jsx        # Grille de pixels
│   │   └── *.css                     # Styles
│   ├── services/
│   │   ├── api.js                    # Requêtes HTTP
│   │   ├── auth.services.js          # Service d'auth
│   │   └── socket.services.js        # WebSocket
│   ├── assets/                       # Images, fonts...
│   ├── App.jsx                       # Composant principal
│   ├── main.jsx                      # Point d'entrée
│   └── index.css                     # Styles globaux
├── public/                           # Fichiers statiques
├── index.html                        # HTML principal
├── vite.config.js                    # Configuration Vite
├── eslint.config.js                  # Configuration ESLint
└── package.json
```

## 🧩 Composants

### AuthComponent
Gère l'authentification utilisateur
- Inscription
- Connexion
- Gestion des tokens JWT

### ColorPicker
Sélecteur de couleur pour choisir la couleur des pixels

### GridComponent
Affichage et interaction avec la grille de pixels
- Affichage en temps réel
- Placement de pixels
- Mise à jour via WebSocket

## 🔧 Services

### api.js
Service HTTP pour communiquer avec l'API backend

### auth.services.js
Gestion des tokens JWT et de l'authentification

### socket.services.js
Connexion WebSocket avec Socket.io pour les mises à jour en temps réel

## ⚙️ Configuration

### Variables d'environnement (`.env`)

```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=http://localhost:3001
```

### Vite Configuration

Voir `vite.config.js` pour la configuration Vite et React plugin

### ESLint

Configuration disponible dans `eslint.config.js`

## 🎨 Styles

- **App.css** - Styles principaux
- **index.css** - Styles globaux
- **grid.css** - Styles de la grille
- **auth.css** - Styles d'authentification
- **ColorPicker.css** - Styles du sélecteur de couleur

## 🔗 Intégration avec le Backend

L'application se connecte au backend à `http://localhost:3001` pour :
- Authentification (`/api/auth`)
- Données de la grille (`/api/grid`)
- WebSocket en temps réel

## 📚 Documentation supplémentaire

- [README Global](../README.md)
- [README Backend](../README-BACKEND.md)
- [API Documentation](http://localhost:3001/api/docs) - Swagger UI
