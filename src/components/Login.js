import React, { useState, useEffect } from 'react';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [buttonStyle, setButtonStyle] = useState({ transform: 'translate(0, 0)' });
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState('');

  // Check for existing session on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('zentasks_user');
    if (savedUser) {
      onLogin(JSON.parse(savedUser));
    }
  }, [onLogin]);

  const handleMouseEnter = () => {
    if (isLogin && username && password) {
      setLocked(true);
      return;
    }
    if (!isLogin && username && password && confirmPassword && password === confirmPassword) {
      setLocked(true);
      return;
    }

    const randX = Math.floor(Math.random() * 300) - 150;
    const randY = Math.floor(Math.random() * 200) - 100;

    setButtonStyle({
      transform: `translate(${randX}px, ${randY}px)`,
      transition: 'transform 0.3s ease-out',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (username && password) {
        // Simulate login - in real app, you'd validate against backend
        const userData = { username, id: Date.now() };
        localStorage.setItem('zentasks_user', JSON.stringify(userData));
        onLogin(userData);
      }
    } else {
      if (username && password && confirmPassword) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        // Simulate signup - in real app, you'd create account in backend
        const userData = { username, id: Date.now() };
        localStorage.setItem('zentasks_user', JSON.stringify(userData));
        onLogin(userData);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('zentasks_user');
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#C29F85] to-[#F8B936] p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border-2 border-[#521903]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#521903] mb-2">ZenTasks</h1>
          <p className="text-[#9F4409] font-medium">
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-3 border-2 border-[#C29F85] rounded-lg focus:border-[#F8B936] focus:outline-none transition-colors"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border-2 border-[#C29F85] rounded-lg focus:border-[#F8B936] focus:outline-none transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full px-4 py-3 border-2 border-[#C29F85] rounded-lg focus:border-[#F8B936] focus:outline-none transition-colors"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <div className="relative h-16">
            <button
              type="submit"
              onMouseEnter={!locked ? handleMouseEnter : null}
              className="absolute w-32 py-3 text-white rounded-lg shadow-lg font-semibold transition-all duration-300 hover:scale-105"
              style={{
                ...buttonStyle,
                left: '50%',
                top: '50%',
                transform: `${buttonStyle.transform} translate(-50%, -50%)`,
                backgroundColor: locked ? '#9F4409' : '#DC8C18',
              }}
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setUsername('');
              setPassword('');
              setConfirmPassword('');
              setError('');
              setButtonStyle({ transform: 'translate(0, 0)' });
              setLocked(false);
            }}
            className="text-[#9F4409] hover:text-[#521903] font-medium transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </button>
        </div>

        <div className="text-center mt-4">
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-[#521903] transition-colors"
          >
            Clear Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
