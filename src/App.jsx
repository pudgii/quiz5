import { useState, useEffect, useCallback, useMemo } from 'react';
import './index.css';

function TodoList() {
    const [tasks, setTasks] = useState([
        { text: 'Learn React', completed: false },
        { text: 'Build a TODO App', completed: false },
        { text: 'Deploy the App', completed: false }
    ]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editText, setEditText] = useState('');
    const [newTask, setNewTask] = useState(''); // New state for adding tasks
    const [filter, setFilter] = useState('All');
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true' || 
               window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        document.documentElement.classList.toggle('dark-mode', darkMode);
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    const handleTaskChange = useCallback((index, changes) => {
        setTasks((prevTasks) => {
            const updatedTasks = [...prevTasks];
            updatedTasks[index] = { ...updatedTasks[index], ...changes };
            return updatedTasks;
        });
    }, []);

    const handleEditSave = useCallback((index) => {
        if (editText.trim()) {
            handleTaskChange(index, { text: editText });
        }
        setEditingIndex(null);
    }, [editText, handleTaskChange]);

    const handleDelete = useCallback((index) => {
        setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
    }, []);

    const handleAddTask = () => {
        if (newTask.trim()) {
            setTasks((prevTasks) => [...prevTasks, { text: newTask, completed: false }]);
            setNewTask(''); // Clear input after adding the task
        }
    };

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            if (filter === 'Completed') return task.completed;
            if (filter === 'Pending') return !task.completed;
            return true;
        });
    }, [tasks, filter]);

    return (
        <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
            <h2>Todo List</h2>
            <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>

            {/* Add Task Section */}
            <div className="add-task">
                <input
                    type="text"
                    placeholder="Add a new task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                />
                <button onClick={handleAddTask}>Add Task</button>
            </div>

            <div className="filter-buttons">
                {['All', 'Completed', 'Pending'].map((status) => (
                    <button key={status} onClick={() => setFilter(status)}>
                        {status}
                    </button>
                ))}
            </div>

            <ul className="task-list">
                {filteredTasks.map((task, index) => (
                    <li key={index} className="task-item">
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleTaskChange(index, { completed: !task.completed })}
                        />
                        {editingIndex === index ? (
                            <>
                                <input
                                    type="text"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                />
                                <button onClick={() => handleEditSave(index)}>Save</button>
                                <button onClick={() => setEditingIndex(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <span className={task.completed ? 'completed-task' : ''}>
                                    {task.text}
                                </span>
                                <button onClick={() => { 
                                    setEditingIndex(index); 
                                    setEditText(task.text); 
                                }}>
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(index)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodoList;
