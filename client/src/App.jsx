import React, { useState, useEffect } from 'react';
import PixelGrid from './components/grid.component';
import Auth from './components/auth.component';
import authService from '../src/services/auth.services';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      <header>
        <h1>PixelGrid V2</h1>
        {isAuthenticated && (
          <button onClick={handleLogout} className="logout-button">
            Déconnexion
          </button>
        )}
      </header>
      <main>
        {isAuthenticated ? (
          <PixelGrid />
        ) : (
          <Auth onLoginSuccess={handleLogin} />
        )}
      </main>
    </div>
  );
}

export default App;