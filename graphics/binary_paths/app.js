'use strict';

const colors = [
  '#FFFFEE', '#F2F2F2', '#F0F0EE', '#E3E8EA', '#CCF1FF', '#E0DAF2', '#D7DCDD',
  '#BBDDCC', '#99E3FF', '#AADDBB', '#B9ADD8', '#8899AA', '#9A79F2', '#557755',
  '#2082A7', '#118833', '#007AA8', '#116688', '#513F7F', '#3D484C', '#005566',
];

/** Flags object contains all app parameters, aside from the colors. */
const flags = {};

// Max number and max iterations for computing the Collatz array.
flags.nMax = 100;
flags.kMax = 160;

// Vertical spacing between each N.
flags.nSpacing = 4;

// Horizontal spacing between vertices of a given line.
flags.kSpacing = 8;

// Vertical change between each pair of successive vertices on a line.
flags.yDelta = 8;

// Set to false for randomly colored lines.
flags.gradient = true;

// Set to false to repeat Collatz for kMax iterations instead of stopping early.
flags.stopCollatzAtOne = true;

/** Initialize the canvas and render the display. */
(() => {
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = flags.kMax * flags.kSpacing;;
canvas.height = flags.nMax * flags.nSpacing;

const collatz = [];
computeCollatz();
render();

function computeCollatz() {
  for (let currentN = 1; currentN < flags.nMax; currentN++) {
    let value = currentN;
    const nCollatz = [value];

    for (let currentK = 1; currentK < flags.kMax; currentK++) {
      value = value % 2 === 0 ? (value / 2) : (3 * value + 1);
      nCollatz.push(value);

      if (flags.stopCollatzAtOne && value === 1) {
        break;
      }
    }

    collatz.push(nCollatz);
  }
}

function render() {
  for (let n = 0; n < collatz.length; n += 2) {
    if (flags.gradient) {
      ctx.strokeStyle = colors[n % colors.length];
    } else {
      ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
    }

    let currentY = (n + 1) * flags.nSpacing;
    ctx.beginPath();
    ctx.moveTo(0, currentY);

    for (let k = 0; k < collatz[n].length - 1; k++) {
      currentY += collatz[n][k] % 2 === 0 ? flags.yDelta : -flags.yDelta;
      ctx.lineTo((k + 1) * flags.kSpacing, currentY);
    }

    ctx.stroke();
  }
}
})();