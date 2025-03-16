Vue.component('column', {
    props: ['title', 'tasks'],
    template: `
        <div class="col">
            <h3>{{ title }}</h3>
            <div v-for="task in tasks" :key="task.id">
                
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

    },
    methods: {

    },
    template: `
        <div>
            <h1>Канбан доска</h1>
            <button  class="add-btn">Add Task</button>
            <div class="row">
                <column title="Запланированные задачи" ></column>
                <column title="Задачи в работе" ></column>
                <column title="Тестирование" ></column>
                <column title="Выполненные задачи" ></column>
            </div>
        </div>
    `
});