// Laps Calculator JavaScript

console.log("Laps js is loaded")

// Function to populate test data into the form fields
function populateTestData(testData) {
    document.querySelectorAll("[data-workout]").forEach(workout => {
        const type = workout.dataset.workout;
        if (testData[type]) {
            Object.entries(testData[type]).forEach(([key, value]) => {
                const input = workout.querySelector(`[data-input="${key}"]`);
                if (input && value !== null) {
                    input.value = value;
                }
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    // Populate fields with test values from testData.js
    if (typeof testData !== "undefined") {
        populateTestData(testData);
    }

    const calculateButtons = document.querySelectorAll('[data-action="calculate"]');

    calculateButtons.forEach(button => {
        button.addEventListener("click", function () {
            const workoutType = button.closest("[data-workout]").dataset.workout;
            const data = getFormData(button.closest("[data-workout]"));

            let result;
            if (workoutType === "ladder") {
                result = calculateLadderLaps(data);
            } else if (workoutType === "ss") {
                result = calculateStraightSets(data);
            }

            displayResults(button.closest("[data-workout]"), result);
        });
    });
});



// document.addEventListener("DOMContentLoaded", function () {
//     const calculateButtons = document.querySelectorAll('[data-action="calculate"]');

//     calculateButtons.forEach(button => {
//         button.addEventListener("click", function () {
//             const workoutType = button.closest("[data-workout]").dataset.workout;
//             const data = getFormData(button.closest("[data-workout]"));

//             let result;
//             if (workoutType === "ladder") {
//                 result = calculateLadderLaps(data);
//             } else if (workoutType === "ss") {
//                 result = calculateStraightSets(data);
//             }

//             displayResults(button.closest("[data-workout]"), result);
//         });
//     });
// });

function getFormData(container) {
    const inputs = container.querySelectorAll("[data-input]");
    const data = {};
    inputs.forEach(input => {
        data[input.dataset.input] = input.value;
    });
    return data;
}

function calculateLadderLaps({ startLaps, changeLaps, restLaps, rounds, endingLaps, goalTotalLaps }) {
    let start = parseInt(startLaps) || 0;
    let change = parseInt(changeLaps) || 0;
    let rest = parseInt(restLaps) || 0;
    let total = 0;
    let roundsNum = parseInt(rounds) || 0;
    let ending = endingLaps ? parseInt(endingLaps) : null;
    let goal = goalTotalLaps ? parseInt(goalTotalLaps) : null;

    const breakdown = [];
    let runLaps = start;
    let i = 0;

    if (roundsNum) {
        for (i = 0; i < roundsNum; i++) {
            runLaps = start + (change * i);
            breakdown.push(`Round ${i + 1}: ${runLaps} run, ${rest} rest`);
            total += runLaps + rest;
        }
    } else if (ending !== null) {
        while ((change > 0 && runLaps <= ending) || (change < 0 && runLaps >= ending)) {
            breakdown.push(`Round ${i + 1}: ${runLaps} run, ${rest} rest`);
            total += runLaps + rest;
            if (runLaps === ending) break;
            runLaps += change;
            i++;
        }
    } else if (goal !== null) {
        while (total < goal) {
            breakdown.push(`Round ${i + 1}: ${runLaps} run, ${rest} rest`);
            total += runLaps + rest;
            if (total >= goal) break;
            runLaps += change;
            i++;
        }
    }

    return { total, breakdown };
}

function calculateStraightSets({ startLaps, restLaps, rounds, goalTotalLaps })  {
    let laps = parseInt(startLaps) || 0;
    let rest = parseInt(restLaps) || 0;
    let total = 0;
    let roundsNum = parseInt(rounds) || 0;
    let goal = goalTotalLaps ? parseInt(goalTotalLaps) : null;

    const breakdown = [];
    let i = 0;

    if (roundsNum) {
        for (i = 0; i < roundsNum; i++) {
            breakdown.push(`Round ${i + 1}: ${laps} run, ${rest} rest`);
            total += laps + rest;
        }
    } else if (goal !== null) {
        while (total < goal) {
            breakdown.push(`Round ${i + 1}: ${laps} run, ${rest} rest`);
            total += laps + rest;
            if (total >= goal) break;
            i++;
        }
    }

    return { total, breakdown };
}

function displayResults(container, { total, breakdown }) {
    const totalEl = container.querySelector('[data-output="totalLaps"]');
    const breakdownEl = container.querySelector('[data-output="roundBreakdown"]');
    const headerEl = container.querySelector('[data-output="workoutHeader"]');

    if (totalEl && breakdownEl) {
        if (headerEl) {
            headerEl.textContent = "Workout Results";
        }

        totalEl.textContent = `Total Laps: ${total}`;

        breakdownEl.innerHTML = "";
        breakdown.forEach((round) => {
            const li = document.createElement("li");
            li.className = "list-group-item";
            li.textContent = round;
            breakdownEl.appendChild(li);
        });
    }
}
