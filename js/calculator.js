async function calculateCarbonFootprint() {
    try {
        const emissionFactors = {
            car: 0.271,
            bus: 0.103,
            flight: 0.255,
            electricity: 0.233,
            naturalGas: 2.204,
            generalWaste: 0.75,
            recycling: -0.25,
        };

        const carKm = parseFloat(document.getElementById('carKm').value) || 0;
        const busKm = parseFloat(document.getElementById('busKm').value) || 0;
        const flightKm = parseFloat(document.getElementById('flightKm').value) || 0;
        const electricity = parseFloat(document.getElementById('electricity').value) || 0;
        const naturalGas = parseFloat(document.getElementById('naturalGas').value) || 0;
        const generalWaste = parseFloat(document.getElementById('generalWaste').value) || 0;
        const recycling = parseFloat(document.getElementById('recycling').value) || 0;

        const transportFootprint = (carKm * emissionFactors.car) + (busKm * emissionFactors.bus) + (flightKm * emissionFactors.flight);
        const energyFootprint = (electricity * emissionFactors.electricity) + (naturalGas * emissionFactors.naturalGas);
        const wasteFootprint = (generalWaste * emissionFactors.generalWaste) + (recycling * emissionFactors.recycling);
        const totalFootprint = transportFootprint + energyFootprint + wasteFootprint;

        const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!currentUser || !currentUser.username) {
            alert("Please log in to save your carbon footprint data.");
            window.location.href = "login.html";
            return;
        }

        const userData = {
            name: currentUser.fullname || "Anonymous User",
            email: currentUser.email || "N/A",
            carbonFootprint: {
                transport: transportFootprint.toFixed(2),
                energy: energyFootprint.toFixed(2),
                waste: wasteFootprint.toFixed(2),
                total: totalFootprint.toFixed(2),
            },
        };

        console.log("Data being sent to the server:", userData);
        localStorage.setItem('userData', JSON.stringify(userData));

        // API_BASE_URL comes globally from config.js!
        const response = await fetch(`${API_BASE_URL}/data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            const result = await response.json();
            localStorage.setItem('carbonFootprintData', JSON.stringify(userData.carbonFootprint));
            alert("Data saved successfully!");
            window.location.href = 'result.html';
        } else {
            const errorData = await response.json();
            alert(`Failed to save data: ${errorData.message || "Unknown error."}`);
        }
    } catch (error) {
        console.error("Network error:", error);
        alert("Unable to connect to the server.");
    }
}