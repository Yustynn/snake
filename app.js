// unless otherwise stated, unit of measurement for coordinates
// is blockSize

// x and y coordinates signify the top left of the given block

// I'm having trouble keeping methods on the Game, Snake and Food objects from referencing each other

// First attempt sucked due to
  // not thinking through all the game rules
    // eg snake touching itself
  // unfamiliarity with canvas
  // use requestAnimationFrame



// MINOR TODOS
  // fix die at wall offset bug
  // use requestAnimationFrame
  // refactor score code. It's all over the place.
  // make program more functional. I don't like the external references.

/**
 * Coordinates object
 */

function Coordinates(x, y) {
  this.x = x;
  this.y = y;
}

 /**
  * Game object
  */

// constructs square board and dynamically generates this.blockSize
function Game(boardLengthPx, boardLengthBlocks, boardColor) {
  var canvas = document.createElement('canvas');
  canvas.width = boardLengthPx;
  canvas.height = boardLengthPx;
  this.ctx = canvas.getContext('2d');

  document.body.appendChild(canvas);

  this.boardColor = boardColor;
  this.blockSize = boardLengthPx / boardLengthBlocks;
  this.boardLength = boardLengthBlocks;

  this.lastTurn = Date.now();
}

// converts block to px
Game.prototype.blockToPx = function(magnitude) {
  return magnitude * this.blockSize;
};

// returns boolean indicating whether coordinates are the same
Game.prototype.sameCoordinates = function(c1, c2) {
  return c1.x === c2.x && c1.y === c2.y;
};

Game.prototype.turn = function(snake, food) {
  game.clear();
  game.drawBg();
  game.drawFood(food);
  if (snake.isDead()) {
    snake.color = 'red';
    game.drawSnake(snake);
    return;
  }
  game.drawSnake(snake);
  score.innerText = snake.eatCount;

  if (this.sameCoordinates(snake.getHead(), food.coordinates)) {
    snake.eat();
    food.resetCoordinates();
  }
  else
    snake.move();
  snake.moved = false;
  console.log(snake.getHead());
};

// draws background of Game.color color
Game.prototype.drawBg = function() {

  this.ctx.beginPath();
  this.ctx.rect(
    0, 0,
    this.blockToPx(this.boardLength), this.blockToPx(this.boardLength)
  );
  this.ctx.fillStyle = this.boardColor;
  this.ctx.fill();
};

// draws single block
Game.prototype.drawBlock = function(coordinates, color) {
  this.ctx.beginPath();
  this.ctx.rect(
    this.blockToPx(coordinates.x), this.blockToPx(coordinates.y),
    this.blockSize, this.blockSize
  );
  this.ctx.fillStyle = color;
  this.ctx.fill();
};

// draws snake
Game.prototype.drawSnake = function(snake) {
  var color = snake.color;
  snake.coordinatesQueue.forEach(function(coordinates) {
    this.drawBlock(coordinates, color);
  }, this);
};

Game.prototype.drawFood = function(food) {
  this.drawBlock(food.coordinates, food.color);
};


// clears board (including any snake and food)
Game.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.blockToPx(this.boardLength), this.blockToPx(this.boardLength));
};

Game.prototype.randomCoordinate = function() {
  return Math.floor(Math.random() * this.boardLength);
}

Game.prototype.randomCoordinates = function() {
  return new Coordinates(this.randomCoordinate(), this.randomCoordinate());
}

/**
 * Snake object
 */

// constructs snake in the middle of the screen
function Snake(direction, length, color) {
  // TODO: Figure out how not to reference the 'game' var
  this.coordinatesQueue = [ new Coordinates(game.boardLength / 2, game.boardLength / 2) ];
  this.color = color;
  this.direction = direction;
  this.moved = false;
  this.eatCount = 0;

  for (var i = 0; i < length; i++) {
    this.lengthenHead();
  }

  this.listen();
}

Snake.prototype.listen = function() {
  document.addEventListener('keydown', function(e) {
    var directions = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
    };
    var direction = directions[e.keyCode];

    // only if snake has not moved yet this turn
    if (!snake.moved) {
    // ignore horizontal input when current direction is horizontal
      if ( (direction === 'left' || direction == 'right') && (this.direction === 'up' || this.direction === 'down') )
        this.direction = directions[e.keyCode];

      // ignore vertical input when current direction is vertical
      if ( (direction === 'up' || direction == 'down') && (this.direction === 'left' || this.direction === 'right') )
        this.direction = directions[e.keyCode];
      snake.moved = true;
    }
  }.bind(this));
}

// returns boolean for if given coordinates overlap with snake
Snake.prototype.contains = function(coordinates) {
  return this.coordinatesQueue.some(function(snakeCoordinates) {
    return snakeCoordinates.x === coordinates.x && snakeCoordinates.y === coordinates.y;
  });
};

// same as contains() but excludes the head when checking
Snake.prototype.bodyContains = function(coordinates) {
  var bodyCoordinatesQueue = this.coordinatesQueue.slice(0, this.coordinatesQueue.length - 1);
  return bodyCoordinatesQueue.some(function(snakeCoordinates) {
    return snakeCoordinates.x === coordinates.x && snakeCoordinates.y === coordinates.y;
  });
};

// returns coordinates of head
Snake.prototype.getHead = function() {
  return this.coordinatesQueue[this.coordinatesQueue.length - 1]
};
// returns coordinates of tail
Snake.prototype.getTail = function() {
  return this.coordinatesQueue[0]
};


// lengthens head to help simulate movement, or for when initializing snake
Snake.prototype.lengthenHead = function() {
  var head = this.getHead(),
    x = head.x,
    y = head.y;

    if (this.direction === 'up') {
      debugger;
      var c = new Coordinates(x, y - 1);
      this.coordinatesQueue.push(c);
    }
      // this.coordinatesQueue.push(
      //   new Coordinates(x, y - 1)
      // );
    else if (this.direction === 'down')
      this.coordinatesQueue.push(
        new Coordinates(x, y + 1)
      );
    else if (this.direction === 'left')
      this.coordinatesQueue.push(
        new Coordinates(x - 1, y)
      );
    else if (this.direction === 'right')
      this.coordinatesQueue.push(
        new Coordinates(x + 1, y)
    );
};

// shortens tail to help simulate movement
Snake.prototype.shortenTail = function() {
  this.coordinatesQueue.shift();
}

// simulates movement by lengthening head and shortening tail
Snake.prototype.move = function() {
  this.lengthenHead();
  this.shortenTail();
  this.moved = true;
}

// simulates eating by lengthening head without shortening tail
Snake.prototype.eat = function() {
  this.lengthenHead();
  this.moved = true;
  this.eatCount++;
}

// returns boolean
// TODO: stop referencing 'game' var!
Snake.prototype.isDead = function() {
  var head = this.getHead();
  return (
    head.x === game.boardLength || head.x < 0 ||
    head.y === game.boardLength || head.y < 0 ||
    this.bodyContains(head)
  )
}

/**
 * Food object
 */

// constructs food (1 x 1 block) at random location outside snake
function Food(color) {
  this.color = color;
  this.resetCoordinates();
};

// returns coordinates that are not contained within snake
// TODO: figure out how to do this without referencing the 'game' var
Food.prototype.resetCoordinates = function() {
  this.coordinates = game.randomCoordinates();
  if (snake.contains(this.coordinates))
    this.resetCoordinates();
};

var game = new Game(400, 20, 'black'),
  snake = new Snake('right', 5, 'green'),
  food = new Food('white');

var p = document.createElement('p');
document.body.appendChild(p);
p.innerText = 'Score: ';
var score = document.createElement('span');
p.appendChild(score);


setInterval(function() {
    game.lastTurn = Date.now();
    game.turn(snake, food);
}, 100);
