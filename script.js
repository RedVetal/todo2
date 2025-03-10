document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput'); // Поле ввода задачи
    const addTaskBtn = document.getElementById('addTaskBtn'); // Кнопка добавления задачи
    const todoList = document.getElementById('todoList'); // Список "Поставить задачу"
    const inProgressList = document.getElementById('inProgressList'); // Список "В процессе"
    const doneList = document.getElementById('doneList'); // Список "Выполнено"
  
    // Загружаем задачи из LocalStorage или создаем пустой массив
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
    // Функция для отображения задач
    function renderTasks() {
      // Очищаем все списки
      todoList.innerHTML = '';
      inProgressList.innerHTML = '';
      doneList.innerHTML = '';
  
      // Проходим по всем задачам
      tasks.forEach((task, index) => {
        const li = document.createElement('li'); // Создаем элемент списка
        li.textContent = task.text; // Добавляем текст задачи
  
        // Создаем кнопку удаления
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Удалить';
        deleteBtn.addEventListener('click', () => {
          tasks.splice(index, 1); // Удаляем задачу из массива
          localStorage.setItem('tasks', JSON.stringify(tasks)); // Обновляем LocalStorage
          renderTasks(); // Перерисовываем задачи
        });
  
        // Добавляем кнопку удаления в элемент списка
        li.appendChild(deleteBtn);
  
        // Добавляем задачу в соответствующую колонку
        if (task.status === 'todo') {
          todoList.appendChild(li);
        } else if (task.status === 'inProgress') {
          inProgressList.appendChild(li);
        } else if (task.status === 'done') {
          doneList.appendChild(li);
        }
  
        // Добавляем возможность перемещения задач
        li.setAttribute('draggable', true); // Делаем элемент перетаскиваемым
        li.addEventListener('dragstart', () => {
          li.classList.add('dragging'); // Добавляем класс при перетаскивании
        });
        li.addEventListener('dragend', () => {
          li.classList.remove('dragging'); // Убираем класс после перетаскивания
        });
      });
  
      // Добавляем обработчики для колонок
      const columns = document.querySelectorAll('.column');
      columns.forEach(column => {
        column.addEventListener('dragover', e => {
          e.preventDefault(); // Разрешаем перетаскивание
          const dragging = document.querySelector('.dragging'); // Находим перетаскиваемый элемент
          column.querySelector('.task-list').appendChild(dragging); // Добавляем элемент в колонку
  
          // Обновляем статус задачи
          const taskText = dragging.textContent.replace('Удалить', '').trim();
          const taskIndex = tasks.findIndex(task => task.text === taskText);
          if (column.querySelector('h2').textContent === 'Поставить задачу') {
            tasks[taskIndex].status = 'todo';
          } else if (column.querySelector('h2').textContent === 'В процессе') {
            tasks[taskIndex].status = 'inProgress';
          } else if (column.querySelector('h2').textContent === 'Выполнено') {
            tasks[taskIndex].status = 'done';
          }
          localStorage.setItem('tasks', JSON.stringify(tasks)); // Обновляем LocalStorage
        });
      });
    }
  
    // Добавляем обработчик для кнопки добавления задачи
    addTaskBtn.addEventListener('click', () => {
      const text = taskInput.value.trim(); // Получаем текст задачи и убираем лишние пробелы
  
      // Если текст не пустой, добавляем задачу
      if (text !== '') {
        tasks.push({ text, status: 'todo' }); // Добавляем задачу в массив
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Обновляем LocalStorage
        taskInput.value = ''; // Очищаем поле ввода
        renderTasks(); // Перерисовываем задачи
      }
    });
  
    // Инициализация: отображаем задачи при загрузке страницы
    renderTasks();
  });