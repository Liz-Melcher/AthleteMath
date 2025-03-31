console.log('Pyramid.js is loaded')

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('pyramidForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Grab values from form
    const base = parseInt(document.getElementById('baseStep').value, 10);
    const increase = parseInt(document.getElementById('increaseStep').value, 10);
    const topStep = parseInt(document.getElementById('highestStep').value, 10);
    const goalCount = parseInt(document.getElementById('goalCount').value, 10);
    const unit = document.getElementById('unitSelect').value;
    const output = document.getElementById('workoutOutput');

    let steps = [];
    let totalCount = 0;
    let mode = '';

    // Logic: Mode A = topStep is provided; Mode B = goalCount is provided
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
      output.innerHTML = `<div class="alert alert-danger">Please provide either: (base + increase + top step) OR (base + increase + goal count).</div>`;
      return;
    }

    // Build and show output
    output.innerHTML = `
      <h4>Workout Plan (${unit})</h4>
      <p>Mode: <strong>${mode === 'topStep' ? 'Top Step' : 'Goal Count'}</strong></p>
      <p>Total ${unit}: <strong>${totalCount}</strong></p>
      <p>Workout Steps:</p>
      <div class="d-flex flex-wrap gap-2">
        ${steps.map((s, i) => `<span class="badge bg-primary">${s} ${unit}</span>`).join('')}
      </div>
    `;
  });
});

function buildPyramidSteps(base, inc, top) {
  const ascending = [];
  for (let i = base; i <= top; i += inc) {
    ascending.push(i);
  }

  const descending = ascending.slice(0, -1).reverse();
  return [...ascending, ...descending];
}

function calculateTopStepFromGoal(base, inc, goal) {
  const n = Math.floor(Math.sqrt(goal * inc)); // n = sqrt(c * s)
  const top = base + (n - 1) * inc;
  return top;
}
