import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [buttonStyle, setButtonStyle] = useState({ transform: 'translate(0, 0)' });
  const [locked, setLocked] = useState(false);

  const handleMouseEnter = () => {
    if (username && password) {
      setLocked(true);
      return;
    }

    const randX = Math.floor(Math.random() * 800) - 400;
    const randY = Math.floor(Math.random() * 400) - 200;

    setButtonStyle({
      transform: `translate(${randX}px, ${randY}px)`,
      transition: 'transform 0.2s ease-out',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      onLogin(username);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-sand">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm border border-deep">
        <h2 className="text-3xl font-bold text-center text-deep mb-6">ZenTasks</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 border border-gray-300 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="relative h-20">
            <button
              type="submit"
              onMouseEnter={!locked ? handleMouseEnter : null}
              className="absolute w-24 py-1 text-sm bg-deep text-white rounded shadow-md"
              style={{buttonStyle,
                left: '50%',
      top: '50%',
      transform: `${buttonStyle.transform} translate(-50%, -50%)`,
              }}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
