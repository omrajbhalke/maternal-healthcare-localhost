document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:5000/patients")
        .then(res => res.json())
        .then(data => {
            console.log("Data from backend:", data);  // Debug log

            // Update total patients text
            const totalPatientsElem = document.getElementById("totalPatients");
            if (totalPatientsElem && typeof data.total === "number") {
                totalPatientsElem.innerText = "Total Patients: " + data.total;
            } else {
                console.error("Missing totalPatients element or invalid total");
            }

            // Get canvas context for Chart.js
            const ctx = document.getElementById("predictionChart").getContext("2d");

            //debugging 
            const chartData = [
                data.riskCounts["Healthy"] || 0,
                data.riskCounts["Risky"] || 0,
            ];

            console.log("Chart data:", chartData);

            // Create the pie chart
            new Chart(ctx, {
                type: "pie",  // <-- change this from "bar" to "pie"
                data: {
                    labels: ["Healthy", "Risky"],
                    datasets: [{
                        label: "Number of Patients",
                        data: [
                            data.riskCounts["Healthy"] || 0,
                            data.riskCounts["Risky"] || 0,
                        ],
                        backgroundColor: ["#2ecc71", "#e74c3c"],
                        borderColor: "#ffffff",
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        tooltip: {
                            enabled: true
                        }
                    }
                }
            });


            // === Sort patients by latest ===
            const patients = (data.patients || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            // === Render Table ===
            const tableBody = document.querySelector("#patientTable tbody");
            tableBody.innerHTML = "";

            patients.forEach(p => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${p.name}</td>
                    <td>${p.age}</td>
                    <td>${p.diastolic}</td>
                    <td>${p.bs}</td>
                    <td>${p.temp}</td>
                    <td>${p.pulse}</td>
                    <td>${p.risk}</td>
                `;
                tableBody.appendChild(row);
            });

            // === Search Functionality ===
            document.getElementById("searchBox").addEventListener("input", function () {
                const query = this.value.toLowerCase();
                const rows = tableBody.querySelectorAll("tr");
                rows.forEach(row => {
                    const text = row.innerText.toLowerCase();
                    row.style.display = text.includes(query) ? "" : "none";
                });
            });

        })
        .catch(err => {
            console.error("Error loading patient data or drawing chart:", err);
            document.getElementById("totalPatients").innerText = "Failed to load patient data";
        });
});

function exportToCSV() {
    const rows = [...document.querySelectorAll("#patientTable tr")];
    const csv = rows.map(row => {
        const cols = [...row.querySelectorAll("td, th")];
        return cols.map(col => `"${col.innerText}"`).join(",");
    }).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "patients.csv";
    a.click();
}