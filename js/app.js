/* app.js */
// Classes are written in the pseudo-classical pattern

// TODO-1: new parent class for Enemy and Player with
// object inheritance -> DONE
// TODO-2: new FSM structure

// Invoke strict mode for the entire script, to obtain
// more 'secure' code
'use strict';

/** Player's and enemies' y-coordinate is a multiple of
 * 83px (the height of each row) minus this constant to
 * account for a shift between background and figure
 * sprites.
 * @constant
 * @global
 */
var YOFFSET = 20;

/** This class holds what Enemy and Player instances have
 * in common.
 * @class
 */
 // This a statement, while function fun() {} is a
 // 'named function expression'
 var Creature = function(sprite, x, y) {
    /** Url of the image to draw this creature */
    this.sprite = sprite;
    /** X-coordinate */
    this.x = x;
    /** Y-coordinate */
    this.y = y;
 };

/** This function is used to draw a creature on canvas,
 * based on the creature's position and sprite.
 */
 Creature.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/** This class represents the naughty bugs. It inherits
 * from the Creature class.
 * @class
 */
var Enemy = function() {
    // Enemy inherits the Creature properties
    Creature.call(this);
    /** The image/sprite for our enemies, this uses
     * a helper we've provided to easily load images.
     */
    this.sprite = 'images/enemy-bug.png';
    /** X-coordinate is set left of canvas) */
    this.x = -101;
    /** Speed is set to zero */
    this.speed = 0;
    // Set y position and speed randomly, with delay
    this.delayedStart();
};

// Enemy.prototype delegates the failed lookups to Creature.prototype
Enemy.prototype = Object.create(Creature.prototype);
// Set the constructor property for the subclass
Enemy.prototype.constructor = Enemy;

/** Update the enemy's position
 * @param {number} dt - A time delta between ticks
 */
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

/** This function is used to check if an enemy has left
 * canvas on the right.
 * @returns {boolean} - true if the enemy is out of canvas.
 */
Enemy.prototype.out = function() {
    return this.x >= 505;
};

/** This method is used to reset an enemy left of canvas,
 * and set its speed to zero so that it waits before
 * rushing again.
 */
Enemy.prototype.waitLeft = function() {
    this.x = -101;
    this.speed = 0;
};

/** This method is used to provide a random delay before
 * a bug (i.e. an enemy) starts to rush again.
 */
Enemy.prototype.delayedStart = function() {
    /** delay is between 0 and 0.5s
     * @var {number} delay
     */
    var delay = Math.floor(500 * Math.random());
    setTimeout(this.randomFeatures(), delay);
};

/** This callback is used to randomly set the y and
 * speed properties of an enemy when it finishes
 * waiting on the left of the canvas.
 */
Enemy.prototype.randomFeatures = function() {
    // Enemy appears on second, third or fourth row
    this.y = Math.floor(Math.random() * 3 + 1) * 83 - YOFFSET;
    // Speed is 200, 300 or 400
    this.speed = 100 * Math.floor(Math.random() * 3 + 2);
};


/** This class represents our brave hero!
 * @class
 * @param {string} sprite - The url of the image for our player.
 */
var Player = function(sprite) {
    /** The image/sprite for our player, default value corresponds to the boy.
     * @example 'images/char-boy.png'
     */
    // Player inherits Creature properties
    Creature.call(this);
    // default sprite is the boy
    this.sprite = sprite || 'images/char-boy.png';
    /** X-coordinate */
    this.x = 2 * 101;
    /** Y-coordinate */
    this.y = 5 * 83 - YOFFSET;
};

// Player.prototype delegates the failed lookups to Creature.prototype
Player.prototype = Object.create(Creature.prototype);
// Set the constructor property for the subclass
Player.prototype.constructor = Player;

/** This method handles valid keyboard inputs by moving
 * the player according to the arrow pressed, if the boundaries
 * of the game have not been reached.
 * @param {string} keyCode - 'top', 'right', 'bottom' or 'right'.
 */
Player.prototype.handleInput = function(keyCode) {
    switch(keyCode) {
        case 'left':
            if (this.x > 0) {
                this.x -= 101;
            }
            break;
        case 'up':
            if (this.y >= 83 - YOFFSET) {
                this.y -= 83;
            }
            break;
        case 'right':
            if (this.x < 4 * 101) {
                this.x += 101;
            }
            break;
        case 'down':
            if (this.y < 5 * 83 - YOFFSET) {
                this.y += 83;
            }
            break;
    }
};

// Objects are instantiated
/** This array stores the enemy instances.
 * @var {array} allEnemies
 * @global
 */
var allEnemies = [];
// 3 enemies
allEnemies.push(new Enemy());
allEnemies.push(new Enemy());
allEnemies.push(new Enemy());
// 1 player
/** Our hero!
 * @var {Player} player
 * @global
 */
var player = new Player();


/* Listen for key presses and send the keys to the
 * Player.handleInput() method.
 */
document.addEventListener('keyup', function(e) {

    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
