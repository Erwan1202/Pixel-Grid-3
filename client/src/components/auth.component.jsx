import React, { useState } from 'react';
import authService from '../services/auth.services';
import './auth.css';

const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await authService.login(email, password);
      } else {
        await authService.register(username, email, password);
      }
      onLoginSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>{isLogin ? 'Connexion' : 'Inscription'}</h2>
        
        {!isLogin && (
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        {error && <p className="error-message">{error}</p>}
        
        <button type="submit">{isLogin ? 'Se connecter' : "S'inscrire"}</button>
      </form>
      
      <button onClick={() => setIsLogin(!isLogin)} className="toggle-auth">
        {isLogin ? "Pas de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
      </button>
    </div>
  );
};

export default Auth;