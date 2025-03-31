console.log('Pyramid.js is loaded');

function buildPyramidSteps(base, inc, top) {
  const ascending = [];
  for (let i = base; i <= top; i += inc) {
    ascending.push(i);
  }
  const descending = ascending.slice(0, -1).reverse();
  return [...ascending, ...descending];
}

function calculateTopStepFromGoal(base, inc, goal) {
  const n = Math.floor(Math.sqrt(goal * inc));
  const top = base + (n - 1) * inc;
  return top;
}

function calculateTotalRest(restPerStep, numSteps) {
  if (!restPerStep) return 0;

  const numericRest = parseFloat(restPerStep);
  if (isNaN(numericRest)) return 0;

  return numericRest * numSteps;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('pyramidForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const base = parseInt(document.getElementById('baseStep').value, 10);
    const increase = parseInt(document.getElementById('increaseStep').value, 10);
    const topStep = parseInt(document.getElementById('highestStep').value, 10);
    const goalCount = parseInt(document.getElementById('goalCount').value, 10);
    const unit = document.getElementById('unitSelect').value;
    const restValue = document.getElementById('restPerStep').value;
    const output = document.getElementById('workoutOutput');

    console.log({ base, increase, topStep, goalCount, unit, restValue });

    let steps = [];
    let totalCount = 0;
    let mode = '';
    const displayUnit = unit || 'units';

    // Determine mode and calculate
    if (!isNaN(base) && !isNaN(increase) && !isNaN(topStep)) {
      steps = buildPyramidSteps(base, increase, topStep);
      totalCount = steps.reduce((a, b) => a + b, 0);
      mode = 'topStep';
    } else if (!isNaN(base) && !isNaN(increase) && !isNaN(goalCount)) {
      const calculatedTop = calculateTopStepFromGoal(base, increase, goalCount);
      steps = buildPyramidSteps(base, increase, calculatedTop);
      totalCount = steps.reduce((a, b) => a + b, 0);
      mode = 'goalCount';
    } else {
      output.innerHTML = '';
      output.innerHTML = `<div class="alert alert-danger">Please provide either: (base + increase + top step) OR (base + increase + goal count).</div>`;
      return;
    }

    // Calculate total rest and total overall
    const numRestPeriods = steps.length;
    const totalRest = calculateTotalRest(restValue, numRestPeriods);
    const totalOverall = totalCount + totalRest;

    // Render output
    output.innerHTML = `
      <div class="card mx-auto mt-4 shadow" style="max-width: 600px;">
        <div class="card-body text-center">
          <h4 class="card-title">Workout Plan (${displayUnit})</h4>
          <p class="card-text mb-1">Mode: <strong>${mode === 'topStep' ? 'Top Step' : 'Goal Count'}</strong></p>
          <p class="card-text mb-1">Working ${displayUnit}: <strong>${totalCount}</strong></p>
          <p class="card-text mb-1">Rest ${displayUnit}: <strong>${totalRest}</strong></p>
          <p class="card-text mb-3">Total ${displayUnit}: <strong>${totalOverall}</strong></p>
          <div class="d-flex flex-wrap justify-content-center gap-2">
            ${steps.map((s) => `<span class="badge bg-primary fs-6">${s} ${displayUnit}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  });
});
