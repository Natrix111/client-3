Vue.component('task-card', {
    props: ['task'],
    template: `
        <div class="card" :class="{ overdue: task.isOverdue, completed: task.status === 'done' }">
            <div class="card-body">
                <h5 class="card-title">{{ task.title }}</h5>
                <p class="card-text">{{ task.description }}</p>
                <p class="card-text"><small>Создано: {{ task.createdAt }}</small></p>
                <p class="card-text"><small>Дедлайн: {{ task.deadline }}</small></p>
                <p class="card-text"><small>Последнее изменение: {{ task.lastEdited }}</small></p>
                <button @click="$emit('edit-task', task)" class="btn btn-info">Редактировать</button>
                <button @click="$emit('delete-task', task.id)" class="btn btn-danger">Удалить</button>
            </div>
        </div>
    `
});

Vue.component('column', {
    props: ['title', 'tasks'],
    template: `
        <div class="col">
            <h3>{{ title }}</h3>
            <div v-for="task in tasks" :key="task.id">
                <task-card :task="task" 
                          @edit-task="$emit('edit-task', $event)" 
                          @delete-task="$emit('delete-task', $event)"></task-card>
            </div>
        </div>
    `
});

Vue.component('task-modal', {
    props: ['task', 'isVisible'],
    data() {
        return {
            localTask: {
                id: null,
                title: '',
                description: '',
                createdAt: '',
                deadline: '',
                lastEdited: '',
                status: 'planned'
            }
        };
    },
    watch: {
        task: {
            immediate: true,
            handler(newTask) {
                if (newTask) {
                    this.localTask = { ...newTask };
                } else {
                    this.localTask = {
                        id: null,
                        title: '',
                        description: '',
                        createdAt: '',
                        deadline: '',
                        lastEdited: '',
                        status: 'planned'
                    };
                }
            }
        }
    },
    template: `
        <div v-if="isVisible" class="modal-overlay">
            <div class="modal-content">
                <h3>{{ localTask.id ? 'Редактировать задачу' : 'Создать задачу' }}</h3>
                <div class="form-group">
                    <label for="title">Заголовок</label>
                    <input type="text" id="title" v-model="localTask.title" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="description">Описание</label>
                    <textarea id="description" v-model="localTask.description" class="form-control" required></textarea>
                </div>
                <div class="form-group">
                    <label for="deadline">Дедлайн</label>
                    <input type="date" id="deadline" v-model="localTask.deadline" class="form-control" required>
                </div>
                <div class="modal-actions">
                    <button @click="$emit('save-task', localTask)" class="btn btn-primary">Сохранить</button>
                    <button @click="$emit('close-modal')" class="btn btn-secondary">Отмена</button>
                </div>
            </div>
        </div>
    `
});

new Vue({
    el: '#app',
    data() {
        return {
            tasks: [],
            nextId: 1,
            isModalVisible: false,
            currentTask: null
        };
    },
    computed: {
        plannedTasks() {
            return this.tasks.filter(task => task.status === 'planned');
        },
        inProgressTasks() {
            return this.tasks.filter(task => task.status === 'in-progress');
        },
        testingTasks() {
            return this.tasks.filter(task => task.status === 'testing');
        },
        doneTasks() {
            return this.tasks.map(task => {
                const deadline = new Date(task.deadline);
                const now = new Date();
                task.isOverdue = deadline < now;
                return task;
            }).filter(task => task.status === 'done');
        }
    },
    methods: {
        openModal(task = null) {
            this.currentTask = task ? { ...task } : null;
            this.isModalVisible = true;
        },
        saveTask(updatedTask) {
            if (!updatedTask.title || !updatedTask.description || !updatedTask.deadline) {
                alert('Все поля обязательны для заполнения!');
                return;
            }

            if (updatedTask.id) {
                const index = this.tasks.findIndex(t => t.id === updatedTask.id);
                if (index !== -1) {
                    this.tasks.splice(index, 1, {
                        ...updatedTask,
                        lastEdited: new Date().toLocaleString()
                    });
                }
            } else {
                updatedTask.id = this.nextId++;
                updatedTask.createdAt = new Date().toLocaleString();
                updatedTask.lastEdited = new Date().toLocaleString();
                updatedTask.status = 'planned';
                this.tasks.push({ ...updatedTask });
            }
            this.isModalVisible = false;
        },
        deleteTask(taskId) {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
        }
    },
    template: `
        <div>
            <h1>Канбан доска</h1>
            <button @click="openModal" class="add-btn">Добавить задачу</button>
            <div class="row">
                <column title="Запланированные задачи" 
                         :tasks="plannedTasks" 
                         @edit-task="openModal" 
                         @delete-task="deleteTask">
                </column>
                <column title="Задачи в работе" 
                         :tasks="inProgressTasks" 
                         @edit-task="openModal" 
                         @delete-task="deleteTask">
                </column>
                <column title="Тестирование" 
                         :tasks="testingTasks" 
                         @edit-task="openModal" 
                         @delete-task="deleteTask">
                </column>
                <column title="Выполненные задачи" 
                         :tasks="doneTasks" 
                         @edit-task="openModal" 
                         @delete-task="deleteTask">
                </column>
            </div>
            <task-modal 
                :task="currentTask" 
                :isVisible="isModalVisible" 
                @save-task="saveTask" 
                @close-modal="isModalVisible = false">  
            </task-modal>
        </div>
    `
});