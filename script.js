/* =====================================
   HIBIFORGE
   PRODUCTIVITY APP
===================================== */


/* =====================================
   ELEMENTS
===================================== */

const addTaskButton =
    document.getElementById("addTaskButton");

const taskModal =
    document.getElementById("taskModal");

const closeModal =
    document.getElementById("closeModal");

const taskForm =
    document.getElementById("taskForm");

const taskList =
    document.getElementById("taskList");

const emptyState =
    document.getElementById("emptyState");

const taskCount =
    document.getElementById("taskCount");

const completedText =
    document.getElementById("completedText");

const highPriorityCount =
    document.getElementById("highPriorityCount");

const aiSuggestion =
    document.getElementById("aiSuggestion");

const aiActionButton =
    document.getElementById("aiActionButton");

const askAIButton =
    document.getElementById("askAIButton");

const toast =
    document.getElementById("toast");
const searchTask =
    document.getElementById("searchTask");
const filterTask =
    document.getElementById("filterTask");
const sortTask =
    document.getElementById("sortTask");
const calendarGrid =
    document.getElementById("calendarGrid");

const monthYear =
    document.getElementById("monthYear");

const prevMonth =
    document.getElementById("prevMonth");

const nextMonth =
    document.getElementById("nextMonth");
const todayTaskList =
    document.getElementById("todayTaskList");
const progressPercent =
    document.getElementById("progressPercent");

const progressFill =
    document.getElementById("progressFill");

const progressText =
    document.getElementById("progressText");
const viewAllButton =
    document.getElementById("viewAllButton");
const clearCompletedButton =
    document.getElementById("clearCompletedButton");

/* =====================================
   TASK DATA
===================================== */

/*
   Load saved tasks from browser storage.

   If there are no saved tasks,
   start with an empty array.
*/

let tasks =
    JSON.parse(
        localStorage.getItem("hibiforgeTasks")
    ) || [];

    let editingTaskId = null;

/* =====================================
   SAVE TASKS
===================================== */

function saveTasks() {

    localStorage.setItem(
        "hibiforgeTasks",
        JSON.stringify(tasks)
    );

}


/* =====================================
   OPEN MODAL
===================================== */

addTaskButton.addEventListener(
    "click",
    function () {

        taskModal.classList.add("show");

        document.getElementById("taskName").focus();

    }
);


/* =====================================
   CLOSE MODAL
===================================== */

closeModal.addEventListener(
    "click",
    function () {

        taskModal.classList.remove("show");

    }
);


/* =====================================
   CLOSE WHEN CLICKING OUTSIDE
===================================== */

taskModal.addEventListener(
    "click",
    function (event) {

        if (event.target === taskModal) {

            taskModal.classList.remove("show");

        }

    }
);


/* =====================================
   ADD TASK
===================================== */

taskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            document.getElementById("taskName").value;

        const date =
            document.getElementById("taskDate").value;

        const time =
            document.getElementById("taskTime").value;

        const priority =
            document.getElementById("taskPriority").value;

        const duration =
            document.getElementById("taskDuration").value;


if (editingTaskId !== null) {

    const task = tasks.find(task => task.id === editingTaskId);

    task.name = name;
    task.date = date;
    task.time = time;
    task.priority = priority;
    task.duration = duration;
    task.notified = false; 

    editingTaskId = null;

    showToast("✓ Task updated");

} else {

    const newTask = {
        id: Date.now(),
        name: name,
        date: date,
        time: time,
        priority: priority,
        duration: duration,
        completed: false,
        notified: false
    };

    tasks.push(newTask);

    showToast("✓ Task added");
}

        /* SAVE TASK */

        saveTasks();


        renderTasks();
        renderTodayTasks();
        renderCalendar();


        taskForm.reset();


        /* Put today's date back */

        setTodayDate();


        taskModal.classList.remove("show");




    }
);


/* =====================================
   RENDER TASKS
===================================== */

function renderTasks() {

    /*
       Remove old task elements.
    */

    const existingTasks =
        document.querySelectorAll(".task");


    existingTasks.forEach(
        function (task) {

            task.remove();

        }
    );


    /* Empty state */

    if (tasks.length === 0) {

        emptyState.style.display = "block";

        updateStats();

        updateAISuggestion();

        return;

    }


    emptyState.style.display = "none";


    /* Create tasks */

const keyword =
    searchTask
        ? searchTask.value.toLowerCase()
        : "";

const filter =
    filterTask
        ? filterTask.value
        : "all";

let filteredTasks = tasks.filter(function(task){

    const matchesSearch =
        task.name.toLowerCase().includes(keyword);

    let matchesFilter = true;

    if(filter==="high")
        matchesFilter = task.priority==="high";

    else if(filter==="medium")
        matchesFilter = task.priority==="medium";

    else if(filter==="low")
        matchesFilter = task.priority==="low";

    else if(filter==="completed")
        matchesFilter = task.completed;
return matchesSearch && matchesFilter;

});

if(sortTask){

    if(sortTask.value==="newest"){

        filteredTasks.sort(function(a,b){

            return b.id-a.id;

        });

    }

    else if(sortTask.value==="oldest"){

        filteredTasks.sort(function(a,b){

            return a.id-b.id;

        });

    }

    else if(sortTask.value==="priority"){

        const order={
            high:1,
            medium:2,
            low:3
        };

        filteredTasks.sort(function(a,b){

            return order[a.priority]-order[b.priority];

        });

    }

    else if(sortTask.value==="date"){

        filteredTasks.sort(function(a,b){

            return new Date(a.date)-new Date(b.date);

        });

    }

}

filteredTasks.forEach(function(task){
            const taskElement =
                document.createElement("div");


            taskElement.className = "task";


            /* Priority icon */

            let icon = "!";

            let iconClass = "red";


            if (task.priority === "medium") {

                icon = "◐";

                iconClass = "yellow";

            }


            if (task.priority === "low") {

                icon = "✓";

                iconClass = "green";

            }
            const today = new Date();

today.setHours(0,0,0,0);

const taskDate = new Date(task.date);

taskDate.setHours(0,0,0,0);

let status = "";
let statusClass = "";

if(task.completed){

    status = "Completed";
    statusClass = "completed-status";

}
else if(taskDate.getTime() < today.getTime()){

    status = "Overdue";
    statusClass = "overdue-status";

}
else if(taskDate.getTime() === today.getTime()){

    status = "Today";
    statusClass = "today-status";

}
else{

    status = "Upcoming";
    statusClass = "upcoming-status";

}


            /* Task element */


            taskElement.innerHTML = `

                <div
                    class="task-icon ${iconClass}"
                >
                    ${icon}
                </div>


                <div class="task-info">

                    <h3>
                        ${escapeHTML(task.name)}
                    </h3>

<p>
    ${formatTaskDate(task.date)}
    ${task.time ? " · " + task.time : ""}
    · ${escapeHTML(task.duration || "")}
</p>

<span class="${statusClass}">
    ${status}
</span>

                </div>


                <span
                    class="priority ${task.priority}"
                >
                    ${capitalize(task.priority)}
                </span>


               <button
    class="task-edit"
    title="Edit"
    onclick="editTask(${task.id})"
>
    ✏️
</button>

<button
    class="task-complete"
    title="Complete"
    onclick="completeTask(${task.id})"
>
    ✓
</button>

<button
    class="task-delete"
    title="Delete"
    onclick="deleteTask(${task.id})"
>
    ×
</button>
            `;


            /*
               Show completed task differently.
            */

            if (task.completed) {

                taskElement.classList.add("completed");

            }


            taskList.appendChild(taskElement);

        }
    );


    updateStats();

    updateAISuggestion();

}


/* =====================================
   DELETE TASK
===================================== */

function deleteTask(id) {
    const confirmDelete = confirm(
    "Are you sure you want to delete this task?"
);

if (!confirmDelete) {
    return;
}

    tasks =
        tasks.filter(
            function (task) {

                return task.id !== id;

            }
        );


    /* SAVE AFTER DELETE */

    saveTasks();


    renderTasks();
    renderTodayTasks();
    renderCalendar();


    showToast(
        "Task removed"
    );

}


/* =====================================
   COMPLETE TASK
===================================== */

function completeTask(id) {

    const task =
        tasks.find(
            function (task) {

                return task.id === id;

            }
        );


    if (task) {

        task.completed =
            !task.completed;

    }


    /* SAVE AFTER COMPLETING */

    saveTasks();


    renderTasks();
    renderTodayTasks();
    renderCalendar();
    renderWeeklyChart();


    if (task && task.completed) {

        showToast(
            "✓ Task completed"
        );

    }

}


/* =====================================
   UPDATE STATISTICS
===================================== */

function updateStats() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            function (task) {

                return task.completed;

            }
        ).length;


    const highPriority =
        tasks.filter(
            function (task) {

                return task.priority === "high"
                    && !task.completed;

            }
        ).length;


    taskCount.textContent =
        total;


    completedText.textContent =
        `${completed} completed`;


    highPriorityCount.textContent =
        highPriority;
        const percent =
    total === 0
        ? 0
        : Math.round((completed / total) * 100);

progressPercent.textContent =
    percent + "%";

progressFill.style.width =
    percent + "%";

progressText.textContent =
    `${completed} of ${total} tasks completed`;

}


/* =====================================
   AI SUGGESTION
===================================== */

function updateAISuggestion() {

    if (tasks.length === 0) {

        aiSuggestion.textContent =
            "Add a task to get an AI suggestion";

        return;

    }


    const activeTasks =
        tasks.filter(
            function (task) {

                return !task.completed;

            }
        );


    if (activeTasks.length === 0) {

        aiSuggestion.textContent =
            "Great work! You've completed everything.";

        return;

    }


    const priorityOrder = {

        high: 1,

        medium: 2,

        low: 3

    };


    activeTasks.sort(
        function (a, b) {

            return priorityOrder[a.priority]
                - priorityOrder[b.priority];

        }
    );


    const nextTask =
        activeTasks[0];


    aiSuggestion.textContent =
        `Start "${nextTask.name}"`;

}


/* =====================================
   ASK AI BUTTON
===================================== */

const GEMINI_API_KEY = "AQ.Ab8RN6I7LqTYY5t7DmSRFWRIE-oa5-3l25vs1g3f8o2rAzDkyQ";

async function askAI() {

    if (tasks.length === 0) {
        showToast("Add some tasks first.");
        return;
    }

    showToast("✦ AI is analyzing...");

    const taskListText = tasks.map(task =>
        `Task: ${task.name}
Priority: ${task.priority}
Date: ${task.date}
Time: ${task.time}
Completed: ${task.completed}`
    ).join("\n\n");

    try {
const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`,
{
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        contents: [{
            parts: [{
                text: `You are a productivity assistant.

Analyze these tasks and tell the user:

1. What should be done first.
2. Any overdue tasks.
3. A short productivity tip.

Tasks:

${taskListText}`
            }]
        }]
    })
});

const data = await response.json();

console.log(data);

if (!response.ok) {
    alert(data.error.message);
    return;
}
        aiSuggestion.textContent =
            data.candidates[0].content.parts[0].text;

        showToast("✓ AI analysis complete");

    } catch (error) {

        console.error(error);
        showToast("Connection failed");

    }

}
/* =====================================
   TOAST MESSAGE
===================================== */

function showToast(message) {

    toast.textContent =
        message;


    toast.classList.add("show");


    setTimeout(
        function () {

            toast.classList.remove("show");

        },
        2500
    );

}


/* =====================================
   CAPITALIZE
===================================== */

function capitalize(text) {

    return text.charAt(0).toUpperCase()
        + text.slice(1);

}


/* =====================================
   FORMAT DATE
===================================== */

function formatTaskDate(date) {

    if (!date) {

        return "No date";

    }


    const dateObject =
        new Date(date + "T00:00:00");


    return dateObject.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric"
        }
    );

}


/* =====================================
   SECURITY
===================================== */

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text;


    return div.innerHTML;

}


/* =====================================
   SET TODAY'S DATE
===================================== */

function setTodayDate() {

    const taskDateInput =
        document.getElementById("taskDate");


    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    taskDateInput.value =
        `${year}-${month}-${day}`;

}


/* =====================================
   DEFAULT DATE
===================================== */

setTodayDate();


/* =====================================
   INITIAL RENDER
===================================== */
function renderTodayTasks() {

    todayTaskList.innerHTML = "";

    const today = new Date();

    const todayDate =
        `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

    const todayTasks =
        tasks.filter(function(task){

            return task.date === todayDate;

        });

    if(todayTasks.length===0){

        todayTaskList.innerHTML =
            "<p>No tasks today.</p>";

        return;

    }

    todayTasks.forEach(function(task){

        const item =
            document.createElement("div");

        item.className = "today-task";

        item.innerHTML = `
            <strong>${escapeHTML(task.name)}</strong><br>
            ${task.time || "No Time"} • ${capitalize(task.priority)}
        `;

        todayTaskList.appendChild(item);

    });

}

let currentDate = new Date();

function renderCalendar() {

    calendarGrid.innerHTML = "";

    const year = currentDate.getFullYear();

    const month = currentDate.getMonth();

    monthYear.textContent =
        currentDate.toLocaleString(
            "default",
            {
                month: "long",
                year: "numeric"
            }
        );

    const firstDay =
        new Date(year, month, 1).getDay();

    const daysInMonth =
        new Date(year, month + 1, 0).getDate();

    for(let i=0;i<firstDay;i++){

        calendarGrid.innerHTML +=
            "<div></div>";

    }

    const today = new Date();

    for(let day=1;day<=daysInMonth;day++){

        const div =
            document.createElement("div");

        div.className="day";

        div.textContent=day;

        const fullDate =
            `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

        if(
            tasks.some(task=>task.date===fullDate)
        ){
            div.classList.add("has-task");
        }

        if(
            today.getDate()===day &&
            today.getMonth()===month &&
            today.getFullYear()===year
        ){
            div.classList.add("today");
        }

div.onclick = function () {

    const dayTasks = tasks.filter(function(task){

        return task.date === fullDate;

    });

    if(dayTasks.length === 0){

        alert("No tasks on " + fullDate);

        return;

    }

    let message = "Tasks on " + fullDate + "\n\n";

    dayTasks.forEach(function(task){

        message +=
            "• " +
            task.name +
            " (" +
            task.time +
            ")\n";

    });

    alert(message);

};

        calendarGrid.appendChild(div);

    }

}

prevMonth.onclick=function(){

    currentDate.setMonth(
        currentDate.getMonth()-1
    );

    renderCalendar();

};

nextMonth.onclick=function(){

    currentDate.setMonth(
        currentDate.getMonth()+1
    );

    renderCalendar();

};
/* =====================================
   NOTIFICATION PERMISSION
===================================== */

if ("Notification" in window) {

    Notification.requestPermission();

}
/* =====================================
   CHECK TASK REMINDERS
===================================== */

function checkTaskReminders() {

    if (Notification.permission !== "granted") {

        return;

    }

    const now = new Date();

    const currentDate =
        `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;

    const currentTime =
        `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;

    tasks.forEach(function(task){

        if(
            !task.completed &&
            task.date === currentDate &&
            task.time === currentTime &&
            !task.notified
        ){

            new Notification(
                "⏰ Task Reminder",
                {
                    body: task.name
                }
            );

            task.notified = true;

        }

    });

    saveTasks();

}

function editTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    editingTaskId = id;

    document.getElementById("taskName").value = task.name;
    document.getElementById("taskDate").value = task.date;
    document.getElementById("taskTime").value = task.time;
    document.getElementById("taskPriority").value = task.priority;
    document.getElementById("taskDuration").value = task.duration;

    taskModal.classList.add("show");
}
if (searchTask) {
    searchTask.addEventListener(
        "input",
        renderTasks
    );
}
if (filterTask) {
    filterTask.addEventListener(
        "change",
        renderTasks
    );
}
if (sortTask) {
    sortTask.addEventListener(
        "change",
        renderTasks
    );
}
checkTaskReminders();

setInterval(

    checkTaskReminders,

    60000

);
/* =====================================
   INITIAL LOAD
===================================== */
let weeklyChart;

function renderWeeklyChart(){

    const days=[
        "Sun","Mon","Tue",
        "Wed","Thu","Fri","Sat"
    ];

    const counts=[
        0,0,0,0,0,0,0
    ];

    tasks.forEach(function(task){

        if(task.completed){

            const day =
                new Date(task.date).getDay();

            counts[day]++;

        }

    });

    const ctx =
        document.getElementById("weeklyChart");

    if(!ctx) return;

    if(weeklyChart){

        weeklyChart.destroy();

    }

    weeklyChart = new Chart(ctx,{

        type:"bar",

        data:{

            labels:days,

            datasets:[{

                data:counts,

                backgroundColor:"#8B7CF6"

            }]

        },

        options:{

            plugins:{
                legend:{
                    display:false
                }
            }

        }

    });

}
setTodayDate();

renderTasks();

renderTodayTasks();

renderCalendar();

renderWeeklyChart();
const scheduleUpload = document.getElementById("scheduleUpload");
const fileName = document.getElementById("fileName");

if (scheduleUpload) {

    scheduleUpload.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) {
            fileName.textContent = "No file selected";
            return;
        }

        fileName.textContent = file.name;

        // Read text files
        if (file.type === "text/plain") {

            const reader = new FileReader();

reader.onload = function (e) {

    const text = e.target.result.trim();

    const newTask = {
        id: Date.now(),
        name: text,
        date: new Date().toISOString().split("T")[0],
        time: "",
        priority: "medium",
        duration: "",
        completed: false,
        notified: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();
    renderTodayTasks();
    renderCalendar();

    showToast("Schedule imported!");

};

            reader.readAsText(file);
        }

    });

}
if (viewAllButton) {

    viewAllButton.addEventListener("click", function () {

        searchTask.value = "";
        filterTask.value = "all";

        renderTasks();

        showToast("Showing all tasks");

    });

}
function clearCompletedTasks() {

    const completed =
        tasks.filter(task => task.completed);

    if (completed.length === 0) {

        showToast("No completed tasks");

        return;

    }

    if (!confirm("Delete all completed tasks?")) {

        return;

    }

    tasks =
        tasks.filter(task => !task.completed);

    saveTasks();

    renderTasks();
    renderTodayTasks();
    renderCalendar();
    renderWeeklyChart();

    showToast("Completed tasks cleared");

}
if (clearCompletedButton) {

    clearCompletedButton.addEventListener(
        "click",
        clearCompletedTasks
    );

}

/* =====================================
   TEST ALARM BUTTON
===================================== */

const alarmButton = document.getElementById("alarmButton");

if (alarmButton) {

    alarmButton.addEventListener("click", function () {

        new Notification("HibiForge", {
            body: "This is a test reminder!"
        });

        showToast("Alarm notification sent");

    });

}
if (aiActionButton) {
    aiActionButton.addEventListener("click", askAI);
}

if (askAIButton) {
    askAIButton.addEventListener("click", askAI);
}