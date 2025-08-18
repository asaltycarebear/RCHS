document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.querySelector(`#menu`); /*# target id's*/
    const navMenu = document.querySelector(`#nav-menu`);

    menuButton.addEventListener("click", () => { /*=> is used in place of function ()*/
        navMenu.classList.toggle(`open`);

        /*Toggle*/ 
        if (navMenu.classList.contains(`open`)) {
            menuButton.textContent = `✖`;
        } 
        else {
            menuButton.textContent = `☰`;
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    // === Save form submissions ===
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
                date: new Date().toLocaleString()
            });

            localStorage.setItem("cleaningChecklist", JSON.stringify(submissions));

            alert("Checklist submitted! Open record.html to view.");
            form.reset();
        });
    }

    // === Populate record.html table ===
    const recordsTable = document.querySelector("#recordsTable tbody");
    if (recordsTable) {
        const submissions = JSON.parse(localStorage.getItem("cleaningChecklist")) || [];

        submissions.forEach(entry => {
            const row = document.createElement("tr");

            const dateCell = document.createElement("td");
            dateCell.textContent = entry.date || "";
            row.appendChild(dateCell);

            entry.checks.forEach(isChecked => {
                const td = document.createElement("td");
                const cb = document.createElement("input");
                cb.type = "checkbox";
                cb.checked = isChecked;
                cb.disabled = true;
                td.appendChild(cb);
                row.appendChild(td);
            });

            const notesCell = document.createElement("td");
            notesCell.textContent = entry.notes || "";
            row.appendChild(notesCell);

            recordsTable.appendChild(row);
        });
    }

    // === Export CSV + Email button ===
    const exportBtn = document.querySelector("#exportCSV");
    if (exportBtn) {
        exportBtn.addEventListener("click", function () {
            const table = document.querySelector("#recordsTable");
            let csv = [];

            // Extract table rows
            const rows = table.querySelectorAll("tr");
            rows.forEach(row => {
                let cols = row.querySelectorAll("th, td");
                let rowData = [];
                cols.forEach(cell => {
                    if (cell.querySelector("input[type=checkbox]")) {
                        rowData.push(cell.querySelector("input").checked ? "✔" : "✘");
                    } else {
                        rowData.push(cell.innerText.replace(/,/g, "")); // avoid breaking CSV
                    }
                });
                csv.push(rowData.join(","));
            });

            // Create CSV blob
            const csvContent = "data:text/csv;charset=utf-8," + csv.join("\n");
            const encodedUri = encodeURI(csvContent);

            // Trigger download
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "cleaning_record.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Open email client
            window.location.href = "mailto:cstockwell@dcsdk12.org?subject=Cleaning%20Record&body=Attached%20is%20the%20CSV%20record.%20Please%20attach%20the%20downloaded%20file.";
        });
    }
});
