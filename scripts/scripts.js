// Handle form submission on index.html
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const checkboxes = form.querySelectorAll("input[type=checkbox]");
            const notes = form.querySelector("textarea")?.value || "";

            let results = [];
            checkboxes.forEach(cb => results.push(cb.checked));

            // Store all submissions (array of rows)
            let submissions = JSON.parse(localStorage.getItem("cleaningChecklist")) || [];
            submissions.push({
                checks: results,
                notes: notes,
                date: new Date().toLocaleString()
            });

            localStorage.setItem("cleaningChecklist", JSON.stringify(submissions));

            alert("Checklist submitted! Open record.html to view.");
            form.reset();
        });
    }

    // Handle table population on record.html
    const recordsTable = document.querySelector("#recordsTable tbody");
    if (recordsTable) {
        const submissions = JSON.parse(localStorage.getItem("cleaningChecklist")) || [];

        submissions.forEach(entry => {
            const row = document.createElement("tr");

            // Add date cell first
            const dateCell = document.createElement("td");
            dateCell.textContent = entry.date || "";
            row.appendChild(dateCell);

            // Add checkbox columns
            entry.checks.forEach(isChecked => {
                const td = document.createElement("td");
                const cb = document.createElement("input");
                cb.type = "checkbox";
                cb.checked = isChecked;
                cb.disabled = true; // make read-only
                td.appendChild(cb);
                row.appendChild(td);
            });

            // Add notes column last
            const notesCell = document.createElement("td");
            notesCell.textContent = entry.notes || "";
            row.appendChild(notesCell);

            recordsTable.appendChild(row);
        });
    }
});
