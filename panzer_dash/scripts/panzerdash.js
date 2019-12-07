/*
 * Notes:
 *
 * My goal with this program was to demonstrate a variety of learnings we have had in class
 * as well as some additional research I conducted on my own to bring this project to life.
 *
 * Movement: This project features movement based on keypresses as the main character is 
 * controlled by the WASD keys.  
 *
 * Collision Detection: I have implemented collision detection differently for the collectable
 * items, physical barriers, and enemies.
 *
 * Tilemap: Red Samurai game contains an in depth and unique tilemap in this game.  Total,
 * the tilemap is 1000x1000 pixels with each tile taking 20x20.
 *
 * Translation: This game also takes advantage of translation to give the player the feeling of
 * an overhead camera tracking their player on a 400x400 grid.
 *
 * Artist: 
 *     Alex Shammas 
 * Programmer: 
 *     Joey (Joseph) Rodgers
 *     Jovany Cabrera 
 */

var SCREEN_WIDTH = 800;
var SCREEN_HEIGHT = 600;

var sketchProc=function(processingInstance){ with (processingInstance) {
size(SCREEN_WIDTH, SCREEN_HEIGHT); 
frameRate(60);

//ProgramCodeGoesHere

// Global var/switch to enforce a certain pixel count for height and width per tile
var TILE_HEIGHT = 80; 
var TILE_WIDTH = TILE_HEIGHT * SCREEN_HEIGHT / SCREEN_WIDTH;  // Keep proportions in line with aspect ratio 

// Preload necessary game assets by using Processing's preload directive
/*
    @pjs 
    preload =
        '../assets/main_menu1.jpg',
        '../assets/main_menu2.jpg',
        '../assets/main_menu3.jpg',
        '../assets/main_menu4.jpg',
        '../assets/level_one_bg.jpg',
        '../assets/bg_scene3.png',
        '../assets/samurai_cover.jpg',
        '../assets/bones.png',
        '../assets/enemy1.png',
        '../assets/enemy2.png',
    crisp='true';
*/

/*
var audio = new Audio("https://s3.amazonaws.com/audio-experiments/examples/elon_mono.wav");

function playAudio() {
    audio.play();
}   

function pauseAudio() {
    audio.pause();
}

function cancelAudio() {
    audio.pause();
    audio.currentTime = 0;
}
*/

// Enum for each game state in the PanzerDash FSM diagram
var GameState_e = {
    START_SCREEN: 0, // Start Screen
    LEVEL_ONE: 1,
    LEVEL_TWO: 2, 
    LEVEL_THREE: 3,
    WIN_SCREEN: 4,
    LOSE_SCREEN: 5,
    CREDITS: 6,
    HELP_SCREEN: 7,
    ANIMATED_LOAD_TRANSITION: 8,
    ANIMATED_WIN_TRANSITION: 9,
    ANIMATED_LOSE_TRANSITION: 10,
    ANIMATED_HELP_TRANSITION: 11,
    ANIMATED_MENU_TRANSITION: 12, 
    DEFAULT: 13,
};

// Created a struct like variable to store the different game screens
var GameScreens_t = {
    START_SCREEN: [
        loadImage('../assets/main_menu1.jpg'),
        loadImage('../assets/main_menu2.jpg'),
        loadImage('../assets/main_menu3.jpg'),
        loadImage('../assets/main_menu4.jpg'),
    ],
    HELP_SCREEN_TRANSITIONS: [
        loadImage('../assets/help_transition1.jpg'),
        loadImage('../assets/help_transition2.jpg'),
        loadImage('../assets/help_transition3.jpg'),
        loadImage('../assets/help_transition4.jpg'),
        loadImage('../assets/help_transition5.jpg'),
        loadImage('../assets/help_transition6.jpg'),
    ],
    HELP_SCREEN:              loadImage('../assets/help_screen.jpg'),
    HELP_SCREEN_BACK_BUTTON:  loadImage('../assets/back_button.png'),
    LEVEL_ONE:                loadImage('../assets/level_one_bg.jpg'),
    // LEVEL_TWO:  TODO:
    // LEVEL_THREE:  TODO:
};

var Assets_t = {
    // Load other assets in here
    PANZER:        loadImage('../assets/tank_body.png'),
    PANZER_GUN:    loadImage('../assets/tank_gun.png'),
    ENEMY1_BASE:   loadImage('../assets/enemy1_base.png'),
    ENEMY_FRONT:   loadImage('../assets/enemy1_front.png'),
    ENEMY2_BASE:   loadImage('../assets/enemy2_base.png'),
    ENEMY_TURRET:  loadImage('../assets/enemy2_turret.png'),
    BOSS1_BASE:    loadImage('../assets/level1_boss_base.png'),
    BOSS1_FRONT:   loadImage('../assets/level1_boss_front.png'),
};

var TankOptions_e = {
    BASIC: 0,
    UPGRADED: 1,
};

var ObjectType_e = {
    BASIC: 0,
    COLLECTABLE: 1,
    TANK: 2,
    ENEMY: 3,
};

var HelpSpeedOptions_e = {
    FAST: 30,
    MEDIUM: 60,
    SLOW: 90,
};

// -------------- Define key press state structure and related functions ----------------
var keyState = {
    PRESSED: 0,
};

var keyPressed = function() {
    keyState.PRESSED = 1;
    if (key.toString() === 'w') {
        DISABLE.W = false;
    }
    if (key.toString() === 'a') {
        DISABLE.A = false;
    }
    if (key.toString() === 's') {
        DISABLE.S = false;
    }
    if (key.toString() === 'd') {
        DISABLE.D = false;
    }
    if (parseInt(key, 10) === 32) {
        DISABLE.SPACE = false;
    }
    if (keyCode === UP) {
        DISABLE.UP = false;
    }
    if (keyCode === DOWN) {
        DISABLE.DOWN = false;
    }
    if (keyCode === LEFT) {
        DISABLE.LEFT = false;
    }
    if (keyCode === RIGHT) {
        DISABLE.RIGHT = false;
    }
};

var keyReleased = function() {
    keyState.PRESSED = 0;
    if (key.toString() === 'w') {
        DISABLE.W = true;
    }
    if (key.toString() === 'a') {
        DISABLE.A = true;
    }
    if (key.toString() === 's') {
        DISABLE.S = true;
    }
    if (key.toString() === 'd') {
        DISABLE.D = true;
    }
    if (parseInt(key, 10) === 32) {
        DISABLE.SPACE = true;
    }
    if (keyCode === UP) {
        DISABLE.UP = true;
    }
    if (keyCode === DOWN) {
        DISABLE.DOWN = true;
    }
    if (keyCode === LEFT) {
        //println("Left released!!");
        DISABLE.LEFT = true;
    }
    if (keyCode === RIGHT) {
        //println("Right released!!");
        DISABLE.RIGHT = true;
    }
};

var wPressed = function() {
    return (keyState.PRESSED && key.toString() === 'w'); 
};
    
var sPressed = function() {
    return (keyState.PRESSED && key.toString() === 's'); 
};
    
var dPressed = function() {
    return (keyState.PRESSED && key.toString() === 'd'); 
};
    
var aPressed = function() {
    return (keyState.PRESSED && key.toString() === 'a');  
};

var spacePressed = function() {
    return (keyState.PRESSED && parseInt(key, 10) === 32);
}

var DISABLE = {
    W:     true,
    A:     true,
    S:     true,
    D:     true,
    SPACE: true,
    UP:    true,
    DOWN:  true,
    LEFT:  true,
    RIGHT: true,
};

// ---------------------- End key press functions --------------------

var bulletObj = function(x, y, s) {
    this.position = new PVector(x, y);
    this.w = 4;  // width
    this.l = 7;  // length
    this.speed = new PVector(0, s);
    this.damage = 1;
    this.hit = 0;
};

bulletObj.prototype.draw = function() {
    if(this.hit == 0) {
        noStroke();
        fill(31, 31, 24);
        rect(this.position.x - this.w / 2, this.position.y, this.w, this.l);
        ellipse(this.position.x, this.position.y, this.w, this.w);
        this.position.add(this.speed);
    }
};

bulletObj.prototype.EnemyCollisionCheck = function(enemyList) {
    for (var i = 0; i < enemyList.length; i++) {
        var within_x = this.position.x > round(enemyList[i].position.x) && this.position.x < round(enemyList[i].position.x) + TILE_WIDTH;
        var within_y = this.position.y > round(enemyList[i].position.y) - TILE_HEIGHT && this.position.y < round(enemyList[i].position.y) + TILE_HEIGHT;

        if (within_x && within_y && !enemyList[i].defeated) {  // Check that object has not already been collected
            // Inflict collateral damage
            enemyList[i].health--;
            if (enemyList[i].health < 1) {
                enemyList[i].defeated = true;
            }
            this.hit = 1;
        }
    }
};

var laserObj = function(x, y) {
    this.x = x;
    this.y = y;
    this.startWidth = 1;
    this.length = -SCREEN_WIDTH;
    this.damage = 5;
};

laserObj.prototype.draw = function(timeOn) {
    fill(92, 227, 13);  // laser color
    noStroke();
    rect(this.x - (this.startWidth * timeOn) / 2, this.y + 4, this.startWidth * timeOn, this.length);
};

var tankShellObj = function(x, y, s) {
    this.position = new PVector(x, y);
    this.w = 4;  // width
    this.l = 8;  // length
    this.speed = new PVector(0, s);
};

tankShellObj.prototype.draw = function(gunAngle) {

    fill(160, 160, 160);
    rect(this.position.x - this.w / 2, this.position.y, this.w, this.l);

    fill(153, 23, 55);
    ellipse(this.position.x, this.position.y + this.l / 2, this.w, this.w);

    fill(186, 140, 0);
    ellipse(this.position.x, this.position.y - this.l / 2, this.w, this.w);

    this.position.add(this.speed);
};

// This is the main character (i.e. the samurai)
var tankObj = function(x, y, s) {
    this.x = x;
    this.y = y;
    this.speed = s;
    this.bullets = [];
    this.bulletSpeed = -6;
    this.fireRate = 5;
    this.autoFireEnabled = false;
    this.health = 1000;
    this.type = ObjectType_e.TANK;
};

tankObj.prototype.draw = function(frameCount) {
    var self = this;

    if (DISABLE.W === false) { // } && self.y > 0) {
        self.y -= self.speed;
    }
    if (DISABLE.S === false) { // && self.y < SCREEN_HEIGHT - TS) {
        self.y += self.speed;  
    }
    if (DISABLE.D === false && self.x < SCREEN_WIDTH - TILE_WIDTH) {
        self.x += self.speed;
    }
    if (DISABLE.A === false && self.x > 0) {
        self.x -= self.speed;
    }
    if (DISABLE.SPACE === false) {
        self.speed = 5;
    }
    else {
        self.speed = 2;
    }

    if (!DISABLE.DOWN) {
        this.autoFireEnabled = !this.autoFireEnabled;  // toggle the auto fire enabled option
        this.autoFireToggled = true;
    }
    if (!DISABLE.UP || this.autoFireEnabled) {  // Fire the gun
        if (frameCount % this.fireRate === 0) {
            this.bullets.push(new bulletObj(this.x + TILE_WIDTH * 2 / 3, this.y, this.bulletSpeed));
        }   
    }

    if (frameCount % 5 === 0) { // TODO: Better implementation of the autofire delayed needed
        this.autoFireToggled = false;
    }

    image(Assets_t.PANZER, self.x, self.y, TILE_WIDTH, TILE_HEIGHT);
    for (var i = 0; i < this.bullets.length; i++) {
        this.bullets[i].draw();
        if (loopIterations === 0) {  // 1st wave of enemies (1st map iteration)
            this.bullets[i].EnemyCollisionCheck(GAME_INST.enemyObjects);
        }
        else if (loopIterations === 1) {  // 2nd wave of enemies (2nd map iteration)
            this.bullets[i].EnemyCollisionCheck(GAME_INST.enemyObjects2);
        }
    }
};

/*
 * Pass in an array containing the collectable objects within the game tilemap
 */
var checkCollisionWithUpgrade = function(tank, collectableObjects) {
    for (var i = 0; i < collectableObjects.length; i++) {
        var within_x = tank.x > collectableObjects[i].x - TILE_WIDTH / 2 && tank.x < collectableObjects[i].x + TILE_WIDTH / 2;
        var within_y = tank.y > collectableObjects[i].y - TILE_HEIGHT / 2 && tank.y < collectableObjects[i].y + TILE_HEIGHT / 2;
        if (within_x && within_y && !collectableObjects[i].collected) {  // Check that object has not already been collected
            collectableObjects[i].collected = true;
            return true;
        }
        else {
            return false;
        }
    }
};

var checkCollisionWithEnemies = function(tank, enemyObjects) {
    //println("enemyObjects length = " + enemyObjects.length);
    for (var i = 0; i < enemyObjects.length; i++) {
        var within_x = tank.x > round(enemyObjects[i].position.x) - TILE_WIDTH / 2 && tank.x < round(enemyObjects[i].position.x) + TILE_WIDTH / 2;
        var within_y = tank.y > round(enemyObjects[i].position.y) - TILE_HEIGHT * 3 / 2 && tank.y < round(enemyObjects[i].position.y) + TILE_HEIGHT * 3 / 2;
        
        // println("tank.x = " + tank.x + " | i = " + i + " | enemy.x = " + round(enemyObjects[i].position.x));
        // println("tank.y = " + tank.y + " | i = " + i + " | enemy.y = " + round(enemyObjects[i].position.y));

        if (within_x && within_y && !enemyObjects[i].defeated) {  // Check that object has not already been collected
            // Inflict collateral damage
            tank.health--;
            enemyObjects[i].health--;
            return true;

        }
    }
};

/*
 * Pass in an array containing the collectable objects within the game tilemap
 */
var checkCollisionWithBullets = function(tank, collectableObjects) {
    // TODO: 
};

var upgradedObj = function(x, y) {
    this.x = x;
    this.y = y;
    this.movement = 0;
    this.collected = false;
    this.type = ObjectType_e.COLLECTABLE;
};

upgradedObj.prototype.draw = function(m) {
    var numIterations = 8;
    var waitTime = 7;
    var amplititude = 6;
    var div = (m % (waitTime * numIterations)) * -1;
    if (div >= 0 && div < waitTime) {
        this.movement = -amplititude;
    }
    if (div >= waitTime && div < waitTime * 2) {
        this.movement = -(amplititude / 2);
    }
    if (div >= waitTime * 2 && div < waitTime * 3) {
        this.movement = 0;
    }
    if (div >= waitTime * 3 && div < waitTime * 4) {
        this.movement = amplititude / 2;
    }
    if (div >= waitTime * 4 && div < waitTime * 5) {
        this.movement = amplititude;
    }
    if (div >= waitTime * 5 && div < waitTime * 6) {
        this.movement = amplititude / 2;
    }
    if (div >= waitTime * 6 && div < waitTime * 7) {
        this.movement = 0;
    }
    if (div >= waitTime * 7) {
        this.movement = -(amplititude / 2);
    }
    image(Assets_t.PANZER_GUN, this.x, this.y, TILE_WIDTH + this.movement * 3/2, TILE_HEIGHT * 3/2 + this.movement);
};

var tankUpgradedObj = function(x, y, s) {
    this.x = x;
    this.y = y;
    // this.position = new PVector(x, y);
    this.speed = s;
    this.type = ObjectType_e.TANK;

    // Tank Aiming variables
    this.rotationAllowed = false;
    this.currGunAngle = 0;
    this.aimSpeed = 1;  // Aiming time delay in milliseconds
    
    this.bullets = [];
    this.bulletSpeed = -6;
    this.tankShells = [];
    this.laser = new laserObj(this.x, this.y);
    this.laserOn = false;
    this.tankShellSpeed = -10;
    this.autoFireEnabled = false;
    this.prevFrameCount = 0;

    this.health = 1000;
};

tankUpgradedObj.prototype.draw = function(frameCount) {
    var self = this;
    if (DISABLE.W === false) {
        self.y -= self.speed;
    }
    if (DISABLE.S === false) {
        self.y += self.speed;  
    }
    if (DISABLE.D === false && self.x < SCREEN_WIDTH - TILE_WIDTH) {
        self.x += self.speed;
    }
    if (DISABLE.A === false && self.x > 0) {
        self.x -= self.speed;
    }
    if (DISABLE.SPACE === false) {
        self.speed = 5;
    }
    else {
        self.speed = 2;
    }
    image(Assets_t.PANZER, this.x, this.y, TILE_WIDTH, TILE_HEIGHT);

    if (!DISABLE.DOWN) {
        this.autoFireEnabled = !this.autoFireEnabled;  // toggle the auto fire enabled option
        this.autoFireToggled = true;
        this.laserOn = true;
    }
    if (!DISABLE.UP || this.autoFireEnabled) {  // Fire the gun
        if (frameCount % 5 === 0) { 
            this.bullets.push(new bulletObj(this.x + TILE_WIDTH * 2 / 3, this.y, this.bulletSpeed));
        }
        // if (frameCount % 8 === 0) { // TODO: Add more diversity to tank ammunition
        //     this.tankShells.push(new tankShellObj(this.x + TILE_WIDTH / 2, this.y, this.tankShellSpeed));
        // }
        this.laserOn = true;
        this.laser = new laserObj(this.x + TILE_WIDTH / 2, this.y);
    }
    
    // Draw the regular machine gun bullets
    for (var i = 0; i < this.bullets.length; i++) {
        fill(186, 140, 0);
        this.bullets[i].draw();
        if (loopIterations === 0) {  // 1st wave of enemies (1st map iteration)
            this.bullets[i].EnemyCollisionCheck(GAME_INST.enemyObjects);
        }
        else if (loopIterations === 1) {  // 2nd wave of enemies (2nd map iteration)
            this.bullets[i].EnemyCollisionCheck(GAME_INST.enemyObjects2);
        }
    }

    // Aiming (rotation/translation) of the tank gun
    if (!DISABLE.LEFT) {
        this.currGunAngle -= this.aimSpeed;
    }
    if (!DISABLE.RIGHT) {
        this.currGunAngle += this.aimSpeed;
    }
    translate(this.x + TILE_WIDTH / 2, this.y + TILE_HEIGHT / 2);  // Move to the center of rotation
    rotate(radians(this.currGunAngle));
    translate( -(this.x + TILE_WIDTH / 2), -(this.y + TILE_HEIGHT / 2));  // Move back
    image(Assets_t.PANZER_GUN, this.x, this.y, TILE_WIDTH, TILE_HEIGHT);
    
    if (!this.laserOn || this.prevFrameCount === 0) {
        this.prevFrameCount = frameCount;
    }

    if (frameCount - this.prevFrameCount < 16) {
        this.laser.draw( (frameCount - this.prevFrameCount) / 2);
    }
    else {
        this.laser.draw(8);
    }

    if (DISABLE.UP && !this.autoFireEnabled) {  // Ensure laser is properly turned off
        this.laserOn = false;
    }
    
    // TODO: Implement normal tank shell rounds
    // Draw the tank shell rounds
    // for (var i = 0; i < this.tankShells.length; i++) {
    //     this.tankShells[i].draw(this.currGunAngle);
    // }
};



var enemy1Obj = function(x, y) {
    this.position = new PVector(x, y);
    this.step = new PVector(0, 0);
    this.wanderAngle = random(0, 180);
    this.wanderDistance = random(0, 100);
    this.pursueTarget = new PVector(0, 0);
    this.defeated = false;
    this.health = 20;
    this.type = ObjectType_e.ENEMY;
};

enemy1Obj.prototype.draw = function() {
    if (!this.defeated) {
        image(Assets_t.ENEMY1_BASE, this.position.x, this.position.y, TILE_WIDTH, TILE_HEIGHT);
        image(Assets_t.ENEMY_FRONT, this.position.x, this.position.y - TILE_HEIGHT * 3/4, TILE_WIDTH, TILE_HEIGHT);
    }
};

enemy1Obj.prototype.wander = function() {
    this.step.set(cos(this.wanderAngle), sin(this.wanderAngle));
    this.position.add(this.step);
    // this.wanderAngle += random(-15, 15);

    this.wanderDistance--;
    if (this.wanderDistance < 0) {
        this.wanderDistance = random(70, 100);
        this.wanderAngle += random(-90, 90);
    }

    if (this.position.x > 840) {this.position.x = 10;}
    else if (this.position.x < 5) {this.position.x = 800;}
    // if (this.position.y > 520) {this.position.y = -20;}
    // else if (this.position.y < -20) {this.position.y = 520;}
};

var enemy2Obj = function(x, y, s) {
    //this.x = x;
    this.position = new PVector(x, y);
    this.step = new PVector(0, 0);
    this.wanderAngle = random(0, 180);
    this.wanderDistance = random(0, 600);
    this.pursueTarget = new PVector(0, 0);
    this.defeated = false;
    this.health = 40;
    this.type = ObjectType_e.ENEMY;
};

enemy2Obj.prototype.draw = function() {
    if (!this.defeated) {
        image(Assets_t.ENEMY2_BASE, this.position.x, this.position.y, TILE_WIDTH, TILE_HEIGHT);
        image(Assets_t.ENEMY_TURRET, this.position.x, this.position.y, TILE_WIDTH, TILE_HEIGHT);
        image(Assets_t.ENEMY_FRONT, this.position.x, this.position.y - TILE_HEIGHT * 3/4, TILE_WIDTH, TILE_HEIGHT);
    }
    
};

enemy2Obj.prototype.wander = function() {
    this.step.set(cos(this.wanderAngle), sin(this.wanderAngle));
    this.position.add(this.step);
    // this.wanderAngle += random(-15, 15);

    this.wanderDistance--;
    if (this.wanderDistance < 0) {
        this.wanderDistance = random(70, 700);
        this.wanderAngle += random(-90, 90);
    }

    if (this.position.x > 840) {this.position.x = 10;}
    else if (this.position.x < 5) {this.position.x = 800;}
    // if (this.position.y > 520) {this.position.y = -20;}
    // else if (this.position.y < -20) {this.position.y = 520;}
};

var bossEnemy = function(x, y) {
    this.position = new PVector(x, y);
    this.step = new PVector(0, 0);
    this.wanderAngle = random(0, 180);
    this.wanderDistance = random(0, 100);
    this.pursueTarget = new PVector(0, 0);
    this.defeated = false;
    this.health = 500;
    this.type = ObjectType_e.ENEMY;
};

bossEnemy.prototype.draw = function() {
    // TODO:
    // image();
};

var prevTime = 0;
var animation_speed = 15;
var drawStartScreen = function() {
    var time = millis();
    if (time - prevTime < animation_speed * 5) {
        image(GameScreens_t.START_SCREEN[0], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (time - prevTime < animation_speed * 10) {
        image(GameScreens_t.START_SCREEN[1], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (time - prevTime < animation_speed * 15) {
        image(GameScreens_t.START_SCREEN[2], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (time - prevTime < animation_speed * 20) {
        image(GameScreens_t.START_SCREEN[3], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    if (time - prevTime >= animation_speed * 20) {
        prevTime = time;
    }
};

var gameObj = function() {
    // Each tile is 20 x 20 pixels, 
    this.tilemap = [ // TODO: Currently an empty 50x50 tilemap
        "              ",  // row: 1  - 20   px
        "              ",  // row: 2  - 40   px
        "              ",  // row: 3  - 60   px
        "              ",  // row: 4  - 80   px
        "              ",  // row: 5  - 100  px
        "       t      ",  // row: 6  - 120  px
        "              ",  // row: 7  - 140  px
        "              ",  // row: 8  - 160  px
        "              ",  // row: 9  - 180  px
        "              ",  // row: 10 - 200  px
        "          x   ",  // row: 11 - 220  px xxxxx
        "    x         ",  // row: 12 - 240  px xxxxx
        "              ",  // row: 13 - 260  px
        "              ",  // row: 14 - 280  px
        "              ",  // row: 15 - 300  px
        "       t      ",  // row: 16 - 320  px
        "              ",  // row: 17 - 340  px
        "              ",  // row: 18 - 360  px
        "              ",  // row: 19 - 380  px
        "    t      x  ",  // row: 20 - 400  px second t is a x
        "              ",  // row: 21 - 420  px
        "              ",  // row: 22 - 440  px
        "    x         ",  // row: 23 - 460  px  xxxxxx
        "              ",  // row: 24 - 480  px
        "              ",  // row: 25 - 500  px
        "              ",  // row: 26 - 520  px
        "       t      ",  // row: 27 - 540  px
        "              ",  // row: 28 - 560  px
        "              ",  // row: 29 - 580  px
        "              ",  // row: 30 - 600  px
        "          t   ",  // row: 31 - 620  px
        "              ",  // row: 32 - 640  px
        "   x          ",  // row: 33 - 660  px
        "              ",  // row: 34 - 680  px
        "              ",  // row: 35 - 700  px
        "              ",  // row: 36 - 720  px
        "              ",  // row: 37 - 740  px
        "         t    ",  // row: 38 - 760  px
        "              ",  // row: 39 - 780  px
        "              ",  // row: 40 - 800  px
        "              ",  // row: 41 - 820  px
        "     u        ",  // row: 42 - 840  px
        "              ",  // row: 43 - 860  px
        "              ",  // row: 44 - 880  px
        "              ",  // row: 45 - 900  px
        "              ",  // row: 46 - 920  px
        "              ",  // row: 47 - 940  px
        "              ",  // row: 48 - 960  px
        "              ",  // row: 49 - 980  px
        "              ",  // row: 50 - 1000 px
    ];

    this.tilemap2 = [
        "              ",  // row: 1  - 20   px
        "              ",  // row: 2  - 40   px
        " x        t   ",  // row: 3  - 60   px first t is x
        "              ",  // row: 4  - 80   px
        "      x       ",  // row: 5  - 100  px xxxxx
        "              ",  // row: 6  - 120  px
        "              ",  // row: 7  - 140  px
        "              ",  // row: 8  - 160  px
        "    t  t      ",  // row: 9  - 180  px
        "              ",  // row: 10 - 200  px
        "              ",  // row: 11 - 220  px
        "           x  ",  // row: 12 - 240  px  xxxx
        "              ",  // row: 13 - 260  px
        "  x           ",  // row: 14 - 280  px xxxx
        "              ",  // row: 15 - 300  px
        "         t    ",  // row: 16 - 320  px
        "            x ",  // row: 17 - 340  px xxxxx
        "              ",  // row: 18 - 360  px
        "              ",  // row: 19 - 380  px
        "     t     x  ",  // row: 20 - 400  px second t is x
        "              ",  // row: 21 - 420  px
        "              ",  // row: 22 - 440  px
        "              ",  // row: 23 - 460  px
        "              ",  // row: 24 - 480  px
        "              ",  // row: 25 - 500  px
        "              ",  // row: 26 - 520  px
        "         t    ",  // row: 27 - 540  px
        "              ",  // row: 28 - 560  px
        "    x         ",  // row: 29 - 580  px xxxxxx
        "              ",  // row: 30 - 600  px
        "              ",  // row: 31 - 620  px
        "              ",  // row: 32 - 640  px
        "     t        ",  // row: 33 - 660  px
        "              ",  // row: 34 - 680  px
        "          t   ",  // row: 35 - 700  px
        "              ",  // row: 36 - 720  px
        "      x       ",  // row: 37 - 740  px xxxxxx
        "              ",  // row: 38 - 760  px
        "              ",  // row: 39 - 780  px
        "              ",  // row: 40 - 800  px
        "              ",  // row: 41 - 820  px
        "              ",  // row: 42 - 840  px
        "          t   ",  // row: 43 - 860  px
        "              ",  // row: 44 - 880  px
        "              ",  // row: 45 - 900  px
        "   x          ",  // row: 46 - 920  px xxxxx
        "              ",  // row: 47 - 940  px
        "              ",  // row: 48 - 960  px
        "              ",  // row: 49 - 980  px
        "              ",  // row: 50 - 1000 px
    ];
    
    this.gameObjects = [];
    this.enemyObjects = [];
    this.gameObjects2 = [];
    this.enemyObjects2 = [];
    this.yCoor = 0;
    this.xCoor = 0;
    this.score = 0;
    this.scoreMultiplier = 10;
    this.enemyCount = 0;
};

gameObj.prototype.initialize = function() {
    for (var i = 0; i < this.tilemap.length; i++) {
        for (var j = 0; j < this.tilemap[i].length; j++) {
            switch (this.tilemap[i][j]) {
                case 't':
                    this.enemyObjects.push(new enemy1Obj(j*TILE_WIDTH, i*TILE_HEIGHT));
                    break;
                case 'x':
                    this.enemyObjects.push(new enemy2Obj(j*TILE_WIDTH, i*TILE_HEIGHT));
                    break;
                case 'u':
                    this.gameObjects.push(new upgradedObj(j*TILE_WIDTH, i*TILE_HEIGHT));
                    break;
            }
        }
    }
    for (var i = 0; i < this.tilemap2.length; i++) {  // initialize 2nd iteration of the tilemap for the 2nd repeat 
        for (var j = 0; j < this.tilemap2[i].length; j++) {
            switch (this.tilemap2[i][j]) {
                case 't':
                    this.enemyObjects2.push(new enemy1Obj(j*TILE_WIDTH, i*TILE_HEIGHT));
                    break;
                case 'x':
                    this.enemyObjects2.push(new enemy2Obj(j*TILE_WIDTH, i*TILE_HEIGHT));
                    break;
            }
        }
    }
};

/*
var displayScore = function() {
    fill(255, 50, 50);
    textSize(18);
    text("Score = " + (GAME_INST.score * 10), 170, 320);
};

var displayCredits = function() {
    fill(225, 225, 225);
    textSize(14);
    text("Artwork by Alex Shammas", 20, 360);
    text("Code by Joey Rodgers", 20, 380);
}
*/

var createTank = function(x, y, s, tankType) {
    if (tankType === TankOptions_e.BASIC) {
        return new tankObj(x, y, s);
    }
    else if (tankType === TankOptions_e.UPGRADED) {
        return new tankUpgradedObj(x, y, s);
    }
};

gameObj.prototype.drawLevelOne = function(y, loopIteration) {
    image(GameScreens_t.LEVEL_ONE, this.xCoor, this.yCoor);
    if (loopIteration === 0) {  // First iteration
        for (var i = 0; i < GAME_INST.enemyObjects.length; i++) { // enemy objects
            GAME_INST.enemyObjects[i].draw();
            GAME_INST.enemyObjects[i].wander();
        }
        for (var i = 0; i < GAME_INST.gameObjects.length; i++) { // collectable objects
            if (!GAME_INST.gameObjects[i].collected) {
                GAME_INST.gameObjects[i].draw(y);
            }
        }
    }
    else if (loopIteration === 1) {
        for (var i = 0; i < GAME_INST.enemyObjects2.length; i++) { // enemy objects
            GAME_INST.enemyObjects2[i].draw();
            GAME_INST.enemyObjects2[i].wander();
        }
        for (var i = 0; i < GAME_INST.gameObjects2.length; i++) { // collectable objects
            if (!GAME_INST.gameObjects[i].collected) {
                GAME_INST.gameObjects2[i].draw(y);
            }
        }
    }
};

/*
 * Pass in a loop counter to track how many loop passes have been made
 */
var animatedLoadTransition = function(y) {

};

/*
 * Pass in a loop counter to track how many loop passes have been made
 */
prevTime = 0;
var animationLength = 5;
var numHelpAnimationFrames = 6;
var animatedHelpTransition = function(animationCount) {
    if (animationCount < animationLength) {
        image(GameScreens_t.HELP_SCREEN_TRANSITIONS[0], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= animationLength * 1 && animationCount < animationLength * 2) {
        image(GameScreens_t.HELP_SCREEN_TRANSITIONS[1], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= animationLength * 2 && animationCount < animationLength * 3) {
        image(GameScreens_t.HELP_SCREEN_TRANSITIONS[2], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= animationLength * 3 && animationCount < animationLength * 4) {
        image(GameScreens_t.HELP_SCREEN_TRANSITIONS[3], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= animationLength * 4 && animationCount < animationLength * 5) {
        image(GameScreens_t.HELP_SCREEN_TRANSITIONS[4], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= animationLength * 5 && animationCount < animationLength * 6) {
        image(GameScreens_t.HELP_SCREEN_TRANSITIONS[5], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
};


// Simple structure to track the current state of the mouse clicks
var MouseState = {
    PRESSED: 0,
};

var mousePressed = function() {
    MouseState.PRESSED = 1;
};

var mouseReleased = function() {
    MouseState.PRESSED = 0;
};

// Initialize the game state to the start screen/main menu
var changeGameState = function(GameState) {
    CURRENT_GAME_STATE = GameState;
};

var translationX, translationY;
var animatedLoadTransition = function() {
    _ms_delay = 100;
    var i = 0;
    for (; i <= SCREEN_WIDTH; i++) {
        setTimeout( // Attempted a delay for the animation
            function() {
                pushMatrix();
                translate(SCREEN_WIDTH - i, 0);
                image(GameScreens_t.ANIMATION, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
                popMatrix(); 
            }, 
            _ms_delay); // end setTimeout
    }
};

var drawHelpScreen = function(frameCount) {
    image(GameScreens_t.HELP_SCREEN, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);  // Main instruction screen
    if ((frameCount % HelpSpeedOptions_e.MEDIUM) * -1 <= HelpSpeedOptions_e.MEDIUM / 2) {  // Back Arrow blink functionality
        image(GameScreens_t.HELP_SCREEN_BACK_BUTTON, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
};


var GAME_INST = new gameObj();
var CURRENT_GAME_STATE = GameState_e.START_SCREEN;
GAME_INST.initialize();

var tankSpeed = 3;
var loopCount = -3400;
var panzer = createTank(SCREEN_WIDTH/2 - TILE_WIDTH/2, -loopCount + SCREEN_HEIGHT*2/3, tankSpeed, TankOptions_e.BASIC);
var upgradeCollected = false;
var tankUpgraded = false;
var animationFinished = false;
var animationCount = 0;
var fontSize = 48;
var loopIterations = 0;

// Setup the FSM within this function
var draw = function() {
    switch(CURRENT_GAME_STATE) {
        case GameState_e.START_SCREEN:
            drawStartScreen();
            if (MouseState.PRESSED && mouseX < 303 && mouseX > 0 && mouseY < 164 && mouseY > 64) {
                changeGameState(GameState_e.ANIMATED_LOAD_TRANSITION);
                MouseState.PRESSED = 0;  // Force a click release
            }
            if (MouseState.PRESSED && mouseX < 215 && mouseX > 0 && mouseY < 270 && mouseY > 196) {
                changeGameState(GameState_e.ANIMATED_HELP_TRANSITION);
                MouseState.PRESSED = 0;  // Force a click release
            }
            break;
        case GameState_e.ANIMATED_LOAD_TRANSITION:  // TODO: for transition to each of the levels
            println("Some animation to load level one for a smoother transition.");
            //animatedLoadTransition();
            changeGameState(GameState_e.LEVEL_ONE);
            break;
        case GameState_e.LEVEL_ONE:
            pushMatrix();
            translate(0, loopCount);
            GAME_INST.drawLevelOne(loopCount, loopIterations);

            // Implement constantly scrolling background
            // TODO: Make use of this repeated scrolling by creating 2 - 3 different tilemaps overlayed on the same background
            // This way, we have more variety to our levels and extended length without the extra overhead of a longer background image
            loopCount++;
            if (loopCount > 0) { 
                loopCount = -3400;
                panzer.y -= loopCount;
                loopIterations++;
            }
            
            // Win Condition!  
            if (loopIterations === 2) {  // TODO: Work on win screen improvements
                changeGameState(GameState_e.WIN_SCREEN);
            }

            // TODO:  Display character's health
            stroke()
            fill(230, 30, 30);
            textSize(14);
            text("HEALTH: " + panzer.health, 10, -loopCount + SCREEN_HEIGHT * 1 / 20);
            noStroke();
            
            if (loopIterations === 0) {  // 1st wave of enemies (1st map iteration)
                checkCollisionWithEnemies(panzer, GAME_INST.enemyObjects);
            }
            else if (loopIterations === 1) {  // 2nd wave of enemies (2nd map iteration)
                checkCollisionWithEnemies(panzer, GAME_INST.enemyObjects2);
            }

            // Main functionality of the panzer tank
            panzer.draw(loopCount);
            
            // Lose Condition...  (Health is fully decremented and tank is dead)
            if (panzer.health <= 0) {  // TODO: Work on lose screen improvements
                changeGameState(GameState_e.LOSE_SCREEN);
            }

            // Check upgraded case
            upgradeCollected = checkCollisionWithUpgrade(panzer, GAME_INST.gameObjects);
            if (upgradeCollected && !tankUpgraded) {  // Upgrade collected!
                var autoFireEnabled = panzer.autoFireEnabled;
                var currentHealth = panzer.health;
                panzer = createTank(panzer.x, panzer.y, tankSpeed, TankOptions_e.UPGRADED);
                panzer.autoFireEnabled = autoFireEnabled;  // Remember state of the previous tank
                panzer.health = currentHealth;  // Update the upgraded tanks health 
                tankUpgraded = true;  // Ensure only 1x execution of this logic
            }

            popMatrix();
            break;
        case GameState_e.LEVEL_TWO:  // TODO: 1st level
            println("TODO: LEVEL_TWO");
            break;
        case GameState_e.LEVEL_THREE:  // TODO: 2nd level
            println("TODO: LEVEL_THREE");
            break;
        case GameState_e.ANIMATED_HELP_TRANSITION:
            animatedHelpTransition(animationCount);
            if (animationCount >= animationLength * numHelpAnimationFrames) {
                //println("loopCount = " + loopCount);
                //animationCount = 0;  // reset the animation count
                changeGameState(GameState_e.HELP_SCREEN);
            }
            animationCount++;
            break;
        case GameState_e.HELP_SCREEN:  // COMPLETED:  Transition from the main menu to the help screen
            drawHelpScreen(loopCount);
            //println("mouseX = " + mouseX + " | mouseY = " + mouseY);
            var mouseInArrow = MouseState.PRESSED && mouseX < 675 && mouseX > 574 && mouseY < 587 && mouseY > 490;
            var mouseInArrowStem = MouseState.PRESSED && mouseX < 575 && mouseX > 523 && mouseY < 556 && mouseY > 524;
            if (mouseInArrow || mouseInArrowStem) {
                //animationCount = animationLength *
                changeGameState(GameState_e.ANIMATED_MENU_TRANSITION);
                MouseState.PRESSED = 0;  // Force a click release
            }
            loopCount++;
            //drawInstructions();
            break;
        case GameState_e.ANIMATED_MENU_TRANSITION:  // COMPLETED:  Transition back to the main menu
            animatedHelpTransition(animationCount);
            if (animationCount <= 0) {
                //println("loopCount = " + loopCount);
                //animationCount = 0;  // reset the animation count
                changeGameState(GameState_e.START_SCREEN);
            }
            animationCount--;
            break;
        case GameState_e.CREDITS:  // TODO:  End credits
            println("TODO: CREDITS");
            break;
        case GameState_e.ANIMATED_LOSE_TRANSITION:  // TODO: Animate transition to lose screen
            println("TODO: ANIMATED_LOSE_TRANSITION");
            break;
        case GameState_e.LOSE_SCREEN:  // TEMPORARY: Placeholder lose screen for win condition
            background(0, 0, 0);
            fill(255, 255, 255);
            textSize(fontSize);
            text("YOU LOSE!!! :(", 200, 280);
            println("TEMPORARY: LOSE_SCREEN");
            break;
        case GameState_e.ANIMATED_WIN_TRANSITION:  // TODO: Animate transition to win screen
            println("TODO: ANIMATED_WIN_TRANSITION");
            break;
        case GameState_e.WIN_SCREEN:  // TEMPORARY: Placeholder win screen for win condition
            background(0, 0, 0);
            stroke()
            fill(255, 255, 255);
            textSize(fontSize);
            text("YOU WIN!!!", 200, 280);
            noStroke();
            println("TEMPORARY: WIN_SCREEN");
            break;
        default:  // Default case should not be hit.  Here for debugging purposes only...
            // drawEnemy1();
            // drawEnemy2();
            // drawEnemy3();
            // drawEnemy4();
            // drawTank();
            console.debug("Error: Default game state hit!");
            println("Error: Default game state hit!");
            break;
    } // End switch
};


}};
