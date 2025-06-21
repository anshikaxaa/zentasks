import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [theme, setTheme] = useState("light");
  const [taskInput, setTaskInput] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("");
  const [tasks, setTasks] = useState([]);

  const today = new Date().toISOString().split("T")[0];
  const progress = (tasks.filter((t) => t.completed).length / tasks.length) * 100 || 0;

  const handleAddTask = () => {
    if (!taskInput) return;
    const newTask = {
      id: Date.now(),
      text: taskInput,
      completed: false,
      deadlineTime: deadline,
      priority,
      category,
      editing: false,
    };
    setTasks([...tasks, newTask]);
    setTaskInput("");
    setDeadline("");
    setPriority("Medium");
    setCategory("");
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const toggleEdit = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, editing: !task.editing } : task
      )
    );
  };

  const handleEditSave = (id, text, deadlineTime, priority, category) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              text,
              deadlineTime,
              priority,
              category,
              editing: false,
            }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 ${
        theme === "dark"
          ? "bg-[#1e1e1e] text-white"
          : "bg-[#FFF8F1] text-[#521903]"
      }`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
          📝 My Tasks
        </h1>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="px-4 py-2 rounded bg-[#F8B936] text-white hover:bg-[#9F4409] text-sm sm:text-base"
        >
          {theme === "dark" ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <p className="mb-2 text-center sm:text-left">📅 {today}</p>
      <div className="w-full bg-gray-300 rounded-full h-4 mb-2">
        <div
          className="h-4 rounded-full bg-[#F8B936] transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mb-4 font-medium text-center sm:text-left">
        {Math.round(progress)}% completed
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          className="p-2 border rounded w-full"
          placeholder="New task..."
        />
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="p-2 border rounded w-full"
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded w-full"
          placeholder="Category"
        />
      </div>
      <button
        onClick={handleAddTask}
        className="w-full sm:w-auto bg-[#DC8C18] text-white px-4 py-2 rounded hover:bg-[#9F4409] mb-4"
      >
        Add Task
      </button>

      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`p-3 rounded border ${
              theme === "dark"
                ? "border-gray-600 bg-[#2e2e2e]"
                : "border-[#C29F85] bg-white"
            }`}
          >
            {task.editing ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  defaultValue={task.text}
                  onBlur={(e) =>
                    handleEditSave(
                      task.id,
                      e.target.value,
                      task.deadlineTime,
                      task.priority,
                      task.category
                    )
                  }
                  className="p-2 border rounded"
                />
                <input
                  type="datetime-local"
                  defaultValue={task.deadlineTime}
                  onBlur={(e) =>
                    handleEditSave(
                      task.id,
                      task.text,
                      e.target.value,
                      task.priority,
                      task.category
                    )
                  }
                  className="p-2 border rounded"
                />
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row justify-between gap-2">
                <div
                  className="cursor-pointer"
                  onClick={() => toggleComplete(task.id)}
                >
                  <p
                    className={`text-base font-semibold ${
                      task.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {task.text}
                  </p>
                  {task.deadlineTime && (
                    <p className="text-sm">
                      ⏰ {task.deadlineTime.replace("T", " ")}
                    </p>
                  )}
                  <p className="text-sm mt-1">
                    <span
                      className={`text-white px-2 py-1 rounded ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>{" "}
                    {task.category && (
                      <span className="ml-2 italic text-sm text-[#9F4409]">
                        📁 {task.category}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => toggleEdit(task.id)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
