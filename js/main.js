Vue.component('task-card', {
    props: ['task'],
    template: `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">{{ task.title }}</h5>
                <p class="card-text">{{ task.description }}</p>
                <p class="card-text"><small>Создание: {{ task.createdAt }}</small></p>
                <p class="card-text"><small>Дедлайн: {{ task.deadline }}</small></p>
                <p class="card-text"><small>Последнее обновление: {{ task.lastEdited }}</small></p>
                <button @click="$emit('edit-task', task)" class="btn btn-info">Edit</button>
                <button @click="$emit('delete-task', task.id)" class="btn btn-danger">Delete</button>
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
                <task-card :task="task" @edit-task="$emit('edit-task', $event)" @delete-task="$emit('delete-task', $event)"></task-card>
            </div>
        </div>
    `
});

new Vue({
    el: '#app',
    data() {
        return {
            tasks: [],
            nextId: 1
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
        addTask() {
            const newTask = {
                id: this.nextId++,
                title: 'Заголовок',
                description: 'Описание',
                createdAt: new Date().toLocaleString(),
                deadline: '2023-12-31',
                lastEdited: new Date().toLocaleString(),
                status: 'planned'
            };
            this.tasks.push(newTask);
        },
        editTask(updatedTask) {
            const index = this.tasks.findIndex(task => task.id === updatedTask.id);
            if (index !== -1) {
                this.tasks[index] = updatedTask;
                this.tasks[index].lastEdited = new Date().toLocaleString();
            }
        },
        deleteTask(taskId) {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
        }
    },
    template: `
        <div class="container mt-4">
            <h1>Kanban Board</h1>
            <button @click="addTask" class="add-btn">Add Task</button>
            <div class="row">
                <column title="Запланированные задачи" :tasks="plannedTasks" @edit-task="editTask" @delete-task="deleteTask"></column>
                <column title="Задачи в работе" :tasks="inProgressTasks" @edit-task="editTask" @delete-task="deleteTask"></column>
                <column title="Тестирование" :tasks="testingTasks" @edit-task="editTask" @delete-task="deleteTask"></column>
                <column title="Выполненные задачи" :tasks="doneTasks" @edit-task="editTask" @delete-task="deleteTask"></column>
            </div>
        </div>
    `
});