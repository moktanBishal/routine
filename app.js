let tasks = {};
        let totalSeconds = 0;
        let totalTimer = null;

        function updateTotalTime() {
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const secs = totalSeconds % 60;
            document.getElementById('totalTime').textContent = 
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }

        function addTask() {
            const taskInput = document.getElementById('taskInput');
            const taskText = taskInput.value.trim();
            
            if (taskText) {
                const taskList = document.getElementById('taskList');
                const taskId = 'task-' + Date.now();
                
                const li = document.createElement('li');
                li.className = 'task-item';
                li.id = taskId;
                li.innerHTML = `
                    <span>${taskText}</span>
                    <div class="task-controls">
                        <span class="task-timer">00:00:00</span>
                        <div class="time-inputs">
                            <input type="number" placeholder="H" min="0" max="23" class="time-input">
                            <input type="number" placeholder="M" min="0" max="59" class="time-input">
                            <input type="number" placeholder="S" min="0" max="59" class="time-input">
                        </div>
                        <button onclick="toggleTimer('${taskId}')" class="play-pause-btn">Start</button>
                        <button class="delete" onclick="deleteTask('${taskId}')">Delete</button>
                    </div>
                `;
                
                taskList.appendChild(li);
                taskInput.value = '';
                
                tasks[taskId] = {
                    seconds: 0,
                    timer: null,
                    isRunning: false
                };
            }
        }

        function updateTaskDisplay(taskId) {
            const task = tasks[taskId];
            const hours = Math.floor(task.seconds / 3600);
            const minutes = Math.floor((task.seconds % 3600) / 60);
            const secs = task.seconds % 60;
            const taskElement = document.getElementById(taskId);
            const timerDisplay = taskElement.querySelector('.task-timer');
            timerDisplay.textContent = 
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }

        function toggleTimer(taskId) {
            const task = tasks[taskId];
            const button = document.querySelector(`#${taskId} .play-pause-btn`);
            
            if (task.isRunning) {
                pauseTaskTimer(taskId);
                button.textContent = 'Play';
            } else {
                startTaskTimer(taskId);
                button.textContent = 'Pause';
            }
        }

        function startTaskTimer(taskId) {
            const task = tasks[taskId];
            const taskElement = document.getElementById(taskId);
            const inputs = taskElement.querySelectorAll('.time-input');
            
            if (!task.isRunning) {
                if (!task.timer && task.seconds === 0) {
                    const hours = parseInt(inputs[0].value || 0);
                    const minutes = parseInt(inputs[1].value || 0);
                    const secs = parseInt(inputs[2].value || 0);
                    
                    if (hours + minutes + secs > 0) {
                        task.seconds = hours * 3600 + minutes * 60 + secs;
                    }
                }
                
                if (task.seconds > 0) {
                    task.timer = setInterval(() => {
                        if (task.seconds > 0) {
                            task.seconds--;
                            totalSeconds++;
                            updateTaskDisplay(taskId);
                            updateTotalTime();
                        } else {
                            toggleTimer(taskId);
                            alert(`Time is up for task!`);
                        }
                    }, 1000);
                    task.isRunning = true;
                }
            }
        }

        function pauseTaskTimer(taskId) {
            const task = tasks[taskId];
            if (task.timer) {
                clearInterval(task.timer);
                task.timer = null;
                task.isRunning = false;
            }
        }

        function deleteTask(taskId) {
            const task = tasks[taskId];
            if (task.timer) {
                pauseTaskTimer(taskId);
            }
            delete tasks[taskId];
            document.getElementById(taskId).remove();
        }

        document.getElementById('taskInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTask();
            }
        });

        function addStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .play-pause-btn {
                    min-width: 80px;
                }
            `;
            document.head.appendChild(style);
        }
        addStyles();