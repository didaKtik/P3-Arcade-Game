/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
        girls = [],
        stop;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        /* In case of collision or victory, stop is set to true after the
         * call to update(dt), so that render() doesn't overdraw the game
         * menu.
         */
        if (!stop) {
            render();

            /* Set our lastTime variable which is used to determine the time delta
             * for the next time this function is called.
             */
            lastTime = now;

            /* Use the browser's requestAnimationFrame function to call this
             * function again as soon as the browser is able to draw another frame.
             */
            win.requestAnimationFrame(main);
        }
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data.
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
        checkVictory();
    }

    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    /* This function checks for collisions. A collision occurs if the horizontal
     * distance between player and any enemy is less than 101px (width of a tile),
     * or if the vertical distance is less than 83px (height of a tile). If a
     * collision is detected, the reset function is called.
     */
    function checkCollisions() {
        allEnemies.forEach(function(enemy) {
            var y_gap = Math.abs(player.y - enemy.y),
                x_gap = Math.abs(player.x - enemy.x);
            if (x_gap < 101 && y_gap < 83) {
                alert('Try again!');
                reset();
            }
        });
    }

    /* This function call reset() (so the game menu) if the player reaches the
     * top row.
     */
    function checkVictory() {
        if (player.y < 83 - YOFFSET) {
            alert('You win!');
            reset();
        }
    }

    /* This function does some initial setup and is called only once.
     */
    function init() {
        initGirls();
        addClickGirls();
        reset();
    }

    /* This function initializes the girls array with girl objects that are
     * used for our game menu.
     */
    function initGirls() {
        girls.push({
            sprite: 'images/char-cat-girl.png',
            width: 101,
            height: 83,
            top: canvas.height / 2,
            left: 55
        });
        girls.push({
            sprite: 'images/char-horn-girl.png',
            width: 101,
            height: 83,
            top: canvas.height / 2,
            left: 156
        });
        girls.push({
            sprite: 'images/char-pink-girl.png',
            width: 101,
            height: 83,
            top: canvas.height / 2,
            left: 257
        });
        girls.push({
            sprite: 'images/char-princess-girl.png',
            width: 101,
            height: 83,
            top: canvas.height / 2,
            left: 358
        });
    }

    /* All clicks on the canvas are recorded, and the ones that are
     * on a girl reinstantiate the player and enemies, and the main()
     * function is reentered.
     */
    function addClickGirls() {
        var canvasLeft = canvas.offsetLeft,
            canvasTop = canvas.offsetTop;
        // All canvas clicks are recorded
        canvas.addEventListener('click', function(e) {
            // x and y are relative to the canvas
            var x = e.pageX - canvasLeft,
                y = e.pageY - canvasTop;

            // Match detection between click position and girl
            girls.forEach(function(girl) {
                // The 60px offset is to compensate the blank top part
                // of the girls' .png
                if (y > girl.top + 60 && y < girl.top + girl.height + 60 &&
                    x > girl.left && x < girl.left + girl.width) {
                    // Reinstantiates player with the chosen sprite
                    player = new Player(girl.sprite);
                    // Reinstantiate enemies
                    allEnemies.forEach(function(enemy, index, allEnemies) {
                        allEnemies[index] = new Enemy();
                    });
                    // Set stop to false for main to fully execute
                    stop = false;
                    // Reenter the game loop
                    lastTime = Date.now();
                    main();
                }
            });
        });
    }

    /* This function clears the canvas and redraws the game menu.
     * It's called at start (init), in case of collision and in case
     * of victory.
     */
    function reset() {
        // Prevent main from executing further instructions
        stop = true;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw text 'Choose a girl!'
        drawText();

        // Draw girls
        girls.forEach(function(girl) {
            ctx.drawImage(Resources.get(girl.sprite), girl.left, girl.top);
        });

    }

    function drawText() {
        ctx.font = "36px Georgia";
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'orange';
        ctx.lineWidth = 5;
        ctx.textAlign = 'center';

        ctx.strokeText('CHOOSE YOUR GIRL!', canvas.width / 2, 320);
        ctx.fillText('CHOOSE YOUR GIRL!', canvas.width / 2, 320);
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;

})(this);
