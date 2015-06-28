/* app.js
 * This defines the Enemy and Player classes,
 * initiates one player and three enemies, and
 * handles keyboard inputs.
 */

// player's and enemies' y-coordinate is a multiple of
// 83px (the height of each row) minus this constant to
// account for a shift between background and figure
// sprites.
var yOffset = 20;

// Enemy class
var Enemy = function() {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    // Set the enemy left of canvas with null speed
    this.waitLeft();
    // Set y position and speed randomly, with delay
    this.delayedStart();
};

// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // Any movement is multiplied by the dt parameter
    // to ensure the game runs at the same speed on
    // each computer
    this.x += this.speed * dt;

    // When an enemy leaves canvas on the rigth, it is set
    // back to the left of the canvas and waits to start
    // afresh.
    if (this.out()) {
        this.waitLeft();
        this.delayedStart();
    }
};

// Return true if the enemy is right of canvas
Enemy.prototype.out = function() {
    return this.x >= 505;
};

// Set the enemy left of canvas with null speed
Enemy.prototype.waitLeft = function() {
    this.x = -101;
    this.speed = 0;
};

// Call randomFeatures with a random delay
Enemy.prototype.delayedStart = function() {
    // delay is between 0 and 0.5s
    var delay = Math.floor(500 * Math.random());
    // Call to setTimeout for delayed start
    setTimeout(this.randomFeatures(), delay);
};

// Set y and speed properties randomly
Enemy.prototype.randomFeatures = function() {
    // Enemy appears on second, third or fourth row
    this.y = Math.floor(Math.random() * 3 + 1) * 83 - yOffset;
    // Speed is 200, 300 or 400
    this.speed = 100 * Math.floor(Math.random() * 3 + 2);
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Player class
var Player = function(sprite) {
    // The image/sprite for our player, default value is the boy.
    this.sprite = typeof sprite !== 'undefined' ? sprite : 'images/char-boy.png';
    // Set initial position
    this.resetPos();
};

// Set the player to its initial position
Player.prototype.resetPos = function() {
    this.x = 2 * 101;
    this.y = 5 * 83 - yOffset;
};

// Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Move the player according to keyCode if
// limits are not reached
Player.prototype.handleInput = function(keyCode) {
    switch(keyCode) {
        case 'left':
            if (this.x > 0) {
                this.x -= 101;
            }
            break;
        case 'up':
            if (this.y >= 83 - yOffset) {
                this.y -= 83;
            }
            break;
        case 'right':
            if (this.x < 4 * 101) {
                this.x += 101;
            }
            break;
        case 'down':
            if (this.y < 5 * 83 - yOffset) {
                this.y += 83;
            }
            break;
    }
};

// Objects are instantiated
// 3 enemies
var allEnemies = [];
allEnemies.push(new Enemy());
allEnemies.push(new Enemy());
allEnemies.push(new Enemy());
// 1 player
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {

    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
