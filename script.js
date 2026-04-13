let currentDate = new Date();
let selectedMood = null;

const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    document.getElementById('current-month').textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

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

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.textContent = day;

        const dateKey = `${year}-${month}-${day}`;
        const saved = localStorage.getItem(dateKey);

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
            dayDiv.addEventListener('click', () => logMood(year, month, day, dayDiv));
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

    const dateKey = `${year}-${month}-${day}`;
    localStorage.setItem(dateKey, selectedMood);
    element.setAttribute('data-logged', selectedMood);

    showNote(dateKey);
    updateStats();
}

function updateStats() {
    let logged = 0;
    let streak = 0;

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.includes('-')) logged++;
    }

    const today = new Date();
    let checkDate = new Date(today);

    while (true) {
        const key = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
        if (localStorage.getItem(key)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }

    document.getElementById('logged-count').textContent = logged;
    document.getElementById('streak').textContent = streak;
}

document.querySelectorAll('.mood-option').forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('.mood-option').forEach(o => o.classList.remove('selected'));
        this.classList.add('selected');
        selectedMood = this.getAttribute('data-mood');
    });
});

document.getElementById('prev-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

let currentNoteDate = null;

document.getElementById('save-note').addEventListener('click', () => {
    if (!currentNoteDate) {
        alert('click a day first to add a note');
        return;
    }

    const noteText = document.getElementById('note-input').value;
    if (noteText.trim()) {
        localStorage.setItem(`note-${currentNoteDate}`, noteText);
        document.getElementById('note-display').innerHTML = `<p><strong>Note saved for ${currentNoteDate}</strong></p><p>${noteText}</p`;
        document.getElementById('note-input').value = '';
     }
});

function showNote(dateKey) {
    currentNoteDate = dateKey;
    const savedNote = localStorage.getItem(`note-${dateKey}`);

    if (SavedNote) {
        document.getElementById('note-display').innerHTML = `<p><strong>Note for ${dateKey}:</strong></p><p>${savedNote}</p>`;
        document.getElementById('note-input').value = savedNote;
    } else {
        document.getElementById('note-display').innerHTML = '<p>No note for this day yet</p>';
        document.getElementById('note-input').value = '';
    }
}

renderCalendar();


