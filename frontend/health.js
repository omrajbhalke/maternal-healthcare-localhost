document.addEventListener("DOMContentLoaded", function () {
    const stats = {
        "Low Risk / Healthy": {
            Age: [12.00, 70.00, 26.61],
            SystolicBP: [70.00, 130.00, 107.99],
            DiastolicBP: [49.00, 100.00, 73.16],
            BS: [6.00, 11.00, 7.12],
            BodyTemp: [98.00, 103.00, 98.46],
            HeartRate: [60.00, 88.00, 72.98]
        },
        "High Risk / Risky": {
            Age: [12.00, 65.00, 35.33],
            SystolicBP: [83.00, 160.00, 121.88],
            DiastolicBP: [60.00, 100.00, 81.97],
            BS: [6.00, 19.00, 11.40],
            BodyTemp: [98.00, 103.00, 99.00],
            HeartRate: [60.00, 90.00, 76.88]
        }
    };

    const params = ["Age", "SystolicBP", "DiastolicBP", "BS", "BodyTemp", "HeartRate"];
    const statTypes = ["Min", "Max", "Avg"];
    const statsContainer = document.getElementById("statsTableContainer");

    for (const risk in stats) {
        const heading = document.createElement("h3");
        heading.textContent = `${risk} Summary`;
        statsContainer.appendChild(heading);

        const table = document.createElement("table");
        table.classList.add("stats-table");

        const thead = document.createElement("thead");
        thead.innerHTML = `
            <tr>
                <th>Statistic</th>
                ${params.map(p => `<th>${p}</th>`).join("")}
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        statTypes.forEach((type, i) => {
            const row = document.createElement("tr");
            const typeCell = document.createElement("td");
            typeCell.textContent = type;
            row.appendChild(typeCell);

            params.forEach(param => {
                const cell = document.createElement("td");
                cell.textContent = stats[risk][param][i].toFixed(2);
                row.appendChild(cell);
            });

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        statsContainer.appendChild(table);
    }

    // ---------- 2. Grouped Bar Chart ----------
    const ctx = document.getElementById("groupedBarChart").getContext("2d");

    const chartData = {
        labels: params,
        datasets: [
            {
                label: "Low Risk",
                backgroundColor: "#2ecc71",
                data: params.map(param => stats["Low Risk / Healthy"][param][2])
            },
            {
                label: "High Risk",
                backgroundColor: "#e74c3c",
                data: params.map(param => stats["High Risk / Risky"][param][2])
            }
        ]
    };

    new Chart(ctx, {
        type: "bar",
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            },
            scales: {
                x: { stacked: false },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Average Value"
                    }
                }
            }
        }
    });
    
});
