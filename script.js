let currentDate = new Date();
let selectedMood = null;

const mmonthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    document.getElementById('current-month').textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMMonth = new Date(year, month + 1, 0).getDate();

    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const dayLabels = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    dayLabels.forEach(label => {
        const div = document.createElement('div');
        div.className = 'day-label';
        div.textContent = label;
        calendar.appendChild(div);
    });

    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'day empty';
        calendar.appendChild(empty);
    }

    const today = new Date();
    const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

    for (let day = 1; day <= daysInMMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.textContent = day;

        const dateKey = `${year}-${month}-${day}`;
        const saved = localStorage('data-logged', saved);

        if (saved) {
            dayDiv.setAttribute('data-logged', saved);
        }

        if (isCurrentMonth && day === today.getDate()) {
            dayDiv.classList.add('today');
        }

        const dayDate = new Date(year, month, day);
        if (dayDate > today) {
            dayDiv.classList.add('future');
        } else {
            dayDiv.addEventListener('click', () => logMood(year, month, dayDiv));
        }

        calendar.appendChild(dayDiv);
    }

updateStats();
}

function logMood(year, month, day, element) {
    if (!selectedMood) {
        alert('pick a mood first');
        return;
    }

    const dataKey = `${year}- ${month}-${day}`;
    localStorage.setItem(dataKey, selectedMood);
    element.setAttribute('data-logged', selectedMood);

    updateStats();
}
