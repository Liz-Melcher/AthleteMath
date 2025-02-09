// Ensure Luxon is available
console.log("Time JS is loaded")// Ensure Luxon is available
const { DateTime, Duration } = luxon;

document.addEventListener("DOMContentLoaded", function () {
    const calculateTimeButtons = document.querySelectorAll('[data-action="calculate-time"]');

    calculateTimeButtons.forEach(button => {
        button.addEventListener("click", function () {
            const workoutType = button.closest("[data-workout]").dataset.workout;
            const data = getTimeFormData(button.closest("[data-workout]"));

            let result;
            if (workoutType === "ladder-time") {
                result = calculateLadderTime(data);
            } else if (workoutType === "ss-time") {
                result = calculateStraightSetsTime(data);
            }

            displayTimeResults(button.closest("[data-workout]"), result);
        });
    });
});

// Function to get form data for time calculations
function getTimeFormData(container) {
    const inputs = container.querySelectorAll("[data-input]");
    const data = {};
    inputs.forEach(input => {
        data[input.dataset.input] = parseFloat(input.value) || 0; // Use parseFloat to keep decimal values
    });
    return data;
}

// 🔄 Convert minutes to milliseconds
function minutesToMillis(minutes) {
    return minutes * 60 * 1000; // 1 minute = 60,000 ms
}

// 🕒 Fixed Function to Calculate Ladder Time Workouts
function calculateLadderTime({ startTime, changeTime, restTime, roundsTime }) {
    let totalTime = Duration.fromMillis(0);
    let runTime = Duration.fromMillis(minutesToMillis(startTime));
    let change = Duration.fromMillis(minutesToMillis(changeTime));
    let rest = Duration.fromMillis(minutesToMillis(restTime));

    const breakdown = [];
    let i = 0;

    for (i = 0; i < roundsTime; i++) {
        breakdown.push(`Round ${i + 1}: ${runTime.toFormat("m:ss")} work, ${rest.toFormat("m:ss")} rest`);
        totalTime = totalTime.plus(runTime).plus(rest);
        runTime = runTime.plus(change); // Increase work time per round
    }

    return { total: totalTime.toFormat("m:ss"), breakdown };
}

// ⏳ Fixed Function to Calculate Straight Sets Time Workouts
function calculateStraightSetsTime({ startTime, restTime, roundsTime }) {
    let work = Duration.fromMillis(minutesToMillis(startTime));
    let rest = Duration.fromMillis(minutesToMillis(restTime));
    let totalTime = Duration.fromMillis(0);

    const breakdown = [];
    let i = 0;

    for (i = 0; i < roundsTime; i++) {
        breakdown.push(`Round ${i + 1}: ${work.toFormat("m:ss")} work, ${rest.toFormat("m:ss")} rest`);
        totalTime = totalTime.plus(work).plus(rest);
    }

    return { total: totalTime.toFormat("m:ss"), breakdown };
}

// Function to display time results
function displayTimeResults(container, { total, breakdown }) {
    const totalEl = container.querySelector('[data-output="totalTime"]');
    const breakdownEl = container.querySelector('[data-output="roundBreakdownTime"]');

    if (totalEl && breakdownEl) {
        totalEl.textContent = `Total Time: ${total}`;

        breakdownEl.innerHTML = "";
        breakdown.forEach((round) => {
            const li = document.createElement("li");
            li.className = "list-group-item";
            li.textContent = round;
            breakdownEl.appendChild(li);
        });
    }
}
