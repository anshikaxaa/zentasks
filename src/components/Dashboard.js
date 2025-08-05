import React, { useState, useEffect } from "react";
import { Howl } from "howler";

const Dashboard = ({ username, onLogout }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('zentasks_theme');
    return savedTheme || 'light';
  });
  const [currentView, setCurrentView] = useState('daily');
  const [taskInput, setTaskInput] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("Personal");
  const [alarmTime, setAlarmTime] = useState("");
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('zentasks_tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [monthlyGoals, setMonthlyGoals] = useState(() => {
    const savedGoals = localStorage.getItem('zentasks_goals');
    return savedGoals ? JSON.parse(savedGoals) : [];
  });
  const [goalInput, setGoalInput] = useState("");

  const categories = ["Personal", "Work", "Study", "Health", "Finance", "Other"];
  const today = new Date().toISOString().split("T")[0];
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('zentasks_theme', theme);
  }, [theme]);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('zentasks_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save goals to localStorage
  useEffect(() => {
    localStorage.setItem('zentasks_goals', JSON.stringify(monthlyGoals));
  }, [monthlyGoals]);

  // Alarm system
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      tasks.forEach(task => {
        if (task.alarmTime && !task.alarmTriggered) {
          const alarmDate = new Date(task.alarmTime);
          if (now >= alarmDate) {
            triggerAlarm(task);
            // Mark alarm as triggered
            setTasks(prev => prev.map(t => 
              t.id === task.id ? { ...t, alarmTriggered: true } : t
            ));
          }
        }
      });
    };

    const interval = setInterval(checkAlarms, 1000);
    return () => clearInterval(interval);
  }, [tasks]);

  const triggerAlarm = (task) => {
    // Browser notification
    if (Notification.permission === "granted") {
      new Notification("Task Reminder", {
        body: `Time for: ${task.text}`,
        icon: "/favicon.ico"
      });
    }

    // Sound notification
    const sound = new Howl({
      src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'],
      volume: 0.5
    });
    sound.play();
  };

  const requestNotificationPermission = () => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  const handleAddTask = () => {
    if (!taskInput.trim()) return;
    
    const newTask = {
      id: Date.now(),
      text: taskInput,
      completed: false,
      deadlineTime: deadline,
      priority,
      category,
      alarmTime: alarmTime,
      alarmTriggered: false,
      editing: false,
      createdAt: new Date().toISOString()
    };
    
    setTasks([...tasks, newTask]);
    setTaskInput("");
    setDeadline("");
    setPriority("Medium");
    setCategory("Personal");
    setAlarmTime("");
  };

  const handleAddGoal = () => {
    if (!goalInput.trim()) return;
    
    const newGoal = {
      id: Date.now(),
      text: goalInput,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setMonthlyGoals([...monthlyGoals, newGoal]);
    setGoalInput("");
  };

  const toggleComplete = (id, isGoal = false) => {
    if (isGoal) {
      setMonthlyGoals(prev => prev.map(goal => 
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      ));
    } else {
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      ));
    }
  };

  const deleteTask = (id, isGoal = false) => {
    if (isGoal) {
      setMonthlyGoals(prev => prev.filter(goal => goal.id !== id));
    } else {
      setTasks(prev => prev.filter(task => task.id !== id));
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "bg-red-500";
      case "Medium": return "bg-yellow-500";
      case "Low": return "bg-green-500";
      default: return "bg-gray-400";
    }
  };

  const filteredTasks = selectedCategory === "All" 
    ? tasks 
    : tasks.filter(task => task.category === selectedCategory);

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const completedGoals = monthlyGoals.filter(goal => goal.completed).length;
  const totalGoals = monthlyGoals.length;
  const goalProgress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  const renderDailyTasks = () => (
    <div className="space-y-6">
      {/* Task Input Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-[#521903] dark:text-[#F8B936]">
          Add New Task
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            className="p-3 border-2 border-[#C29F85] rounded-lg focus:border-[#F8B936] focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Task title..."
          />
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="p-3 border-2 border-[#C29F85] rounded-lg focus:border-[#F8B936] focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="p-3 border-2 border-[#C29F85] rounded-lg focus:border-[#F8B936] focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 border-2 border-[#C29F85] rounded-lg focus:border-[#F8B936] focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {categories.map(cat => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="datetime-local"
            value={alarmTime}
            onChange={(e) => setAlarmTime(e.target.value)}
            className="p-3 border-2 border-[#C29F85] rounded-lg focus:border-[#F8B936] focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Set alarm..."
          />
          <button
            onClick={handleAddTask}
            className="bg-[#DC8C18] hover:bg-[#9F4409] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Add Task
          </button>
        </div>
      </div>

      {/* Progress and Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-[#521903] dark:text-[#F8B936]">
              Daily Progress
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#9F4409]">{Math.round(progress)}%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Complete</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-[#F8B936] to-[#DC8C18] h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-[#521903] dark:text-[#F8B936]">
          Filter by Category
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === "All"
                ? "bg-[#9F4409] text-white"
                : "bg-[#C29F85] text-[#521903] hover:bg-[#DC8C18]"
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === cat
                  ? "bg-[#9F4409] text-white"
                  : "bg-[#C29F85] text-[#521903] hover:bg-[#DC8C18]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border-l-4 transition-all duration-200 ${
              task.completed
                ? "border-green-500 opacity-75"
                : "border-[#F8B936]"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id)}
                    className="w-5 h-5 text-[#9F4409] rounded focus:ring-[#F8B936]"
                  />
                  <h4 className={`font-semibold ${
                    task.completed ? "line-through text-gray-500" : "text-[#521903] dark:text-white"
                  }`}>
                    {task.text}
                  </h4>
                </div>
                
                <div className="flex flex-wrap gap-2 text-sm">
                  {task.deadlineTime && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      ⏰ {new Date(task.deadlineTime).toLocaleString()}
                    </span>
                  )}
                  <span className={`text-white px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className="bg-[#C29F85] text-[#521903] px-2 py-1 rounded">
                    📁 {task.category}
                  </span>
                  {task.alarmTime && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      🔔 {new Date(task.alarmTime).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700 ml-4"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
        
        {filteredTasks.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No tasks found. Add some tasks to get started!
          </div>
        )}
      </div>
    </div>
  );

  const renderMonthlyGoals = () => (
    <div className="space-y-6">
      {/* Goal Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-[#521903] dark:text-[#F8B936]">
          Add Monthly Goal
        </h3>
        <div className="flex gap-4">
          <input
            type="text"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            className="flex-1 p-3 border-2 border-[#C29F85] rounded-lg focus:border-[#F8B936] focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter your goal..."
          />
          <button
            onClick={handleAddGoal}
            className="bg-[#DC8C18] hover:bg-[#9F4409] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Add Goal
          </button>
        </div>
      </div>

      {/* Goals Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-[#521903] dark:text-[#F8B936]">
              Monthly Progress
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {completedGoals} of {totalGoals} goals completed
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#9F4409]">{Math.round(goalProgress)}%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Complete</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-[#F8B936] to-[#DC8C18] h-3 rounded-full transition-all duration-500"
            style={{ width: `${goalProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-3">
        {monthlyGoals.map((goal) => (
          <div
            key={goal.id}
            className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border-l-4 transition-all duration-200 ${
              goal.completed
                ? "border-green-500 opacity-75"
                : "border-[#F8B936]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={goal.completed}
                  onChange={() => toggleComplete(goal.id, true)}
                  className="w-5 h-5 text-[#9F4409] rounded focus:ring-[#F8B936]"
                />
                <h4 className={`font-semibold ${
                  goal.completed ? "line-through text-gray-500" : "text-[#521903] dark:text-white"
                }`}>
                  {goal.text}
                </h4>
              </div>
              
              <button
                onClick={() => deleteTask(goal.id, true)}
                className="text-red-500 hover:text-red-700"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
        
        {monthlyGoals.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No monthly goals set. Add some goals to track your progress!
          </div>
        )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-[#521903] dark:text-[#F8B936]">
          Profile Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <p className="text-lg text-[#521903] dark:text-white">{username?.username || 'User'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Member Since
            </label>
            <p className="text-lg text-[#521903] dark:text-white">
              {username?.id ? new Date(username.id).toLocaleDateString() : 'Unknown'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-[#521903] dark:text-[#F8B936]">
          Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-[#C29F85] rounded-lg">
            <p className="text-2xl font-bold text-[#521903]">{totalTasks}</p>
            <p className="text-sm text-[#521903]">Total Tasks</p>
          </div>
          <div className="text-center p-4 bg-[#F8B936] rounded-lg">
            <p className="text-2xl font-bold text-white">{completedTasks}</p>
            <p className="text-sm text-white">Completed</p>
          </div>
          <div className="text-center p-4 bg-[#9F4409] rounded-lg">
            <p className="text-2xl font-bold text-white">{totalGoals}</p>
            <p className="text-sm text-white">Monthly Goals</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-[#521903] dark:text-[#F8B936]">
          App Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-[#521903] dark:text-white">Dark Mode</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Switch between light and dark themes
              </p>
            </div>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="bg-[#DC8C18] hover:bg-[#9F4409] text-white px-4 py-2 rounded-lg transition-colors"
            >
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-[#521903] dark:text-white">Notifications</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enable browser notifications for task reminders
              </p>
            </div>
            <button
              onClick={requestNotificationPermission}
              className="bg-[#DC8C18] hover:bg-[#9F4409] text-white px-4 py-2 rounded-lg transition-colors"
            >
              Enable
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-[#521903] dark:text-[#F8B936]">
          Account Actions
        </h3>
        <div className="space-y-4">
          <button
            onClick={onLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Logout
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-[#FFF8F1] text-[#521903]'}`}>
      {/* Navigation Bar */}
      <nav className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg border-b border-[#C29F85]`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-[#521903] dark:text-[#F8B936]">
                🧠 ZenTasks
              </h1>
              <span className="ml-4 text-sm text-gray-600 dark:text-gray-400">
                Welcome, {username?.username || 'User'}!
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg bg-[#C29F85] hover:bg-[#DC8C18] transition-colors"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-1 pb-2">
            {[
              { id: 'daily', label: '📝 Daily Tasks', icon: '📝' },
              { id: 'monthly', label: '🎯 Monthly Goals', icon: '🎯' },
              { id: 'profile', label: '👤 Profile', icon: '👤' },
              { id: 'settings', label: '⚙️ Settings', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === tab.id
                    ? 'bg-[#9F4409] text-white'
                    : 'text-[#521903] dark:text-white hover:bg-[#C29F85]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Date */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#521903] dark:text-[#F8B936] mb-2">
            {currentView === 'daily' && 'Daily Tasks'}
            {currentView === 'monthly' && 'Monthly Goals'}
            {currentView === 'profile' && 'Profile'}
            {currentView === 'settings' && 'Settings'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {currentView === 'daily' && `📅 ${today}`}
            {currentView === 'monthly' && `📅 ${currentMonth}`}
            {currentView === 'profile' && 'Manage your profile and view statistics'}
            {currentView === 'settings' && 'Customize your app preferences'}
          </p>
        </div>

        {/* Content based on current view */}
        {currentView === 'daily' && renderDailyTasks()}
        {currentView === 'monthly' && renderMonthlyGoals()}
        {currentView === 'profile' && renderProfile()}
        {currentView === 'settings' && renderSettings()}
      </main>
    </div>
  );
};

export default Dashboard;
