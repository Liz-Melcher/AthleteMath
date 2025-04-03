console.log('Descending Ladder JS is loaded');

// -------- Helper Functions -------- //

function buildDescendingSteps(top, dec, bottom) {
  const steps = [];
  for (let i = top; i >= bottom; i -= dec) {
    steps.push(i);
  }
  return steps;
}

function buildDescendingForGoal(goal, dec, bottom, restPerStep = 0) {
  let bestMatch = null;
  let bestTotal = Infinity;

  for (let testTop = dec * 100; testTop >= bottom; testTop--) {
    const candidate = [];
    let working = 0;

    for (let i = testTop; i >= bottom; i -= dec) {
      candidate.push(i);
      working += i;
    }

    const restTotal = restPerStep * candidate.length;
    const overall = working + restTotal;

    if (overall === goal) {
      return candidate; // exact match
    }

    if (overall > goal && overall < bestTotal) {
      bestMatch = candidate;
      bestTotal = overall;
    }
  }

  return bestMatch || [];
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

    const top = parseFloat(topStepInput.trim());
    const dec = parseFloat(decrementInput.trim());
    const bottom = bottomStepInput ? parseFloat(bottomStepInput.trim()) : dec;
    const goal = goalInput ? parseFloat(goalInput.trim()) : NaN;
    const restPerStep = parseFloat(restInput) || 0;

    let steps = [];
    let mode = '';
    let wasApproximate = false;

    // ✅ Goal-based path
    if (goalInput && !isNaN(goal) && !isNaN(dec)) {
      steps = buildDescendingForGoal(goal, dec, bottom, restPerStep);
      if (steps.length === 0) {
        output.innerHTML = `<div class="alert alert-danger">No valid descending ladder found.</div>`;
        return;
      }
      const actualTotal = steps.reduce((a, b) => a + b, 0);
      wasApproximate = actualTotal !== goal;
      mode = 'goalCount';

    // ✅ Top-step fallback
    } else if (!isNaN(top) && !isNaN(dec)) {
      steps = buildDescendingSteps(top, dec, bottom);
      mode = 'topStep';

    // ❌ Invalid inputs
    } else {
      output.innerHTML = `<div class="alert alert-danger">Please provide either: (goal + decrement) OR (top step + decrement).</div>`;
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
          <p class="card-text mb-1">Mode: <strong>${mode === 'topStep' ? 'Top Step' : 'Goal Count'}${wasApproximate ? ' (Closest Match)' : ''}</strong></p>
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
