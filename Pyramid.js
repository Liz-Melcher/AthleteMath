console.log('Pyramid.js is loaded');

// -------- Helper Functions -------- //

function buildPyramidSteps(base, inc, top) {
  const ascending = [];
  for (let i = base; i <= top; i += inc) {
    ascending.push(i);
  }
  const descending = ascending.slice(0, -1).reverse();
  return [...ascending, ...descending];
}

// ✅ Build pyramid for Goal Count mode (includes rest in total)
function buildPyramidForGoalCount(base, inc, goal, restPerStep = 0) {
  const steps = [];
  let current = base;

  while (true) {
    const trialSteps = [...steps, current];
    const mirrored = [...trialSteps, ...trialSteps.slice(0, -1).reverse()];
    const working = mirrored.reduce((a, b) => a + b, 0);
    const totalRest = restPerStep * mirrored.length;
    const total = working + totalRest;

    if (total >= goal) return mirrored;

    steps.push(current);
    current += inc;
  }
}

function calculateTotalRest(restInput, numSteps) {
  const numericRest = parseFloat(restInput);
  if (isNaN(numericRest)) return 0;
  return numericRest * numSteps;
}

// -------- Main Logic -------- //

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('pyramidForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const displayUnit = document.getElementById('unitSelect').value || 'units';
    const base = parseFloat(document.getElementById('baseStep').value);
    const increase = parseFloat(document.getElementById('increaseStep').value);
    const topStep = parseFloat(document.getElementById('highestStep').value);
    const goalCount = parseFloat(document.getElementById('goalCount').value);
    const restInput = document.getElementById('restPerStep').value;
    const output = document.getElementById('workoutOutput');

    console.log({ base, increase, topStep, goalCount, restInput });

    let steps = [];
    let mode = '';
    const restPerStep = parseFloat(restInput) || 0;

    if (!isNaN(base) && !isNaN(increase) && !isNaN(topStep)) {
      steps = buildPyramidSteps(base, increase, topStep);
      mode = 'topStep';
    } else if (!isNaN(base) && !isNaN(increase) && !isNaN(goalCount)) {
      steps = buildPyramidForGoalCount(base, increase, goalCount, restPerStep);
      mode = 'goalCount';
    } else {
      output.innerHTML = '';
      output.innerHTML = '<div class="alert alert-danger">Please provide either: (base + increase + top step) OR (base + increase + goal count).</div>';
      return;
    }

    const totalCount = steps.reduce((a, b) => a + b, 0);
    const numRestPeriods = steps.length;
    const totalRest = calculateTotalRest(restInput, numRestPeriods);
    const totalOverall = totalCount + totalRest;

    output.innerHTML = `
      <div class="card mx-auto mt-4 shadow" style="max-width: 600px;">
        <div class="card-body text-center">
          <h4 class="card-title">Workout Plan (${displayUnit})</h4>
          <p class="card-text mb-1">Mode: <strong>${mode === 'topStep' ? 'Top Step' : 'Goal Count'}</strong></p>
          <p class="card-text mb-1">Working ${displayUnit}: <strong>${totalCount}</strong></p>
          <p class="card-text mb-1">Rest ${displayUnit}: <strong>${totalRest}</strong></p>
          <p class="card-text mb-3">Total ${displayUnit}: <strong>${totalOverall}</strong></p>
          <div class="d-flex flex-wrap justify-content-center gap-2">
            ${steps.map(s => `<span class="badge bg-primary fs-6">${s} ${displayUnit}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  });
});
