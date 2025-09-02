document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.querySelector("#menu");
    const navMenu = document.querySelector("#nav-menu");

    if (menuButton) {
        menuButton.addEventListener("click", () => {
            navMenu.classList.toggle("open");
            menuButton.textContent = navMenu.classList.contains("open") ? "✖" : "☰";
        });
    }

    // === START/STOP TIMERS ===
    const startButtons = document.querySelectorAll(".startBtn");
    const stopButtons = document.querySelectorAll(".stopBtn");

    let taskTimers = JSON.parse(localStorage.getItem("taskTimes")) || {};

    startButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const task = btn.dataset.task;
            taskTimers[task] = { start: new Date().toLocaleString(), end: null };
            localStorage.setItem("taskTimes", JSON.stringify(taskTimers));
            alert(`${task} started at ${taskTimers[task].start}`);
        });
    });

    stopButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const task = btn.dataset.task;
            if (taskTimers[task] && taskTimers[task].start) {
                taskTimers[task].end = new Date().toLocaleString();
                localStorage.setItem("taskTimes", JSON.stringify(taskTimers));
                alert(`${task} stopped at ${taskTimers[task].end}`);
            } else {
                alert(`Start ${task} before stopping.`);
            }
        });
    });

    // === FORM SUBMIT (checklist completion) ===
    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const checkboxes = form.querySelectorAll("input[type=checkbox]");
            const notes = form.querySelector("textarea")?.value || "";

            let results = [];
            checkboxes.forEach(cb => results.push(cb.checked));

            let submissions = JSON.parse(localStorage.getItem("cleaningChecklist")) || [];
            submissions.push({
                checks: results,
                notes: notes,
                date: new Date().toLocaleString(),
                times: taskTimers // save start/stop times
            });

            localStorage.setItem("cleaningChecklist", JSON.stringify(submissions));

            alert("Checklist submitted! Open record.html to view.");
            form.reset();
        });
    }

    // === Populate record.html ===
    const recordsTable = document.querySelector("#recordsTable tbody");
    if (recordsTable) {
        const submissions = JSON.parse(localStorage.getItem("cleaningChecklist")) || [];

        submissions.forEach(entry => {
            const row = document.createElement("tr");

            // Date
            const dateCell = document.createElement("td");
            dateCell.textContent = entry.date || "";
            row.appendChild(dateCell);

            // Checkboxes
            entry.checks.forEach(isChecked => {
                const td = document.createElement("td");
                const cb = document.createElement("input");
                cb.type = "checkbox";
                cb.checked = isChecked;
                cb.disabled = true;
                td.appendChild(cb);
                row.appendChild(td);
            });

            // Notes
            const notesCell = document.createElement("td");
            notesCell.textContent = entry.notes || "";
            row.appendChild(notesCell);

            recordsTable.appendChild(row);

            // Add a second row for task times
            if (entry.times) {
                const timeRow = document.createElement("tr");
                const td = document.createElement("td");
                td.colSpan = 22; // span full table
                td.innerHTML = Object.entries(entry.times).map(([task, {start, end}]) => {
                    return `<strong>${task}:</strong> Start: ${start || "-"}, End: ${end || "-"}`;
                }).join("<br>");
                timeRow.appendChild(td);
                recordsTable.appendChild(timeRow);
            }
        });
    }
});
