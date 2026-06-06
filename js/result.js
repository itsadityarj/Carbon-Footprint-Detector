document.addEventListener("DOMContentLoaded", async () => {
    try {
        // 1. Fetch from the dynamic cloud URL instead of localhost
        const response = await fetch(`${API_BASE_URL}/data`);
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        const database = await response.json();

        // 2. Identify who is logged in dynamically using LocalStorage
        const sessionUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!sessionUser || !sessionUser.fullname) {
            alert("Please log in to view your personalized results.");
            window.location.href = "login.html";
            return;
        }

        // Find the matching document in the database matching the user's name
        const currentUserData = database.users.find(user => user.name === sessionUser.fullname);

        if (!currentUserData) {
            alert("No saved database record found for your account. Complete a calculation first!");
            window.location.href = "calculator.html";
            return;
        }

        // 3. Match your new Mongoose backend property naming schema ('footprintData')
        const userFootprint = {
            transport: parseFloat(currentUserData.footprintData?.transport) || 0,
            energy: parseFloat(currentUserData.footprintData?.energy) || 0,
            waste: parseFloat(currentUserData.footprintData?.waste) || 0,
        };

        const indiaStandard = {
            transport: 800,
            energy: 1700,
            waste: 100
        };

        // Filter out the active user to calculate the true average of other ecosystem users
        const otherUsers = database.users.filter(user => user.name !== sessionUser.fullname);

        let averageFootprint = { transport: 0, energy: 0, waste: 0 };

        // Handle case elegantly if they are the very first user in the database
        if (otherUsers.length > 0) {
            let totalTransport = 0, totalEnergy = 0, totalWaste = 0;

            otherUsers.forEach(user => {
                // Safely grab nested tracking data using optional chaining (?.)
                totalTransport += parseFloat(user.footprintData?.transport) || 0;
                totalEnergy += parseFloat(user.footprintData?.energy) || 0;
                totalWaste += parseFloat(user.footprintData?.waste) || 0;
            });

            averageFootprint = {
                transport: totalTransport / otherUsers.length,
                energy: totalEnergy / otherUsers.length,
                waste: totalWaste / otherUsers.length,
            };
        } else {
            // Default comparison fallback to global standards if database lacks other users
            averageFootprint = { transport: 750, energy: 1600, waste: 90 };
        }

        const labels = ["Average of Others", "You", "India Standard"];
        const transportData = [averageFootprint.transport, userFootprint.transport, indiaStandard.transport];
        const energyData = [averageFootprint.energy, userFootprint.energy, indiaStandard.energy];
        const wasteData = [averageFootprint.waste, userFootprint.waste, indiaStandard.waste];

        // Render Chart
        const ctx = document.getElementById('comparisonChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Transport (kg CO₂)',
                        data: transportData,
                        backgroundColor: '#4caf50',
                    },
                    {
                        label: 'Energy (kg CO₂)',
                        data: energyData,
                        backgroundColor: '#2196f3',
                    },
                    {
                        label: 'Waste (kg CO₂)',
                        data: wasteData,
                        backgroundColor: '#ff5722',
                    }
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: 'white' }
                    },
                    tooltip: {
                        callbacks: {
                            label: context => `${context.dataset.label}: ${context.raw.toFixed(2)} kg CO₂`,
                        }
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Categories', color: 'white' },
                        ticks: { color: 'white' }
                    },
                    y: {
                        title: { display: true, text: 'Carbon Footprint (kg CO₂)', color: 'white' },
                        ticks: { color: 'white' }
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error loading chart data:", error);
        alert("Unable to compile chart data metrics. Check development console.");
    }
});