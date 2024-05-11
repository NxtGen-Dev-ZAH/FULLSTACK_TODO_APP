// TO DO LIST , TASK MANAGER APP
"use client";
import React, { useState, useEffect } from "react";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface TaskProps {
  task: Task;
  onDeletefun: (id: number) => void;
  onUpdatefun: (id: number, updatedTask: Task) => void;
  onToggleCompletion: (id: number) => void;
}

const Task: React.FC<TaskProps> = ({
  task,
  onDeletefun,
  onUpdatefun,
  onToggleCompletion,
}) => {
  const [completed, setCompleted] = useState<boolean>(task.completed);
  const [editing, setEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(task.title);
  const [description, setDescription] = useState<string>(task.description);

  const handleUpdate = () => {
    onUpdatefun(task.id, { ...task, title, description });
    setEditing(false);
  };

  useEffect(() => {
    setCompleted(task.completed);
  }, [task.completed]);

  const handleToggleCompletion = () => {
    setCompleted(!completed);
    onToggleCompletion(task.id);
  };

  return (
    <div
      className={`p-2 mb-2 w-max  rounded-md ${
        completed
          ? "bg-gradient-to-t from-green-400 via-emerald-200 to-green-500"
          : "bg-gradient-to-t from-red-300 via-orange-200 to-red-300"
      } shadow-md`}
    >
      {editing ? (
        <div className="">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-1 mx-4 mb-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-1 mx-4 mb-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500"
          />
          <button
            onClick={handleUpdate}
            className="px-4 py-1 bg-green-500 text-white rounded-md mr-2"
          >
            Save
          </button>
          <button
            onClick={() => setEditing(false)}
            className="px-4 py-1 bg-red-500 text-white rounded-md"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-bold">{task.title}</h3>
          <p className="text-gray-600 my-2">{task.description}</p>
          <p className="text-sm">
            Status: {completed ? "Completed" : "Not Completed"}
          </p>
          <div className="flex justify-center gap-4 mt-2">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleToggleCompletion}
            >
              {completed ? "Mark as Incomplete" : "Mark as Completed"}
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={() => onDeletefun(task.id)}
            >
              Delete
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={() => setEditing(true)}
            >
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface TaskListProps {
  tasks: Task[];
  onDeletefun: (id: number) => void;
  onUpdatefun: (id: number, updatedTask: Task) => void;
  onToggleCompletion: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onDeletefun,
  onUpdatefun,
  onToggleCompletion,
}) => (
  <div className="flex flex-col justify-center items-center gap-4 px-28 ">
    <h2 className="mx-auto px-4 text-gray-100 font-bold text-2xl bg-gradient-to-t from-pink-400 to-blue-400 text-center  rounded-lg ">
      Task List
    </h2>
    {tasks.map((task) => (
      <Task
        key={task.id}
        task={task}
        onDeletefun={onDeletefun}
        onUpdatefun={onUpdatefun}
        onToggleCompletion={onToggleCompletion}
      />
    ))}
  </div>
);

const TaskForm: React.FC<{ onAdd: (newTask: Task) => void }> = ({ onAdd }) => {
  const [newTask, setNewTask] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      onAdd({ id: Date.now(), title: newTask, description, completed: false });
      setNewTask("");
      setDescription("");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mb-8 border-4 rounded-lg border-opacity-80 w-2/6 h-4/12 mx-auto border-red-500 p-4 bg-opacity-30 bg-zinc-600 ">
      <h2 className="mx-auto mb-2 px-4 text-gray-100 font-bold text-2xl bg-gradient-to-t from-pink-400 to-blue-400 text-center rounded-lg">
        ADD TASK
      </h2>
      <div className="flex flex-col justify-center gap-4">
        <input
          type="text"
          placeholder="Task Title"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="p-1 mx-1 mb-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500"
        />
        <input
          type="text"
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-1 mx-1 mb-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500"
        />
      </div>
      <div>
        <button
          onClick={handleAddTask}
          className="px-4 h-9 bg-green-500 font-semibold text-xl text-white rounded-2xl transition-transform transform active:scale-105 hover:font-extrabold hover:bg-green-300"
        >
          Add
        </button>
      </div>
    </div>
  );
};
const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/todo");
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          throw new Error("Failed to fetch tasks");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async (newTask: Task) => {
    try {
      const response = await fetch("/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });
      if (response.ok) {
        const data = await response.json();
        setTasks([...tasks, data]);
      } else {
        throw new Error("Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };
  const updateTask = async (taskID: number, updatedTask: Task) => {
    try {
      const response = await fetch(`/api/update/${taskID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(tasks.map((task) => (task.id === data.id ? data : task)));
      } else {
        throw new Error("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      const response = await fetch(`/api/delete/${taskId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== taskId));
      } else {
        throw new Error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleCompletion = async (taskId: number) => {
    try {
      const taskToUpdate = tasks.find((task) => task.id === taskId);
      if (taskToUpdate) {
        const updatedTask = {
          ...taskToUpdate,
          completed: !taskToUpdate.completed,
        };
        await updateTask(taskId, updatedTask);
      }
    } catch (error) {
      console.error("Error toggling completion:", error);
    }
  };

  return (
    <main>
      <div
        className="w-screen h-screen bg-cover bg-center p-6"
        style={{ backgroundImage: "url(/app.png)" }}
      >
        <h1 className="text-3xl mb-4 text-gray-200 font-semibold">
          Task Manager
        </h1>
        <TaskForm onAdd={addTask} />
        <TaskList
          tasks={tasks}
          onDeletefun={deleteTask}
          onUpdatefun={updateTask}
          onToggleCompletion={toggleCompletion}
        />
      </div>
    </main>
  );
};

export default App;
