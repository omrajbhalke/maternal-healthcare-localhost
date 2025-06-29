const isValidNumber = (val, min, max) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= min && num <= max;
};

function predict() {
    const predictButton = document.getElementById("predictButton");

    // ✅ Disable button immediately
    predictButton.disabled = true;
    predictButton.innerText = "Predicting...";

    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const diastolic = document.getElementById("diastolic").value;
    const bs = document.getElementById("bs").value;
    const temp = document.getElementById("temp").value;
    const pulse = document.getElementById("pulse").value;

    if (!name || !age || !diastolic || !bs || !temp || !pulse) {
        alert("Please fill all fields");
        return;
    }

    if (
        !isValidNumber(age, 15, 80) ||
        !isValidNumber(diastolic, 40, 115) ||
        !isValidNumber(bs, 3.3, 11.1) ||
        !isValidNumber(temp, 95, 105) ||
        !isValidNumber(pulse, 40, 180)
    ) {
        document.getElementById('result').innerText = "⚠️ Please enter valid values in all fields.";
        return;
    }

    const data = {
        name: name,
        age: parseFloat(age),
        diastolic: parseFloat(diastolic),
        bs: parseFloat(bs),
        temp: parseFloat(temp),
        pulse: parseFloat(pulse)
    };

    fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(result => {
            document.getElementById("result").innerText = "Predicted Risk: " + result.risk;

            // ✅ Clear form fields
            document.getElementById("name").value = "";
            document.getElementById("age").value = "";
            document.getElementById("diastolic").value = "";
            document.getElementById("bs").value = "";
            document.getElementById("temp").value = "";
            document.getElementById("pulse").value = "";

            // ✅ Re-enable button
            predictButton.disabled = false;
            predictButton.innerText = "Predict";
        })
        .catch(err => {
            console.error(err);
            alert("Prediction failed. Check backend console.");
            predictButton.disabled = false;
            predictButton.innerText = "Predict";
        });
}
