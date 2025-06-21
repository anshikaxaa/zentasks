import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';


function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  return (
    <div className="App">
      {loggedInUser ? (
        <Dashboard username={loggedInUser} />
      ) : (
        <Login onLogin={setLoggedInUser} />
      )}
    </div>
  );
}

export default App;
