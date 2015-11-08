//  20 x 20 canvas
// on food eat
  // snake increases in length (snake.length += 1)
  // OPTIONAL: game speed increases
  // new food appears at random location
    // ensure new location is not inside snake

// on keypress (wsad)
  // change snake.direction to new direction

// on snake hit wall / self
  // die.

// keep track of score

// update snake movement very slowly

// black canvas
// white snake
// white food



// initial set up
var canvas = document.createElement('canvas'),
  ctx = canvas.getContext('2d'),
  gridSize = 20; // 20px per grid for a 20 x 20 canvas

canvas.height = 400;
canvas.width = 400;
document.body.appendChild(canvas);

// variables for later

var keyPresses = {
  38: 'up',
  40: 'down',
  37: 'left',
  39: 'right'
}
var lose = false;


// drawing functions
function clearCanvas() {
  ctx.clearRect(200, 0, 400, 400);
}

function drawBackground() {
  ctx.beginPath();
  ctx.rect(0, 0, canvas.height, canvas.width);
  ctx.fillStyle = 'black';
  ctx.fill();
}


// spawn food at random location outside of snake
function spawnFood() {
  food.x = Math.round(Math.random() * canvas.width);
  food.y = Math.round(Math.random() * canvas.height);
};

// move

// draws / redraws snake for each frame
function drawSnake() {
  ctx.beginPath();
  ctx.rect(0, 0, canvas.height / 2, canvas.width / 2);

  var currentX = snake.x,
    currentY = snake.y;

  snake.breakpoints[0][1]--; // snake has moved, so make the tail shorter
  // iterate over each snake segment, drawing it out
  snake.breakpoints[snake.breakpoints.length - 1][1]++;
  // alert(snake.breakpoints[snake.breakpoints.length - 1])

  if (snake.breakpoints[0][1] === 0) {
    snake.breakpoints.shift();
  };


  for (var i = 0; i < snake.breakpoints.length ; i++) {
    var direction = snake.breakpoints[i][0],
      length = snake.breakpoints[i][1] * gridSize;
    ctx.beginPath();

    if (direction === 'up') {
    currentY -= length;
      ctx.rect(currentX, currentY, gridSize, length);
    }
    else if (direction === 'down') {
      ctx.rect(currentX, currentY, gridSize, length + gridSize);
      currentY += length;
    }
    else if (direction ==='left') {
      currentX -= length;
      ctx.rect(currentX, currentY, length, gridSize);
    }
    else if (direction === 'right') {
      ctx.rect(currentX + gridSize, currentY, length, gridSize);
      currentX += length;
    }
    ctx.fillStyle = 'white';
    ctx.fill();
  }



  var tailDirection = snake.breakpoints[0][0];
  if (tailDirection === 'up')
    snake.y -= gridSize;
  else if (tailDirection === 'down')
    snake.y += gridSize;
  else if (tailDirection === 'left')
    snake.x -= gridSize;
  else if (tailDirection === 'right')
    snake.x += gridSize;

  // debugger;

  if (currentX < -gridSize || currentX > canvas.width - gridSize
    || currentY === -gridSize || currentY == canvas.height)
    lose = true;
}



/**
 * game objects
 */

var food = {
  x: 0,
  y: 0
};

// each breakpoint is [direction, length]
var snake = {
  breakpoints: [ ['up', 10], ['right', 2] ]
};
// TODO: Solve qn: why can't I ref breakpoints while defining snake?

// initialize snake's head x and y to middle of canvas
snake.x = (canvas.width - snake.breakpoints[0][1]) / 2,
snake.y = canvas.height / 2



/**
 * game itself
 */
drawBackground();
drawSnake();

setInterval(function() {
  // debugger;
  if (!lose) {
    clearCanvas();
    drawBackground();
    drawSnake();
  }
}, 400);

addEventListener('keydown', function(e) {
  var direction = keyPresses[e.keyCode];
  var prevDirection = snake.breakpoints[snake.breakpoints.length - 1][0];

  // ensure snake's moved at least a bit before allowing next direction to be set
  if (snake.breakpoints[snake.breakpoints.length - 1][1] > 0) {
    // ignore illegal horizontal direction inputs
    if ((direction == 'left' || direction == 'right') && !(prevDirection == 'left' || prevDirection == 'right'))
      snake.breakpoints.push([direction, 0]);
    // ignore illegal vertical direction inputs
    else if ((direction == 'up' || direction == 'down') && !(prevDirection == 'up' || prevDirection == 'down'))
      snake.breakpoints.push([direction, 0]);
  }
});
