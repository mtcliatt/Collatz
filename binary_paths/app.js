'use strict';

/* red, blue, green, yellow */
const colors = ['#F44336', '#2196F3', '#4CAF50', '#FFEB3B'];

const flags = {};

/* Display */
// Set to true to see each line added one by one
flags.animate = true;

// ms between each line being drawn
flags.animationTime = 200;

// Set to true to view a tree structure of the graphic
flags.drawTree = false;


/* Collatz */
// Inclusive range of values for N.
flags.nStart = 1;
flags.nStop = 800;

// Max iterations to spend calculating the path of for any initial value of N.
flags.maxIterations = 800;

// Stop computing the path when N=1, or continue for maxIterations.
flags.stopCollatzAtOne = true;

// Set to true to only compute the path of odd values of N.
flags.skipEvenNumbers = true;


/* Spacing */
// Vertical spacing between each N.
flags.nSpacing = 8;

// Horizontal spacing between vertices of a given line.
flags.kSpacing = 8;

// Vertical change between each pair of successive vertices on a line.
flags.yDelta = 8;


/** Run the app. */
(() => {

  // Faster parity test.
  const isEven = n => (n & 1) === 0;

  /**
   * Computes the Collatz array.
   * The Collatz array is a matrix where each row's first value is N, and
   * each consecutive value in the row is obtained by plugging the previous
   * value in the row into this function:
   *
   *   f(n) = {
   *        n / 2,   n even
   *       3n + 1,   n odd
   *   }
   */
  const computeCollatzArray = () => {
    const collatzArray = [];

    for (let n = flags.nStart; n <= flags.nStop; n++) {
      const row = [n];
      let value = n;

      for (let k = 1; k <= flags.maxIterations; k++) {
        value = isEven(value) ? value / 2 : 3 * value + 1;
        row.push(value);

        if (flags.stopCollatzAtOne && value === 1) {
          break;
        }
      }

      collatzArray.push(row);
    }

    return collatzArray;
  };

  /** Locates and sizes the canvas to the specified dimensions. */
  const initCanvas = (width, height) => {
    const canvas = document.getElementById('canvas');

    canvas.width = width;
    canvas.height = height;

    return canvas;
  };

  console.log('Computing the Collatz Array.');
  const collatzArray = computeCollatzArray();

  const calculatedWidth = flags.kSpacing * flags.maxIterations;
  const calculatedHeight = flags.nSpacing * (flags.nStop - flags.nStart);

  const canvas = initCanvas(calculatedWidth, calculatedHeight);
  const context = canvas.getContext('2d');

  console.log('Rendering the graphic.');
  render(context, collatzArray);

  async function render(context, paths) {

    for (let n = 0; n < paths.length; n++) {
      // Cycle through the available colors.
      context.strokeStyle = colors[n % colors.length];

      // To draw the tree shape, start each line at the same Y.
      let y = flags.drawTree ? 200 : flags.nSpacing * (n + 1);
      context.beginPath();
      context.moveTo(0, y);

      for (let k = 0; k < paths[n].length - 1; k++) {
        y += isEven(paths[n][k]) ? flags.yDelta : -flags.yDelta;
        context.lineTo(flags.kSpacing * k, y);
      }

      if (flags.animate) {
        const startTime = performance.now();
        context.stroke();
        const timeToDrawStroke = performance.now() - startTime;
        const delay = flags.animationTime - timeToDrawStroke;

        // If the delay is just a few ms, we can ignore it for performance.
        if (delay > 5) {
          await wait(flags.animationTime)
        }
      }
      context.stroke();
    }
  }

  function wait(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

})();
