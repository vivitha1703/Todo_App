// Global variables
let token = localStorage.getItem('token');
const API_BASE_URL = 'http://localhost:5000/api';

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        if (!token) {
            window.location.href = 'login.html';
        } else {
            loadTasks();
        }
    } else if ((window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('register.html')) && token) {
        window.location.href = 'index.html';
    }

    // Setup event listeners
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', handleLogin);
    }

    if (document.getElementById('registerForm')) {
        document.getElementById('registerForm').addEventListener('submit', handleRegister);
    }

    if (document.getElementById('taskForm')) {
        document.getElementById('taskForm').addEventListener('submit', handleAddTask);
    }

    if (document.getElementById('logoutBtn')) {
        document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    }
});

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            token = data.token;
            localStorage.setItem('token', token);
            window.location.href = 'index.html';
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during login');
    }
}

// Handle registration
async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during registration');
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('token');
    token = null;
    window.location.href = 'login.html';
}

// Load tasks
async function loadTasks() {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const tasks = await response.json();
            renderTasks(tasks);
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to load tasks');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while loading tasks');
    }
}

// Render tasks
function renderTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        taskList.innerHTML = '<p>No tasks found. Add a new task to get started!</p>';
        return;
    }

    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task ${task.status === 'Complete' ? 'complete' : ''}`;
        taskElement.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description || 'No description'}</p>
            <p class="due-date">Due: ${task.due_date || 'No due date'}</p>
            <div class="actions">
                <button class="complete-btn btn-success" data-id="${task.id}">
                    ${task.status === 'Complete' ? 'Mark Open' : 'Mark Complete'}
                </button>
                <button class="delete-btn btn-danger" data-id="${task.id}">Delete</button>
            </div>
        `;
        taskList.appendChild(taskElement);
    });

    // Add event listeners to action buttons
    document.querySelectorAll('.complete-btn').forEach(button => {
        button.addEventListener('click', handleCompleteTask);
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', handleDeleteTask);
    });
}

// Handle add task
async function handleAddTask(e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('dueDate').value;

    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title,
                description,
                due_date: dueDate,
                status: 'Open'
            })
        });

        if (response.ok) {
            document.getElementById('taskForm').reset();
            loadTasks();
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to add task');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding task');
    }
}

// Handle complete task
async function handleCompleteTask(e) {
    const taskId = e.target.getAttribute('data-id');
    const taskElement = e.target.closest('.task');
    const currentStatus = taskElement.classList.contains('complete') ? 'Complete' : 'Open';
    const newStatus = currentStatus === 'Complete' ? 'Open' : 'Complete';

    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                status: newStatus
            })
        });

        if (response.ok) {
            loadTasks();
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to update task');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating task');
    }
}

// Handle delete task
async function handleDeleteTask(e) {
    const taskId = e.target.getAttribute('data-id');
    
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            loadTasks();
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to delete task');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting task');
    }
}