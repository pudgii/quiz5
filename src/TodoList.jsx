import { useState, useEffect, useCallback, useMemo } from 'react';

let nextId = 4;

function TodoList() {
    const [tasks, setTasks] = useState([
        { id: 1, text: 'Learn React', completed: false },
        { id: 2, text: 'Build a TODO App', completed: false },
        { id: 3, text: 'Deploy the App', completed: false }
    ]);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');
    const [newTask, setNewTask] = useState('');
    const [filter, setFilter] = useState('All');
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true' ||
               window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        document.documentElement.classList.toggle('dark-mode', darkMode);
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    const handleTaskChange = useCallback((id, changes) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) => (task.id === id ? { ...task, ...changes } : task))
        );
    }, []);

    const handleEditSave = useCallback((id) => {
        if (editText.trim()) {
            handleTaskChange(id, { text: editText });
        }
        setEditingId(null);
    }, [editText, handleTaskChange]);

    const handleDelete = useCallback((id) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    }, []);

    const handleAddTask = useCallback(() => {
        if (newTask.trim()) {
            setTasks((prevTasks) => [
                ...prevTasks,
                { id: nextId++, text: newTask.trim(), completed: false }
            ]);
            setNewTask('');
        }
    }, [newTask]);

    // Allow adding task with Enter key
    const handleAddKeyDown = (e) => {
        if (e.key === 'Enter') handleAddTask();
    };

    const handleEditKeyDown = (e, id) => {
        if (e.key === 'Enter') handleEditSave(id);
        if (e.key === 'Escape') setEditingId(null);
    };

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
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
                    onKeyDown={handleAddKeyDown}
                />
                <button onClick={handleAddTask}>Add Task</button>
            </div>

            <div className="filter-buttons">
                {['All', 'Completed', 'Pending'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={filter === status ? 'active-filter' : ''}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <ul className="task-list">
                {filteredTasks.length === 0 && (
                    <li className="empty-state">No tasks here!</li>
                )}
                {filteredTasks.map((task) => (
                    <li key={task.id} className="task-item">
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleTaskChange(task.id, { completed: !task.completed })}
                        />
                        {editingId === task.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    onKeyDown={(e) => handleEditKeyDown(e, task.id)}
                                    autoFocus
                                />
                                <button onClick={() => handleEditSave(task.id)}>Save</button>
                                <button onClick={() => setEditingId(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <span className={task.completed ? 'completed-task' : ''}>
                                    {task.text}
                                </span>
                                <button onClick={() => { setEditingId(task.id); setEditText(task.text); }}>
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(task.id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodoList;
