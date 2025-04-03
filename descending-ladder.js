console.log('Descending Ladder JS is loaded');

// -------- Helper Functions -------- //

function buildDescendingSteps(top, dec, bottom) {
  const steps = [];
  for (let i = top; i >= bottom; i -= dec) {
    steps.push(i);
  }
  return steps;
}

function buildDescendingForGoal(goal, dec, bottom) {
  let testTop = dec * 100;
  while (testTop >= bottom) {
    const candidate = [];
    let sum = 0;
    for (let i = testTop; i >= bottom; i -= dec) {
      candidate.push(i);
      sum += i;
    }
    if (sum === goal) return candidate;
    testTop--;
  }
  return [];
}

function calculateTotalRest(restInput, numSteps) {
  const numericRest = parseFloat(restInput);
  if (isNaN(numericRest)) return 0;
  return numericRest * numSteps;
}

// -------- Main Logic -------- //

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('descendingLadderForm');
  const output = document.getElementById('workoutOutput');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const displayUnit = document.getElementById('unitSelect').value || 'units';
    const topStepInput = document.getElementById('topStep').value;
    const decrementInput = document.getElementById('decrementStep').value;
    const bottomStepInput = document.getElementById('bottomStep').value;
    const goalInput = document.getElementById('goalTotal').value;
    const restInput = document.getElementById('restPerRound').value;

    const top = parseFloat(topStepInput);
    const dec = parseFloat(decrementInput);
    const bottom = bottomStepInput ? parseFloat(bottomStepInput) : dec;
    const goal = goalInput ? parseFloat(goalInput) : NaN;
    const restPerStep = parseFloat(restInput) || 0;

    let steps = [];
    let mode = '';

    if (!isNaN(top) && !isNaN(dec)) {
      steps = buildDescendingSteps(top, dec, bottom);
      mode = 'topStep';
    } else if (!isNaN(goal) && !isNaN(dec)) {
      steps = buildDescendingForGoal(goal, dec, bottom);
      if (steps.length === 0) {
        output.innerHTML = `<div class="alert alert-warning">No valid descending ladder found to reach exactly ${goal} ${displayUnit}.</div>`;
        return;
      }
      mode = 'goalCount';
    } else {
      output.innerHTML = `<div class="alert alert-danger">Please provide either: (top step + decrement) OR (goal + decrement).</div>`;
      return;
    }

    const totalCount = Math.round(steps.reduce((a, b) => a + b, 0) * 100) / 100;
    const numRestPeriods = steps.length;
    const totalRest = Math.round(calculateTotalRest(restInput, numRestPeriods) * 100) / 100;
    const totalOverall = Math.round((totalCount + totalRest) * 100) / 100;

    output.innerHTML = `
      <div class="card mx-auto mt-4 shadow" style="max-width: 600px;">
        <div class="card-body text-center" id="workoutCard">
          <h4 class="card-title">Workout Plan (${displayUnit})</h4>
          <p class="card-text mb-1">Mode: <strong>${mode === 'topStep' ? 'Top Step' : 'Goal Count'}</strong></p>
          <p class="card-text mb-1">Working ${displayUnit}: <strong>${totalCount}</strong></p>
          <p class="card-text mb-1">Rest ${displayUnit}: <strong>${totalRest}</strong></p>
          <p class="card-text mb-3">Total ${displayUnit}: <strong>${totalOverall}</strong></p>
          <div class="d-flex flex-wrap justify-content-center gap-2">
            ${steps.map(s => {
              const rounded = Math.round(s * 100) / 100;
              return `<span class="badge bg-success fs-6">${rounded} ${displayUnit}</span>`;
            }).join('')}
          </div>
          <button onclick="window.print()" class="btn btn-outline-secondary mt-4">Print / Export as PDF</button>
        </div>
      </div>
    `;
  });
});
