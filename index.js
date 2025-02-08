// Laps Calculator JavaScript

document.addEventListener("DOMContentLoaded", function () {
    const calculateButtons = document.querySelectorAll('[data-action="calculate"]');

    calculateButtons.forEach(button => {
        button.addEventListener("click", function () {
            const workoutType = button.closest("[data-workout]").dataset.workout;
            const data = getFormData(button.closest("[data-workout]"));

            let result;
            if (workoutType === "ladder") {
                result = calculateLadderLaps(data);
            } else if (workoutType === "pyramid") {
                result = calculatePyramidLaps(data);
            }

            displayResults(button.closest("[data-workout]"), result);
        });
    });
});

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

function calculatePyramidLaps({ startLaps, changeLaps, restLaps, peakLaps, goalTotalLaps }) {
    const breakdown = [];
    let start = parseInt(startLaps) || 0;
    let change = parseInt(changeLaps) || 0;
    let rest = parseInt(restLaps) || 0;
    let goal = goalTotalLaps ? parseInt(goalTotalLaps) : null;

    let total = 0;
    let runLaps = start;
    let roundCount = 1;
    let ascending = true;

    // Ascending and descending calculation
    while (goal === null || total < goal) {
        if (runLaps > 0) {
            breakdown.push(`Round ${roundCount}: ${runLaps} run, ${rest} rest`);
            total += runLaps + rest;
            roundCount++;
        }

        // Switch to descending if we've reached peak or exceeded the goal
        if (ascending && (goal && total + runLaps + change > goal)) {
            ascending = false;
            runLaps -= change;  // Start descending immediately
        }

        // Update run laps for next round
        runLaps = ascending ? runLaps + change : runLaps - change;

        // Handle rounding errors or overshooting
        if (runLaps <= 0) break;
    }

    // Handle remaining laps with base rounds if necessary
    while (total < goal) {
        breakdown.push(`Extra Round ${roundCount}: ${start} run, ${rest} rest`);
        total += start + rest;
        roundCount++;
    }

    return { total, breakdown };
}






// function calculatePyramidLaps({ startLaps, changeLaps, restLaps, peakLaps, rounds, goalTotalLaps }) {
//     let start = parseInt(startLaps) || 0;
//     let change = parseInt(changeLaps) || 0;
//     let rest = parseInt(restLaps) || 0;
//     let peak = parseInt(peakLaps) || 0;
//     let total = 0;
//     let roundsNum = parseInt(rounds) || 0;
//     let goal = goalTotalLaps ? parseInt(goalTotalLaps) : null;

//     const breakdown = [];
//     let runLaps = start;
//     let i = 0;

//     // Ascending phase
//     while (runLaps < peak) {
//         breakdown.push(`Round ${i + 1}: ${runLaps} run, ${rest} rest`);
//         total += runLaps + rest;
//         runLaps += change;
//         i++;
//     }

//     // Peak round
//     breakdown.push(`Round ${i + 1}: ${peak} run, ${rest} rest`);
//     total += peak + rest;
//     i++;

//     // Descending phase
//     runLaps = peak - change;
//     while (runLaps >= start) {
//         breakdown.push(`Round ${i + 1}: ${runLaps} run, ${rest} rest`);
//         total += runLaps + rest;
//         runLaps -= change;
//         i++;
//     }

//     // Adjust for goal if provided
//     if (goal !== null && total < goal) {
//         while (total < goal) {
//             breakdown.push(`Extra Round ${i + 1}: ${start} run, ${rest} rest`);
//             total += start + rest;
//             i++;
//         }
//     }

//     return { total, breakdown };
// }

function displayResults(container, { total, breakdown }) {
    const totalEl = container.querySelector('[data-output="totalLaps"]');
    const breakdownEl = container.querySelector('[data-output="roundBreakdown"]');

    if (totalEl && breakdownEl) {
        totalEl.textContent = total;
        breakdownEl.innerHTML = "";
        breakdown.forEach(round => {
            const li = document.createElement("li");
            li.className = "list-group-item";
            li.textContent = round;
            breakdownEl.appendChild(li);
        });
    }
}
