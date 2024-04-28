(function () {

    let todoItemList = [];

    function createAppTitle(title) {

        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createTodoItemForm() {

        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        button.setAttribute('disabled', '');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {

            form,
            input,
            button
        };
    }

    function createTodoList() {

        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(todoObject) {

        let { name, done } = todoObject;

        let item = document.createElement('li');

        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        let todoItemObject = {
            id: createTodoItemId(),
            name: name,
            done: done
        };

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        todoItemList.push(todoItemObject);

        return {

            item,
            doneButton,
            deleteButton,
            todoItemObject
        };
    }

    function createTodoObject(name, done = false) {

        return { name: name, done: done };
    }

    function createTodoItemId() {

        return todoItemList.length === 0 ? 0 : todoItemList[todoItemList.length - 1].id + 1;
    }

    function createTodoApp(container, title = 'Список дел', listName) {

        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        if (getTodoListData(listName)) {

            let arr = getTodoListData(listName);

            for (let i = 0; i < arr.length; i++) {

                let todoItem = createTodoItem(createTodoObject(arr[i].name, arr[i].done));

                if (arr[i].done === true) {

                    todoItem.item.classList.add('list-group-item-success');
                }

                todoItemEvent(todoItem, listName);

                todoList.append(todoItem.item);
            }
        }

        todoItemForm.form.addEventListener('submit', function (e) {

            e.preventDefault();

            let todoItem = createTodoItem(createTodoObject(todoItemForm.input.value));

            setTodoListData(listName, todoItemList);

            todoItemEvent(todoItem, listName);

            todoList.append(todoItem.item);

            todoItemForm.input.value = '';
            todoItemForm.button.setAttribute('disabled', '');
        });

        todoItemForm.input.addEventListener('input', function () {

            todoItemForm.input.value.length === 0 ? todoItemForm.button.setAttribute('disabled', '') :
                todoItemForm.button.removeAttribute('disabled');
        });
    }

    function findTodoItemObject(id) {

        for (let i = 0; i < todoItemList.length; i++) {

            if (todoItemList[i].id === id) {

                return i;
            }
        }
    }

    function todoItemEvent(todoItem, listName) {

        todoItem.doneButton.addEventListener('click', function () {

            todoItem.item.classList.toggle('list-group-item-success');

            if (todoItem.item.classList.contains('list-group-item-success')) {

                todoItem.todoItemObject.done = true;
                todoItemList[findTodoItemObject(todoItem.todoItemObject.id)].done = true;
                setTodoListData(listName, todoItemList);
            }
            else {

                todoItem.todoItemObject.done = false;
                todoItemList[findTodoItemObject(todoItem.todoItemObject.id)].done = false;
                setTodoListData(listName, todoItemList);
            }
        });
        todoItem.deleteButton.addEventListener('click', function () {

            if (confirm('Вы уверены?')) {

                todoItem.item.remove();
                todoItemList.splice(findTodoItemObject(todoItem.todoItemObject.id), 1);
                removeObjectFromStorage(listName, todoItem.todoItemObject.id);
            }
        });
    }

    function removeObjectFromStorage(key, id) {

        let data = getTodoListData(key);

        let newData = [];
        for (let i = 0; i < data.length; i++) {

            if (data[i].id !== id) {

                newData.push(data[i]);
            }
        }

        setTodoListData(key, newData);
    }

    function getTodoListData(key) {

        return JSON.parse(localStorage.getItem(key));
    }

    function setTodoListData(key, data) {

        localStorage.setItem(key, JSON.stringify(data));
    }

    window.createTodoApp = createTodoApp;
})();