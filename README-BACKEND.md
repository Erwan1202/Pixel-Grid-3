# Pixel Grid - Backend 🚀

API Node.js/Express pour la gestion de l'authentification et de la grille collaborative.

## 📋 Table des matières

- [Démarrage rapide](#-démarrage-rapide)
- [Scripts disponibles](#-scripts-disponibles)
- [Configuration](#-configuration)
- [Architecture](#-architecture)
- [API Endpoints](#-api-endpoints)
- [Authentification](#-authentification)
- [Base de données](#-base-de-données)
- [Middlewares](#-middlewares)

## 🚀 Démarrage rapide

### Installation
```bash
npm install
```

### Développement
```bash
npm run dev
```
Le serveur démarre sur **http://localhost:3001**

### Production
```bash
npm start
```

## 📜 Scripts disponibles

| Command | Description |
|---------|-------------|
| `npm start` | Lancer le serveur production |
| `npm run dev` | Lancer avec nodemon (rechargement auto) |
| `npm test` | Exécuter les tests (Jest) |

## ⚙️ Configuration

### Variables d'environnement (`.env`)

```env
# Port
PORT=3001

# Base de données
DB_TYPE=mongodb              # mongodb ou postgres
MONGO_URI=mongodb://localhost:27017/pixel-grid
POSTGRES_URL=postgresql://user:password@localhost:5432/pixel-grid

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=7d

# CORS
FRONTEND_URL=http://localhost:5173

# Environment
NODE_ENV=development
```

## 🏗️ Architecture

### Structure des dossiers

```
src/
├── controllers/           # Logique métier
│   ├── auth.controller.js
│   └── grid.controller.js
├── routes/               # Points d'entrée API
│   ├── auth.routes.js
│   └── grid.routes.js
├── services/             # Logique métier réutilisable
│   ├── auth.service.js
│   ├── auth.utils.js
│   └── grid.service.js
├── middlewares/          # Middlewares Express
│   ├── checkJwt.middleware.js
│   ├── checkRole.middleware.js
│   ├── cors.middleware.js
│   ├── rateLimiter.middleware.js
│   └── validate.middleware.js
├── models/               # Base de données
│   ├── db.connect.js
│   ├── db.mongo.js
│   ├── db.postgres.js
│   ├── init.postgres.js
│   └── PixelLog.model.js
├── schemas/              # Validation Joi
│   ├── auth.schema.js
│   └── grid.schema.js
└── swagger.js            # Configuration Swagger
```

## 🔌 API Endpoints

### Documentation Interactive
```
http://localhost:3001/api/docs
```

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### Grid

#### Get Grid
```http
GET /api/grid
```

#### Place Pixel
```http
POST /api/grid/pixel
Authorization: Bearer <token>
Content-Type: application/json

{
  "x": 10,
  "y": 20,
  "color": "#FF0000"
}
```

#### Delete Pixel (Admin only)
```http
DELETE /api/grid/pixel/:x/:y
Authorization: Bearer <token>
```

## 🔐 Authentification

### JWT (JSON Web Token)

- **Type:** Bearer Token
- **Format:** `Authorization: Bearer <token>`
- **Expiration:** Configurable (défaut: 7 jours)
- **Refresh:** Utilisez l'endpoint `/api/auth/refresh`

### Middleware d'authentification

```javascript
const { checkJwt } = require('./middlewares/checkJwt.middleware');

// Utilisation sur une route
router.post('/protected', checkJwt, controller);
```

### Middleware de rôles

```javascript
const { checkRole } = require('./middlewares/checkRole.middleware');

// Utilisation sur une route admin
router.delete('/pixel/:x/:y', checkJwt, checkRole(['admin']), controller);
```

## 💾 Base de données

### MongoDB

Configuration automatique si `DB_TYPE=mongodb`

```javascript
const db = require('./src/models/db.mongo');
```

### PostgreSQL

Configuration automatique si `DB_TYPE=postgres`

```javascript
const db = require('./src/models/db.postgres');
// Initialisation du schéma
require('./src/models/init.postgres');
```

### Modèles

#### PixelLog
Enregistrement de tous les pixels placés/modifiés

Champs:
- `x`, `y` - Coordonnées
- `color` - Couleur hexadécimale
- `userId` - ID de l'utilisateur
- `timestamp` - Date/heure

## 🔧 Middlewares

### checkJwt
Valide le token JWT présent dans le header `Authorization`

### checkRole
Vérifie que l'utilisateur a le rôle requis (ex: admin)

### rateLimiter
Limite le nombre de requêtes par IP/utilisateur
- `authRateLimiter` - Auth (3 req/15min)
- `pixelRateLimiter` - Pixels (10 req/1min)

### validate
Valide les données d'entrée avec les schémas Joi

### CORS
Autorise les requêtes multi-origines (configuré pour frontend local et Vercel)

## 📊 Validation

### Auth Schema
```javascript
registerSchema: {
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
}

loginSchema: {
  email: Joi.string().email().required(),
  password: Joi.string().required()
}
```

### Grid Schema
```javascript
updatePixelSchema: {
  x: Joi.number().required(),
  y: Joi.number().required(),
  color: Joi.string().regex(/^#[0-9A-F]{6}$/).required()
}
```

## 🧪 Tests

```bash
npm test
```

Tests E2E disponibles dans `/tests/e2e.test.js`

## 🌐 Socket.io (WebSocket)

Les mises à jour en temps réel sont diffusées via Socket.io :

```javascript
// Le serveur envoie les événements aux clients connectés
req.io.emit('pixelPlaced', { x, y, color });
```

## 📚 Documentation supplémentaire

- [README Global](../README.md)
- [README Frontend](../client/README.md)
- [Swagger UI](http://localhost:3001/api/docs)