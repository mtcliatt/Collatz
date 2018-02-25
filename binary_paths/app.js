'use strict';

/* red, blue, green, yellow */
const colors = ['#F44336', '#2196F3', '#4CAF50', '#FFEB3B'];

const flags = {};

/* Display */
// Set to true to see each line added one by one
flags.animate = false;

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

  /** Creates and returns a canvas with the specified dimensions. */
  const initCanvas = (width, height) => {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);

    canvas.width = width;
    canvas.height = height;

    return canvas;
  };

  const render = (context, paths) => {
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

      context.stroke();
    }
  }

  const animatedRender = async (context, paths) => {
    for (let n = 0; n < paths.length; n++) {
      const startTime = performance.now();

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

      context.stroke();

      // Wait less time based on how long it took to draw the line.
      const timeToDrawLine = performance.now() - startTime;
      const waitTime = flags.animationTime - timeToDrawLine;

      // If the delay is just a few ms, we can ignore it for performance.
      if (waitTime > 5) {
        await wait(waitTime);
      }

      context.stroke();
    }
  }

  const wait = ms => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  console.log('Computing the Collatz Array.');
  const collatzArray = computeCollatzArray();

  console.log('Rendering the graphic.');
  let width = flags.kSpacing * flags.maxIterations;
  // Add a little extra height so the last lines don't run off the screen.
  let height = flags.nSpacing * (flags.nStop - flags.nStart + 20);

  // See if we can make the canvas less wide, since larger canvases are slower.
  if (flags.stopCollatzAtOne) {
    let maxK = 0;

    for (const row of collatzArray) {
      maxK = Math.max(maxK, row.length);
    }

    width = flags.kSpacing * (maxK + 2);
  }

  const context = initCanvas(width, height).getContext('2d');

  if (flags.animate) {
    animatedRender(context, collatzArray);
  } else {
    render(context, collatzArray);
  }
})();
