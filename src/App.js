import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Check for existing session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('zentasks_user');
    if (savedUser) {
      setLoggedInUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setLoggedInUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('zentasks_user');
    setLoggedInUser(null);
  };

  return (
    <div className="App">
      {loggedInUser ? (
        <Dashboard username={loggedInUser} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
