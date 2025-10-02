document.addEventListener('DOMContentLoaded', () => {
    // --- Sidebar Collapse Functionality ---
    const sidebarCollapseBtn = document.querySelector('.sidebar-collapse-btn');
    const appBody = document.querySelector('.app-body');

    if (sidebarCollapseBtn && appBody) {
        // Load sidebar state from localStorage
        const isCollapsed = localStorage.getItem('stellar-sidebar-collapsed') === 'true';
        if (isCollapsed) {
            appBody.classList.add('sidebar-collapsed');
        }

        sidebarCollapseBtn.addEventListener('click', () => {
            appBody.classList.toggle('sidebar-collapsed');
            // Save sidebar state to localStorage
            const isNowCollapsed = appBody.classList.contains('sidebar-collapsed');
            localStorage.setItem('stellar-sidebar-collapsed', isNowCollapsed);
        });
    }

    // --- Theme Toggle for App ---
    // Note: The core theme logic is in theme.js, but we need to target the app's toggle button
    const themeToggleApp = document.getElementById('theme-toggle-app');

    // The functions applyTheme and toggleTheme are defined in theme.js and are available globally
    // This is a simplification. In a real app, we'd use modules.
    if (themeToggleApp && typeof toggleTheme === 'function') {
        themeToggleApp.addEventListener('click', toggleTheme);
    }

    // --- Task Management ---
    const taskArea = document.querySelector('.task-area');
    const addTaskBtn = document.querySelector('.page-header .btn-primary'); // More specific selector

    // Sample tasks (will be replaced by localStorage)
    let tasks = [
        { id: 1, title: 'Design the landing page hero section', completed: true, priority: 'high' },
        { id: 2, title: 'Implement the authentication modal', completed: true, priority: 'high' },
        { id: 3, title: 'Develop the core task management logic', completed: false, priority: 'medium' },
        { id: 4, title: 'Create the settings panel for theme customization', completed: false, priority: 'low' },
        { id: 5, title: 'Integrate drag-and-drop for Kanban view', completed: false, priority: 'medium' }
    ];
    let currentView = 'list';
    let searchTerm = '';
    let activeFilters = {
        status: 'all' // 'all', 'incomplete', 'completed'
    };

    const getTasks = () => {
        const storedTasks = localStorage.getItem('stellar-tasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
        }
    };

    const saveTasks = () => {
        localStorage.setItem('stellar-tasks', JSON.stringify(tasks));
    };

    const saveFilters = () => {
        localStorage.setItem('stellar-filters', JSON.stringify(activeFilters));
    };

    const render = () => {
        // 1. Filter by search term
        let filteredTasks = tasks.filter(task =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // 2. Filter by status
        if (activeFilters.status === 'incomplete') {
            filteredTasks = filteredTasks.filter(task => !task.completed);
        } else if (activeFilters.status === 'completed') {
            filteredTasks = filteredTasks.filter(task => task.completed);
        }

        document.querySelectorAll('.view-switcher .btn-icon').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === currentView);
        });

        switch (currentView) {
            case 'grid':
                renderGridView(filteredTasks);
                break;
            case 'kanban':
                renderKanbanView(filteredTasks);
                break;
            case 'list':
            default:
                renderListView(filteredTasks);
                break;
        }
        lucide.createIcons();
    };

    const renderListView = (tasksToRender) => {
        if (!taskArea) return;
        const emptyStateHTML = `<div class="empty-state"><i data-lucide="search-x" class="empty-state-icon"></i><h2>No tasks found</h2><p>Try adjusting your search or filters.</p></div>`;

        if (tasksToRender.length === 0) {
            taskArea.innerHTML = emptyStateHTML;
        } else {
            taskArea.innerHTML = `<div class="task-list">
                ${tasksToRender.map(task => `
                    <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                        <div class="task-checkbox"><i data-lucide="check"></i></div>
                        <span class="task-title">${task.title}</span>
                        <div class="task-actions"><button class="btn-icon task-delete-btn"><i data-lucide="trash-2"></i></button></div>
                    </div>
                `).join('')}
            </div>`;
        }
        attachTaskListeners();
    };

    const renderGridView = (tasksToRender) => {
        if (!taskArea) return;
        const emptyStateHTML = `<div class="empty-state"><i data-lucide="search-x" class="empty-state-icon"></i><h2>No tasks found</h2><p>Try adjusting your search or filters.</p></div>`;

        if (tasksToRender.length === 0) {
            taskArea.innerHTML = emptyStateHTML;
        } else {
            taskArea.innerHTML = `<div class="task-grid">
                ${tasksToRender.map(task => `
                    <div class="task-card ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                        <div class="task-card-content">
                            <span class="task-title">${task.title}</span>
                            <p class="task-description">Priority: ${task.priority}</p>
                        </div>
                        <div class="task-card-footer">
                            <div class="task-actions"><button class="btn-icon task-delete-btn"><i data-lucide="trash-2"></i></button></div>
                            <div class="task-checkbox"><i data-lucide="check"></i></div>
                        </div>
                    </div>
                `).join('')}
            </div>`;
        }
        attachTaskListeners();
    };

    const renderKanbanView = (tasksToRender) => {
        if (!taskArea) return;
        const columns = [{ title: 'To Do', status: 'todo' }, { title: 'Done', status: 'done' }];
        const tasksByColumn = {
            todo: tasksToRender.filter(t => !t.completed),
            done: tasksToRender.filter(t => t.completed)
        };

        taskArea.innerHTML = `<div class="kanban-board">
            ${columns.map(column => `
                <div class="kanban-column" data-status="${column.status}">
                    <h3 class="kanban-column-title">${column.title} (${tasksByColumn[column.status].length})</h3>
                    <div class="kanban-column-cards">
                        ${tasksByColumn[column.status].map(task => `
                            <div class="task-card ${task.completed ? 'completed' : ''}" data-id="${task.id}" draggable="true">
                                <div class="task-card-content"><span class="task-title">${task.title}</span></div>
                                <div class="task-card-footer">
                                    <div class="task-actions"><button class="btn-icon task-delete-btn"><i data-lucide="trash-2"></i></button></div>
                                    <div class="task-checkbox"><i data-lucide="check"></i></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>`;
        attachTaskListeners();
        attachKanbanListeners();
    };

    const attachKanbanListeners = () => {
        const cards = document.querySelectorAll('.kanban-column-cards .task-card');
        const columns = document.querySelectorAll('.kanban-column-cards');
        cards.forEach(card => {
            card.addEventListener('dragstart', () => card.classList.add('dragging'));
            card.addEventListener('dragend', () => card.classList.remove('dragging'));
        });
        columns.forEach(column => {
            column.addEventListener('dragover', e => { e.preventDefault(); column.classList.add('drag-over'); });
            column.addEventListener('dragleave', () => column.classList.remove('drag-over'));
            column.addEventListener('drop', e => {
                e.preventDefault();
                column.classList.remove('drag-over');
                const draggingCard = document.querySelector('.task-card.dragging');
                if (draggingCard) {
                    const taskId = parseInt(draggingCard.dataset.id);
                    const newStatus = column.closest('.kanban-column').dataset.status;
                    const task = tasks.find(t => t.id === taskId);
                    if (task) {
                        task.completed = (newStatus === 'done');
                        saveTasks();
                        render();
                    }
                }
            });
        });
    };

    const attachTaskListeners = () => {
        taskArea.querySelectorAll('[data-id]').forEach(element => {
            const taskId = parseInt(element.dataset.id);
            const checkbox = element.querySelector('.task-checkbox');
            const deleteBtn = element.querySelector('.task-delete-btn');
            if (checkbox) checkbox.addEventListener('click', e => { e.stopPropagation(); toggleTaskComplete(taskId); });
            if (element.classList.contains('task-item')) {
                element.querySelector('.task-title').addEventListener('click', e => { e.stopPropagation(); toggleTaskComplete(taskId); });
            }
            if (deleteBtn) deleteBtn.addEventListener('click', e => { e.stopPropagation(); deleteTask(taskId); });
        });
    };

    const toggleTaskComplete = id => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            render();
        }
    };

    const deleteTask = id => {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        render();
    };

    const addTask = title => {
        tasks.push({ id: Date.now(), title, completed: false, priority: 'medium' });
        saveTasks();
        render();
    };

    // --- Event Listeners Setup ---
    const setupEventListeners = () => {
        // View Switcher
        const viewSwitcher = document.querySelector('.view-switcher');
        if (viewSwitcher) {
            viewSwitcher.addEventListener('click', e => {
                const button = e.target.closest('.btn-icon');
                if (button && button.dataset.view) {
                    currentView = button.dataset.view;
                    localStorage.setItem('stellar-view', currentView);
                    render();
                }
            });
        }

        // Search Input
        const searchInput = document.querySelector('.search-bar input');
        if (searchInput) {
            searchInput.addEventListener('input', e => {
                // Debounce search input
                setTimeout(() => {
                    searchTerm = e.target.value;
                    render();
                }, 300);
            });
        }

        // Filter Sidebar
        const filterSidebar = document.querySelector('.filter-sidebar');
        const openFiltersBtn = document.querySelector('.filter-btn');
        const closeFiltersBtn = document.querySelector('.close-filters-btn');
        const statusFilter = document.getElementById('filter-status');

        if(openFiltersBtn) openFiltersBtn.addEventListener('click', () => {
            filterSidebar.classList.add('open');
            document.body.classList.add('filters-open');
        });
        if(closeFiltersBtn) closeFiltersBtn.addEventListener('click', () => {
            filterSidebar.classList.remove('open');
             document.body.classList.remove('filters-open');
        });

        if (statusFilter) {
            statusFilter.value = activeFilters.status; // Set initial value
            statusFilter.addEventListener('change', e => {
                activeFilters.status = e.target.value;
                saveFilters();
                render();
            });
        }


        // Drawer
        const drawerContainer = document.getElementById('task-drawer-container');
        const addTaskForm = document.getElementById('add-task-form');
        const openDrawerBtn = document.querySelector('.add-task-btn');
        const closeDrawerBtns = document.querySelectorAll('.close-drawer-btn');
        const drawerBackdrop = document.querySelector('.drawer-backdrop');
        const openDrawer = () => drawerContainer && drawerContainer.classList.remove('hidden');
        const closeDrawer = () => drawerContainer && drawerContainer.classList.add('hidden');
        if (openDrawerBtn) openDrawerBtn.addEventListener('click', openDrawer);
        closeDrawerBtns.forEach(btn => btn.addEventListener('click', closeDrawer));
        if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);
        if (addTaskForm) {
            addTaskForm.addEventListener('submit', e => {
                e.preventDefault();
                const titleInput = document.getElementById('new-task-title');
                if (titleInput.value.trim()) {
                    addTask(titleInput.value.trim());
                    titleInput.value = '';
                    closeDrawer();
                }
            });
        }

        // User Menu Dropdown
        const userAvatarBtn = document.getElementById('user-avatar-btn');
        const userMenuDropdown = document.getElementById('user-menu-dropdown');
        if (userAvatarBtn) {
            userAvatarBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userMenuDropdown.classList.toggle('hidden');
            });
        }
        document.addEventListener('click', () => {
            if (userMenuDropdown && !userMenuDropdown.classList.contains('hidden')) {
                userMenuDropdown.classList.add('hidden');
            }
        });

        // Logout Button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('stellar-user');
                window.location.href = 'index.html';
            });
        }

        // Settings Modal
        const settingsModalContainer = document.getElementById('settings-modal-container');
        const openSettingsBtn = document.getElementById('open-settings-btn');
        const closeSettingsBtns = document.querySelectorAll('.close-settings-btn, #settings-modal-container .modal-backdrop');

        if(openSettingsBtn) openSettingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if(settingsModalContainer) settingsModalContainer.classList.remove('hidden');
            if (userMenuDropdown) userMenuDropdown.classList.add('hidden');
        });

        closeSettingsBtns.forEach(btn => btn.addEventListener('click', () => {
             if(settingsModalContainer) settingsModalContainer.classList.add('hidden');
        }));

        // Settings Navigation
        const settingsNavItems = document.querySelectorAll('.settings-nav-item');
        const settingsSections = document.querySelectorAll('.settings-section');
        settingsNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = `settings-${item.dataset.section}`;

                settingsNavItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                settingsSections.forEach(section => {
                    section.classList.toggle('hidden', section.id !== sectionId);
                });
            });
        });

        // Accent Color Switcher
        const colorSwatches = document.querySelectorAll('.color-swatch');
        colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                applyAccentColor(swatch.dataset.color);
            });
        });
    };

    // --- Initial Load ---
    getTasks();
    currentView = localStorage.getItem('stellar-view') || 'list';
    const savedFilters = localStorage.getItem('stellar-filters');
    if (savedFilters) {
        activeFilters = JSON.parse(savedFilters);
    }
    setupEventListeners();
    render();

    // --- Drawer Functionality ---
    const drawerContainer = document.getElementById('task-drawer-container');
    const addTaskForm = document.getElementById('add-task-form');
    const openDrawerBtn = document.querySelector('.add-task-btn');
    const closeDrawerBtns = document.querySelectorAll('.close-drawer-btn');
    const drawerBackdrop = document.querySelector('.drawer-backdrop');

    const openDrawer = () => {
        if (drawerContainer) drawerContainer.classList.remove('hidden');
    };
    const closeDrawer = () => {
        if (drawerContainer) drawerContainer.classList.add('hidden');
    };

    if (openDrawerBtn) {
        openDrawerBtn.addEventListener('click', openDrawer);
    }

    closeDrawerBtns.forEach(btn => btn.addEventListener('click', closeDrawer));

    if (drawerBackdrop) {
        drawerBackdrop.addEventListener('click', closeDrawer);
    }

    if (addTaskForm) {
        addTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const titleInput = document.getElementById('new-task-title');
            const title = titleInput.value.trim();
            if (title) {
                addTask(title);
                titleInput.value = '';
                closeDrawer();
            }
        });
    }
});