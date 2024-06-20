document.addEventListener('DOMContentLoaded', function() {
    // Элементы, общие для всех страниц
    const loginButton = document.getElementById('login-btn');
    const logoutButton = document.getElementById('logout-btn');
    const closeModalButton = document.getElementById('close-modal');
    const authButtons = document.getElementById('auth-buttons');
    const profileButtons = document.getElementById('profile-buttons');
    const welcomeMessage = document.getElementById('welcome-message');
    const navLinks = document.getElementById('nav-links');
    const quickLinks = document.getElementById('quick-links');
    const welcomeSection = document.getElementById('welcome-section');
    const interactiveContent = document.getElementById('interactive-content');
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const editUserModal = document.getElementById('edit-user-modal');
    const closeEditModalButton = document.getElementById('close-edit-modal');
    const editUserForm = document.getElementById('edit-user-form');
    const editMaterialModal = document.getElementById('edit-material-modal');
    const closeEditMaterialModalButton = document.getElementById('close-edit-material-modal');
    const editMaterialForm = document.getElementById('edit-material-form');
    const downloadReportButton = document.getElementById('download-report-btn');

    let currentUser = null;

    // Проверка наличия элементов перед добавлением обработчиков событий
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            loginModal.style.display = 'block';
        });
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', function() {
            loginModal.style.display = 'none';
        });
    }

    if (window) {
        window.addEventListener('click', function(event) {
            if (event.target == loginModal) {
                loginModal.style.display = 'none';
            }
            if (event.target == editUserModal) {
                editUserModal.style.display = 'none';
            }
            if (event.target == editMaterialModal) {
                editMaterialModal.style.display = 'none';
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = loginForm.username.value;
            const password = loginForm.password.value;

            fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    currentUser = parseJwt(data.token);
                    loginModal.style.display = 'none';
                    updateUI();
                } else {
                    alert(data.error || 'Ошибка авторизации');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('token');
            currentUser = null;
            updateUI();
        });
    }

    if (closeEditModalButton) {
        closeEditModalButton.addEventListener('click', function() {
            editUserModal.style.display = 'none';
        });
    }

    if (closeEditMaterialModalButton) {
        closeEditMaterialModalButton.addEventListener('click', function() {
            editMaterialModal.style.display = 'none';
        });
    }

    if (editUserForm) {
        editUserForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const id = document.getElementById('edit-user-id').value;
            const username = document.getElementById('edit-username').value;
            const role = document.getElementById('edit-role').value;
            const first_name = document.getElementById('edit-first_name').value;
            const last_name = document.getElementById('edit-last_name').value;
            const email = document.getElementById('edit-email').value;
            const phone = document.getElementById('edit-phone').value;

            fetch(`/api/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ username, role, first_name, last_name, email, phone })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert('Пользователь успешно обновлен');
                    editUserModal.style.display = 'none';
                    fetchUsers();
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }

    if (editMaterialForm) {
        editMaterialForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const id = document.getElementById('edit-material-id').value;
            const name = document.getElementById('edit-material-name').value;
            const description = document.getElementById('edit-material-description').value;
            const price = document.getElementById('edit-material-price').value;
            const quantity = document.getElementById('edit-material-quantity').value;

            fetch(`/api/materials/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ name, description, price, quantity })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert('Материал успешно обновлен');
                    editMaterialModal.style.display = 'none';
                    fetchMaterials();
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }

    if (downloadReportButton) {
        downloadReportButton.addEventListener('click', function() {
            fetch('/api/reports/generate', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.filePath) {
                    fetch('/api/reports/download', {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                    .then(response => response.blob())
                    .then(blob => {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = url;
                        a.download = 'report.pdf';
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                    })
                    .catch(error => {
                        console.error('Error downloading report:', error);
                    });
                } else {
                    alert('Ошибка при генерации отчета');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }

    function updateUI() {
        if (currentUser) {
            if (authButtons) authButtons.style.display = 'none';
            if (profileButtons) profileButtons.style.display = 'flex';
            if (welcomeMessage) welcomeMessage.textContent = `Добро пожаловать, ${currentUser.username}!`;

            if (navLinks) {
                navLinks.innerHTML = '';
                if (currentUser.role === 'admin') {
                    navLinks.innerHTML = '<li><a href="/materials">Каталог</a></li><li><a href="/materials/add">Добавить материал</a></li><li><a href="/reports">Отчеты</a></li><li><a href="/users/manage">Управление пользователями</a></li>';
                } else if (currentUser.role === 'manager') {
                    navLinks.innerHTML = '<li><a href="/materials">Каталог</a></li><li><a href="/materials/add">Добавить материал</a></li><li><a href="/reports">Отчеты</а></ли>';
                } else if (currentUser.role === 'staff') {
                    navLinks.innerHTML = '<ли><а хреф="/materials">Каталог</а></ли><ли><а хреф="/reports">Отчеты</а></ли>';
                }
            }

            if (quickLinks) {
                quickLinks.innerHTML = '';
                if (currentUser.role === 'admin' || currentUser.role === 'manager') {
                    quickLinks.innerHTML = '<a href="/materials" class="btn">Перейти к каталогу</a><a href="/materials/add" class="btn">Добавить материал</a><a href="/reports" class="btn">Просмотреть отчеты</a>';
                } else if (currentUser.role === 'staff') {
                    quickLinks.innerHTML = '<a href="/materials" class="btn">Перейти к каталогу</a><a href="/reports" class="btn">Просмотреть отчеты</a>';
                }
            }

            if (welcomeSection) welcomeSection.style.display = 'block';
            if (interactiveContent) interactiveContent.style.display = 'block';
        } else {
            if (authButtons) authButtons.style.display = 'flex';
            if (profileButtons) profileButtons.style.display = 'none';
            if (navLinks) navLinks.innerHTML = '';
            if (quickLinks) quickLinks.innerHTML = '';
            if (welcomeSection) welcomeSection.style.display = 'block';
            if (interactiveContent) interactiveContent.style.display = 'none';
        }
    }

    function parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    const token = localStorage.getItem('token');
    if (token) {
        currentUser = parseJwt(token);
    }
    updateUI();

    // Обработка отображения каталога материалов
    function fetchMaterials() {
        fetch('/api/materials', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            const materialsList = document.querySelector('#materials-list tbody');
            if (materialsList) {
                materialsList.innerHTML = data.map(material => `
                    <tr class="material-item" data-id="${material.id}">
                        <td>${material.name}</td>
                        <td>${material.description}</td>
                        <td>${material.price}</td>
                        <td>${material.quantity}</td>
                        <td>
                            <button onclick="openEditMaterialModal(${material.id})">Редактировать</button>
                            ${currentUser.role === 'admin' ? `<button onclick="deleteMaterial(${material.id})">Удалить</button>` : ''}
                        </td>
                    </tr>
                `).join('');
            }
        })
        .catch(error => {
            console.error('Error fetching materials:', error);
        });
    }

    if (window.location.pathname === '/materials') {
        fetchMaterials();
    }

    // Функция для открытия модального окна редактирования материала
    window.openEditMaterialModal = function(id) {
        const materialRow = document.querySelector(`.material-item[data-id='${id}']`);
        document.getElementById('edit-material-id').value = id;
        document.getElementById('edit-material-name').value = materialRow.querySelector('td:nth-child(1)').textContent;
        document.getElementById('edit-material-description').value = materialRow.querySelector('td:nth-child(2)').textContent;
        document.getElementById('edit-material-price').value = materialRow.querySelector('td:nth-child(3)').textContent;
        document.getElementById('edit-material-quantity').value = materialRow.querySelector('td:nth-child(4)').textContent;
        editMaterialModal.style.display = 'block';
    };

    // Функция для удаления материала
    window.deleteMaterial = function(id) {
        if (confirm('Вы уверены, что хотите удалить этот материал?')) {
            fetch(`/api/materials/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert('Материал успешно удален');
                    fetchMaterials();
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    };

    // Обработка формы добавления пользователя
    const addUserForm = document.getElementById('add-user-form');
    if (addUserForm) {
        addUserForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = addUserForm.username.value;
            const password = addUserForm.password.value;
            const role = addUserForm.role.value;
            const first_name = addUserForm.first_name.value;
            const last_name = addUserForm.last_name.value;
            const email = addUserForm.email.value;
            const phone = addUserForm.phone.value;

            fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ username, password, role, first_name, last_name, email, phone })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert('Пользователь успешно добавлен');
                    addUserForm.reset();
                    fetchUsers();
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }

    // Функция для получения списка пользователей
    function fetchUsers() {
        fetch('/api/users', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            const usersList = document.querySelector('#users-list tbody');
            if (usersList) {
                usersList.innerHTML = data.map(user => `
                    <tr class="user-item" data-id="${user.id}">
                        <td>${user.username}</td>
                        <td class="role">${user.role}</td>
                        <td class="first_name">${user.first_name}</td>
                        <td class="last_name">${user.last_name}</td>
                        <td class="email">${user.email}</td>
                        <td class="phone">${user.phone}</td>
                        <td>
                            <button onclick="openEditUserModal(${user.id})">Редактировать</button>
                            <button onclick="deleteUser(${user.id})">Удалить</button>
                        </td>
                    </tr>
                `).join('');
            }
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });
    }

    window.openEditUserModal = function(id) {
        const userRow = document.querySelector(`.user-item[data-id='${id}']`);
        document.getElementById('edit-user-id').value = id;
        document.getElementById('edit-username').value = userRow.querySelector('td:nth-child(1)').textContent;
        document.getElementById('edit-role').value = userRow.querySelector('td:nth-child(2)').textContent;
        document.getElementById('edit-first_name').value = userRow.querySelector('td:nth-child(3)').textContent;
        document.getElementById('edit-last_name').value = userRow.querySelector('td:nth-child(4)').textContent;
        document.getElementById('edit-email').value = userRow.querySelector('td:nth-child(5)').textContent;
        document.getElementById('edit-phone').value = userRow.querySelector('td:nth-child(6)').textContent;
        editUserModal.style.display = 'block';
    };

    window.deleteUser = function(id) {
        if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            fetch(`/api/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert('Пользователь успешно удален');
                    fetchUsers();
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    };

    if (window.location.pathname === '/users/manage') {
        fetchUsers();
    }

    // Обработка формы создания отчета
    const createReportForm = document.getElementById('create-report-form');
    if (createReportForm) {
        createReportForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const report_type = createReportForm.report_type.value;
            const content = createReportForm.content.value;

            fetch('/api/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ user_id: currentUser.id, report_type, content })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert('Отчет успешно создан');
                    createReportForm.reset();
                    fetchReports();
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }

    // Функция для получения списка отчетов
    function fetchReports() {
        fetch('/api/reports', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            const reportsList = document.getElementById('reports-list');
            if (reportsList) {
                reportsList.innerHTML = data.map(report => `
                    <div class="report-item">
                        <h2>${report.report_type}</h2>
                        <p>${report.content}</p>
                        <canvas id="chart-${report.id}" class="report-chart"></canvas>
                    </div>
                `).join('');

                data.forEach(report => {
                    const ctx = document.getElementById(`chart-${report.id}`).getContext('2d');
                    new Chart(ctx, {
                        type: 'bar', // или 'line', 'pie' и т.д.
                        data: {
                            labels: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль'],
                            datasets: [{
                                label: report.report_type,
                                data: [12, 19, 3, 5, 2, 3, 7], // данные для отчета
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                });
            }
        })
        .catch(error => {
            console.error('Error fetching reports:', error);
        });
    }

    if (window.location.pathname === '/reports') {
        fetchReports();
    }
});
const addmaterials = document.getElementById('add-material-form')
if (addmaterials) {
    addmaterials.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const price = document.getElementById('price').value;
        const quantity = document.getElementById('quantity').value;
       

        fetch(`/api/addMaterial`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ name, description, price, quantity })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                alert('Товар успешно добавлен');
                
                
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
}