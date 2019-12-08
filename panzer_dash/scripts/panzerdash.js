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
var TILE_MAP_LENGTH = 50;

// TODO: Redo preloading assets
// Preload necessary game assets by using Processing's preload directive
/*
    @pjs 
    preload =
        '../assets/menu_screens/main_menu1.jpg',
        '../assets/menu_screens/main_menu2.jpg',
        '../assets/menu_screens/main_menu3.jpg',
        '../assets/menu_screens/main_menu4.jpg',
        '../assets/win_screens/win1.jpg',
        '../assets/win_screens/win2.jpg',
        '../assets/win_screens/win3.jpg',
        '../assets/win_screens/win4.jpg',
        '../assets/win_screens/win5.jpg',
        '../assets/win_screens/win6.jpg',
        '../assets/win_screens/win7.jpg',
        '../assets/win_screens/win8.jpg',
        '../assets/win_screens/win8.jpg',
        '../assets/win_screens/win9.jpg',
        '../assets/win_screens/win10.jpg',
        '../assets/win_screens/win11.jpg',
        '../assets/win_screens/win12.jpg',
        '../assets/win_screens/win13.jpg',
        '../assets/win_screens/win14.jpg',
        '../assets/win_screens/win15.jpg',
        '../assets/win_screens/win16.jpg',
        '../assets/win_screens/win17.jpg',
        '../assets/win_screens/win18.jpg',
        '../assets/win_screens/win19.jpg',
        '../assets/win_screens/win20.jpg',
        '../assets/win_screens/win21.jpg',
        '../assets/win_screens/win22.jpg',
        '../assets/win_screens/win23.jpg',
        '../assets/win_screens/win24.jpg',
        '../assets/lose_screens/lose1.png',
        '../assets/lose_screens/lose2.png',
        '../assets/lose_screens/lose3.png',
        '../assets/lose_screens/lose4.png',
        '../assets/lose_screens/lose5.png',
        '../assets/lose_screens/lose6.png',
        '../assets/lose_screens/lose7.png',
        '../assets/lose_screens/lose8.png',
        '../assets/help_screens/help_transition1.jpg',
        '../assets/help_screens/help_transition2.jpg',
        '../assets/help_screens/help_transition3.jpg',
        '../assets/help_screens/help_transition4.jpg',
        '../assets/help_screens/help_transition5.jpg',
        '../assets/help_screens/help_transition6.jpg',
        '../assets/help_screens/help_screen.jpg',
        '../assets/help_screens/back_button.png',
        '../assets/map_levels/level_one_bg.jpg',
        '../assets/map_levels/level_two_bg.jpg',
        '../assets/map_levels/level_three_bg.jpg',
        '../assets/pickups/pickup_health.png',
        '../assets/pickups/pickup_shotgun.png',
        '../assets/pickups/pickup_rapidfire.png',
        '../assets/enemies/enemy1_base.png',
        '../assets/enemies/enemy1_front.png',
        '../assets/enemies/enemy2_base.png',
        '../assets/enemies/enemy2_turret.png',
        '../assets/enemies/enemy3_base.png',
        '../assets/enemies/enemy3_turret.png',
        '../assets/enemies/enemy4_base.png',
        '../assets/enemies/enemy4_turret.png',
        '../assets/enemies/boss_base.png',
        '../assets/enemies/boss_front.png',
        '../assets/main_character/tank_body.png',
        '../assets/main_character/tank_gun.png',
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
    // Game Screen transitions to be stored in arrays to simplify iteration for animation creation
    START_SCREEN: [
        // Main Menu Screen (animation consists of a looping iteration of the following .jpg files in order)
        loadImage('../assets/menu_screens/main_menu1.jpg'),
        loadImage('../assets/menu_screens/main_menu2.jpg'),
        loadImage('../assets/menu_screens/main_menu3.jpg'),
        loadImage('../assets/menu_screens/main_menu4.jpg'),
    ],
    WIN_SCREEN_TRANSITIONS: [
        loadImage('../assets/win_screens/win1.jpg'),
        loadImage('../assets/win_screens/win2.jpg'),
        loadImage('../assets/win_screens/win3.jpg'),
        loadImage('../assets/win_screens/win4.jpg'),
        loadImage('../assets/win_screens/win5.jpg'),
        loadImage('../assets/win_screens/win6.jpg'),
        loadImage('../assets/win_screens/win7.jpg'),
        loadImage('../assets/win_screens/win8.jpg'),
        loadImage('../assets/win_screens/win9.jpg'),
        loadImage('../assets/win_screens/win10.jpg'),
        loadImage('../assets/win_screens/win11.jpg'),
        loadImage('../assets/win_screens/win12.jpg'),
        loadImage('../assets/win_screens/win13.jpg'),
        loadImage('../assets/win_screens/win14.jpg'),
        loadImage('../assets/win_screens/win15.jpg'),
        loadImage('../assets/win_screens/win16.jpg'),
        loadImage('../assets/win_screens/win17.jpg'),
        loadImage('../assets/win_screens/win18.jpg'),
        loadImage('../assets/win_screens/win19.jpg'),
        loadImage('../assets/win_screens/win20.jpg'),
        loadImage('../assets/win_screens/win21.jpg'),
        loadImage('../assets/win_screens/win22.jpg'),
        loadImage('../assets/win_screens/win23.jpg'),
        loadImage('../assets/win_screens/win24.jpg'),
    ], 
    LOSE_SCREEN_TRANSITIONS: [
        loadImage('../assets/lose_screens/lose1.png'),
        loadImage('../assets/lose_screens/lose2.png'),
        loadImage('../assets/lose_screens/lose3.png'),
        loadImage('../assets/lose_screens/lose4.png'),
        loadImage('../assets/lose_screens/lose5.png'),
        loadImage('../assets/lose_screens/lose6.png'),
        loadImage('../assets/lose_screens/lose7.png'),
        loadImage('../assets/lose_screens/lose8.png'),
    ],
    HELP_SCREEN_TRANSITIONS: [
        loadImage('../assets/help_screens/help_transition1.jpg'),
        loadImage('../assets/help_screens/help_transition2.jpg'),
        loadImage('../assets/help_screens/help_transition3.jpg'),
        loadImage('../assets/help_screens/help_transition4.jpg'),
        loadImage('../assets/help_screens/help_transition5.jpg'),
        loadImage('../assets/help_screens/help_transition6.jpg'),
    ],
    HELP_SCREEN:             loadImage('../assets/help_screens/help_screen.jpg'),
    HELP_SCREEN_BACK_BUTTON: loadImage('../assets/help_screens/back_button.png'),
    LEVEL_ONE:               loadImage('../assets/map_levels/level_one_bg.jpg'),
    LEVEL_TWO:               loadImage('../assets/map_levels/level_two_bg.jpg'),
    LEVEL_THREE:             loadImage('../assets/map_levels/level_three_bg.jpg'),
};

// Load other assets in this 'struct'
var Assets_t = { 
    // Main character(s)
    PANZER:     loadImage('../assets/main_character/tank_body.png'),
    PANZER_GUN: loadImage('../assets/main_character/tank_gun.png'),

    // Enemy character(s)
    ENEMY1_BASE:   loadImage('../assets/enemies/enemy1_base.png'),
    ENEMY_FRONT:   loadImage('../assets/enemies/enemy1_front.png'),
    ENEMY2_BASE:   loadImage('../assets/enemies/enemy2_base.png'),
    ENEMY_TURRET:  loadImage('../assets/enemies/enemy2_turret.png'),
    ENEMY3_BASE:   loadImage('../assets/enemies/enemy3_base.png'),
    ENEMY3_TURRET: loadImage('../assets/enemies/enemy3_turret.png'),
    ENEMY4_BASE:   loadImage('../assets/enemies/enemy4_base.png'),
    ENEMY4_TURRET: loadImage('../assets/enemies/enemy4_turret.png'),
    BOSS1_BASE:    loadImage('../assets/enemies/boss_base.png'),
    BOSS1_FRONT:   loadImage('../assets/enemies/boss_front.png'),

    // Main character upgrades
    SHOT_GUN_PICKUP: loadImage('../assets/pickups/pickup_shotgun.png'),
    MINI_GUN_PICKUP: loadImage('../assets/pickups/pickup_rapidfire.png'),
    HEALTH_PICKUP:   loadImage('../assets/pickups/pickup_health.png'),
};

var TankOptions_e = {
    BASIC: 0,
    UPGRADED: 1,
};

var ObjectType_e = {
    BASIC_GUN: 0,  // collectable
    HEALTH: 1, // collectable
    SHOT_GUN: 2, // collectable
    MINI_GUN: 3, // collectable
    TANK: 4,
    ENEMY: 5,
};

var UpgradeTypes_e = {
    BASIC_GUN: 0,
    SHOT_GUN: 1,
    MINI_GUN: 2,
    HEALTH: 3,
};

// Var with enum behavior to provide speed options for the help 
// transition animation
var HelpSpeedOptions_e = {
    FAST: 30,
    MEDIUM: 60,
    SLOW: 90,
};

// -------------- Define key press state structure and related functions ----------------
var keyState = {
    PRESSED: 0,
};

// Define what happens on a key press event 
// Automatically called on key press as a part of processingJS
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

// Define what happens on a key release event 
// Automatically called on key release as a part of processingJS
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
        DISABLE.LEFT = true;
    }
    if (keyCode === RIGHT) {
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

// Structure to handle keypress states
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

var shotBulletObj = function(x, y, s) {
    this.pos1 = new PVector(x - 1, y);
    this.pos2 = new PVector(x, y);
    this.pos3 = new PVector(x + 1, y);
    this.w = 5;
    this.l = 5;
    this.spreadWidth = 2;
    this.speed1 = new PVector(-this.spreadWidth, s);
    this.speed2 = new PVector(0, s);
    this.speed3 = new PVector(this.spreadWidth, s);
    this.damage = 2;
    this.hit1 = 0;
    this.hit2 = 0;
    this.hit3 = 0;
}

shotBulletObj.prototype.draw = function(c) {
    fill(31, 31, 24);
    if (this.hit1 === 0) {
        rect(this.pos1.x - this.w / 2, this.pos1.y, this.w, this.l);
        ellipse(this.pos1.x, this.pos1.y, this.w, this.w);
        this.pos1.add(this.speed1);
    }

    if (this.hit2 === 0) {
        rect(this.pos2.x - this.w / 2, this.pos2.y, this.w, this.l);
        ellipse(this.pos2.x, this.pos2.y, this.w, this.w);
        this.pos2.add(this.speed2);
    }

    if (this.hit3 === 0) {
        rect(this.pos3.x - this.w / 2, this.pos3.y, this.w, this.l);
        ellipse(this.pos3.x, this.pos3.y, this.w, this.w);
        this.pos3.add(this.speed3);
    }
}

var bulletObj = function(x, y, s) {
    this.position = new PVector(x, y);
    this.w = 4;  // width
    this.l = 7;  // length
    this.speed = new PVector(0, s);
    this.damage = 2;
    this.hit = 0;
};

bulletObj.prototype.draw = function(c) {
    if(this.hit === 0) {
        noStroke();
        if (c === 1)
        {
            fill(122, 120, 113);
            rect(this.position.x - (this.w*2) / 2, this.position.y, (this.w*2), (2*this.l));
            ellipse(this.position.x, this.position.y, (2*this.w), (2*this.w));
        }
        else
        {
            fill(31, 31, 24);
            rect(this.position.x - this.w / 2, this.position.y, this.w, this.l);
            ellipse(this.position.x, this.position.y, this.w, this.w);
        }
        this.position.add(this.speed);
    }
};

bulletObj.prototype.EnemyCollisionCheck = function(enemyList) {
    for (var i = 0; i < enemyList.length; i++) {
        var within_x = this.position.x > round(enemyList[i].position.x) && this.position.x < round(enemyList[i].position.x) + TILE_WIDTH;
        var within_y = this.position.y > round(enemyList[i].position.y) - TILE_HEIGHT && this.position.y < round(enemyList[i].position.y) + TILE_HEIGHT;

        if (within_x && within_y && !enemyList[i].defeated && this.hit !== 1) {  // Check that object has not already been collected
            // Inflict collateral damage
            enemyList[i].health -= this.damage;
            // case where an emeny is killed
            if (enemyList[i].health < 1) {
                enemyList[i].defeated = true;
                GAME_INST.score++;
            }
            this.hit = 1;
        }
    }
};

shotBulletObj.prototype.EnemyCollisionCheck = function(enemyList) {
    for (var i = 0; i < enemyList.length; i++) {
        var within_x = this.pos1.x > round(enemyList[i].position.x) && this.pos1.x < round(enemyList[i].position.x) + TILE_WIDTH;
        var within_y = this.pos1.y > round(enemyList[i].position.y) - TILE_HEIGHT && this.pos1.y < round(enemyList[i].position.y) + TILE_HEIGHT;
        
        // Check bullet 1 collision
        if (within_x && within_y && !enemyList[i].defeated && this.hit1 !== 1) {  
            enemyList[i].health -= this.damage;
            if (enemyList[i].health < 1) {
                enemyList[i].defeated = true;
                GAME_INST.score++;
            }
            this.hit1 = 1;
        }
        
        // update the x and y collision boolean values
        within_x = this.pos2.x > round(enemyList[i].position.x) && this.pos2.x < round(enemyList[i].position.x) + TILE_WIDTH;
        within_y = this.pos2.y > round(enemyList[i].position.y) - TILE_HEIGHT && this.pos2.y < round(enemyList[i].position.y) + TILE_HEIGHT;
        
        // Check bullet 2 collision
        if (within_x && within_y && !enemyList[i].defeated && this.hit2 !== 1) {  
            enemyList[i].health -= this.damage;
            if (enemyList[i].health < 1) {
                enemyList[i].defeated = true;
                GAME_INST.score++;
            }
            this.hit2 = 1;
        }
        
        // update the x and y collision boolean values
        within_x = this.pos3.x > round(enemyList[i].position.x) && this.pos3.x < round(enemyList[i].position.x) + TILE_WIDTH;
        within_y = this.pos3.y > round(enemyList[i].position.y) - TILE_HEIGHT && this.pos3.y < round(enemyList[i].position.y) + TILE_HEIGHT;

        // Check bullet 3 collision
        if (within_x && within_y && !enemyList[i].defeated && this.hit3 !== 1) { 
            enemyList[i].health -= this.damage;
            if (enemyList[i].health < 1) {
                enemyList[i].defeated = true;
                GAME_INST.score++;
            }
            this.hit3 = 1;
        }
    }
};

bulletObj.prototype.TankCollsionCheck = function() {
    var within_x = round(this.position.x) > panzer.x && round(this.position.x) < panzer.x + TILE_WIDTH;
    var within_y = round(this.position.y) > (panzer.y)&& round(this.position.y) < panzer.y + TILE_HEIGHT;
    var t = dist(round(this.position.x), round(this.position.y), panzer.x+ TILE_WIDTH, panzer.y) < 30;

    if (within_x && within_y && (this.hit !== 1)) {
        panzer.health-= this.damage;
        this.hit = 1;
        within_x = false;
        return;
    }
}

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
    this.fireRate = 8;
    this.autoFireEnabled = false;
    this.health = 100;
    this.objectType = ObjectType_e.TANK;
    this.miniGunEnabled = false;
    this.shotGunEnabled = false;
};

tankObj.prototype.draw = function(frameCount, currentLevel) {
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
        self.speed = 4;
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
            if (!this.shotGunEnabled && !this.miniGunEnabled) {
                this.bullets.push(new bulletObj(this.x + TILE_WIDTH * 2 / 3, this.y, this.bulletSpeed));
            }
            else if (this.shotGunEnabled) {
                this.bullets.push(new shotBulletObj(this.x + TILE_WIDTH * 2 / 3, this.y, this.bulletSpeed));
            }
            if (this.miniGunEnabled) {
                this.fireRate = 2;
            }
        }   
    }

    if (frameCount % 5 === 0) { // TODO: Better implementation of the autofire delayed needed
        this.autoFireToggled = false;
    }

    image(Assets_t.PANZER, self.x, self.y, TILE_WIDTH, TILE_HEIGHT);
    for (var i = 0; i < this.bullets.length; i++) {
        this.bullets[i].draw(0);

        if (loopIterations === 0 && currentLevel === GameState_e.LEVEL_ONE) { // Level 1: 1st wave of enemies (1st map iteration)
            this.bullets[i].EnemyCollisionCheck(GAME_INST.enemyObjects);
        }
        else if (loopIterations === 0 && currentLevel === GameState_e.LEVEL_TWO) { // Level 2: 1st wave of enemies (1st map iteration)
            this.bullets[i].EnemyCollisionCheck(GAME_INST.enemyObjects3);
        }
        else if (loopIterations === 0 && currentLevel === GameState_e.LEVEL_THREE) { // Level 3: 1st wave of enemies (1st map iteration)
            this.bullets[i].EnemyCollisionCheck(GAME_INST.enemyObjects5);
        }
        else if (loopIterations === 1 && currentLevel === GameState_e.LEVEL_ONE) { // Level 1: 2nd wave of enemies (2nd map iteration)
            this.bullets[i].EnemyCollisionCheck(GAME_INST.enemyObjects2);
        }
        else if (loopIterations === 1 && currentLevel === GameState_e.LEVEL_TWO) { // Level 2: 2nd wave of enemies (2nd map iteration)
            this.bullets[i].EnemyCollisionCheck(GAME_INST.enemyObjects4);
        }
        else if (loopIterations === 1 && currentLevel === GameState_e.LEVEL_THREE) { // Level 3: 2nd wave of enemies (2nd map iteration)
            this.bullets[i].EnemyCollisionCheck(GAME_INST.enemyObjects6);
        }

        // Make sure to keep the array at a manageable iteration size so as to not bog down the game
        if (this.bullets.length > 100) {
            this.bullets.splice(0, 1);
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
            return collectableObjects[i].objectType;
        }
        // else {
        //     return false;
        // }
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
            tank.health -= 1;
            enemyObjects[i].health -= 1;

            if (enemyObjects[i].health < 0) {
                enemyObjects[i].defeated = true
                GAME_INST.score++;
            }
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
    this.objectType = ObjectType_e.BASIC_GUN;
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
    image(
        Assets_t.PANZER_GUN, 
        this.x, 
        this.y, 
        TILE_WIDTH + this.movement * 3/2, 
        TILE_HEIGHT * 3/2 + this.movement);
};

var healthPickUp = function(x, y) {
    this.x = x;
    this.y = y;
    this.movement = 0;
    this.collected = false;
    this.objectType = ObjectType_e.HEALTH;
};

healthPickUp.prototype.draw = function(m) {
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
    image(
        Assets_t.HEALTH_PICKUP, 
        this.x, 
        this.y, 
        TILE_WIDTH * 2 / 3 + this.movement, 
        TILE_HEIGHT * 2 / 3 + this.movement);
};

var shotGunPickUp = function(x, y) {
    this.x = x;
    this.y = y;
    this.movement = 0;
    this.collected = false;
    this.objectType = ObjectType_e.SHOT_GUN;
};

shotGunPickUp.prototype.draw = function(m) {
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
    image(
        Assets_t.SHOT_GUN_PICKUP, 
        this.x, 
        this.y, 
        TILE_WIDTH * 2 / 3 + this.movement, 
        TILE_HEIGHT * 2 / 3 + this.movement);
};

var miniGunPickUp = function(x, y) {
    this.x = x;
    this.y = y;
    this.movement = 0;
    this.collected = false;
    this.objectType = ObjectType_e.MINI_GUN;
};

miniGunPickUp.prototype.draw = function(m) {
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
    image(
        Assets_t.MINI_GUN_PICKUP, 
        this.x, 
        this.y, 
        TILE_WIDTH * 2 / 3 + this.movement, 
        TILE_HEIGHT * 2 / 3 + this.movement);
};

var tankUpgradedObj = function(x, y, s) {
    this.x = x;
    this.y = y;
    // this.position = new PVector(x, y);
    this.speed = s;
    this.objectType = ObjectType_e.TANK;

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
    this.fireRate = 8;

    this.health = 100;
    this.miniGunEnabled = false;
    this.shotGunEnabled = false;
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
        if (frameCount % this.fireRate === 0) {
            if (!this.shotGunEnabled && !this.miniGunEnabled) {
                this.bullets.push(new bulletObj(this.x + TILE_WIDTH * 2 / 3, this.y, this.bulletSpeed));
            }
            else if (this.shotGunEnabled) {
                this.bullets.push(new shotBulletObj(this.x + TILE_WIDTH * 2 / 3, this.y, this.bulletSpeed));
            }
            if (this.miniGunEnabled) {
                this.fireRate = 2;
            }
        }   
        // if (frameCount % 5 === 0) { 
        //     this.bullets.push(new bulletObj(this.x + TILE_WIDTH * 2 / 3, this.y, this.bulletSpeed));
        // }
        // if (frameCount % 8 === 0) { // TODO: Add more diversity to tank ammunition
        //     this.tankShells.push(new tankShellObj(this.x + TILE_WIDTH / 2, this.y, this.tankShellSpeed));
        // }
        this.laserOn = true;
        this.laser = new laserObj(this.x + TILE_WIDTH / 2, this.y);
    }
    
    // Draw the regular machine gun bullets
    for (var i = 0; i < this.bullets.length; i++) {
        fill(186, 140, 0);
        this.bullets[i].draw(0);
        if (loopIterations === 0 && currentLevel === GameState_e.LEVEL_ONE) { // Level 1: 1st wave of enemies (1st map iteration)
            this.bullets[i].EnemyCollisionCheck(GAME_INST.enemyObjects);
        }
        else if (loopIterations === 0 && currentLevel === GameState_e.LEVEL_TWO) { // Level 2: 1st wave of enemies (1st map iteration)
            this.bullets[i].EnemyCollisionCheck(GAME_INST.enemyObjects3);
        }
        else if (loopIterations === 0 && currentLevel === GameState_e.LEVEL_THREE) { // Level 3: 1st wave of enemies (1st map iteration)
            this.bullets[i].EnemyCollisionCheck(GAME_INST.enemyObjects5);
        }
        else if (loopIterations === 1 && currentLevel === GameState_e.LEVEL_ONE) { // Level 1: 2nd wave of enemies (2nd map iteration)
            this.bullets[i].EnemyCollisionCheck(GAME_INST.enemyObjects2);
        }
        else if (loopIterations === 1 && currentLevel === GameState_e.LEVEL_TWO) { // Level 2: 2nd wave of enemies (2nd map iteration)
            this.bullets[i].EnemyCollisionCheck(GAME_INST.enemyObjects4);
        }
        else if (loopIterations === 1 && currentLevel === GameState_e.LEVEL_THREE) { // Level 3: 2nd wave of enemies (2nd map iteration)
            this.bullets[i].EnemyCollisionCheck(GAME_INST.enemyObjects6);
        }

        // Make sure to keep the array at a manageable iteration size so as to not bog down the game
        if (this.bullets.length > 100) {
            this.bullets.splice(0, 1);
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
    this.health = 14;
    this.objectType = ObjectType_e.ENEMY;
};

enemy1Obj.prototype.draw = function() {
    if (!this.defeated) {
        image(Assets_t.ENEMY1_BASE, this.position.x, this.position.y, TILE_WIDTH, TILE_HEIGHT);
        image(Assets_t.ENEMY_FRONT, this.position.x, this.position.y - TILE_HEIGHT * 3/4, TILE_WIDTH, TILE_HEIGHT);
    }
};

enemy1Obj.prototype.wander = function() {
    this.step.set(cos(this.wanderAngle), sin(this.wanderAngle));
    var oldY = this.position.y;
    this.position.add(this.step);
    // this.wanderAngle += random(-15, 15);

    this.wanderDistance--;
    if (this.wanderDistance < 0) {
        this.wanderDistance = random(70, 100);
        this.wanderAngle += random(-90, 90);
    }

    if (this.position.x > 840) {this.position.x = 10;}
    else if (this.position.x < 5) {this.position.x = 800;}
    if (this.position.y > (oldY + 30)) {this.position.y = (oldY - 30);}
    else if (this.position.y < (oldY - 30)) {this.position.y = (oldY + 30);}
};

var enemy2Obj = function(x, y, s) {
    //this.x = x;
    this.position = new PVector(x, y);
    this.step = new PVector(0, 0);
    this.wanderAngle = random(0, 180);
    this.wanderDistance = random(0, 600);
    this.pursueTarget = new PVector(0, 0);
    this.defeated = false;
    this.health = 22;
    this.bullets = [];
    this.objectType = ObjectType_e.ENEMY;
};

enemy2Obj.prototype.draw = function() {
    if (!this.defeated) {
        image(Assets_t.ENEMY2_BASE, this.position.x, this.position.y, TILE_WIDTH, TILE_HEIGHT);
        image(Assets_t.ENEMY_TURRET, this.position.x, this.position.y, TILE_WIDTH, TILE_HEIGHT);
        image(Assets_t.ENEMY_FRONT, this.position.x, this.position.y - TILE_HEIGHT * 3 / 4, TILE_WIDTH, TILE_HEIGHT);

        // add bullet to bullet list
        if (loopCount % 200 === 0) {
            this.bullets.push(new bulletObj(this.position.x + TILE_WIDTH * 2 / 3 , this.position.y + TILE_HEIGHT, 6));
        }

        for (var i = 0; i < this.bullets.length; i++) {
            this.bullets[i].draw(1);
            this.bullets[i].TankCollsionCheck();
        }
    }
    
};

enemy2Obj.prototype.wander = function() {
    this.step.set(cos(this.wanderAngle), sin(this.wanderAngle));
    var oldY = this.position.y;
    this.position.add(this.step);
    // this.wanderAngle += random(-15, 15);

    // distance is redefined when it reaches 0
    this.wanderDistance--;
    if (this.wanderDistance < 0) {
        this.wanderDistance = random(70, 700);
        this.wanderAngle += random(-90, 90);
    }

    if (this.position.x > 840) {
        this.position.x = 10;
    }
    else if (this.position.x < 5) {
        this.position.x = 800;
    }
    if (this.position.y > (oldY + 30)) {this.position.y = (oldY - 30);}
    else if (this.position.y < (oldY - 30)) {this.position.y = (oldY + 30);}
};

var enemy3Obj = function(x, y, s) {
    this.position = new PVector(x, y);
    this.step = new PVector(0, 0);
    this.wanderAngle = random(0, 180);
    this.wanderDistance = random(0, 600);
    this.pursueTarget = new PVector(0, 0);
    this.defeated = false;
    this.health = 30;
    this.bullets = [];
    this.objectType = ObjectType_e.ENEMY;
};

enemy3Obj.prototype.draw = function() {
    if (!this.defeated) {
        image(Assets_t.ENEMY3_BASE, this.position.x, this.position.y, TILE_WIDTH, TILE_HEIGHT);
        image(Assets_t.ENEMY3_TURRET, this.position.x, this.position.y, TILE_WIDTH, TILE_HEIGHT);

        // add bullet to bullet list
        if (loopCount % 200 === 0) {
            this.bullets.push(new bulletObj(this.position.x + TILE_WIDTH * 2 / 3 , this.position.y + TILE_HEIGHT, 6));
        }

        for (var i = 0; i < this.bullets.length; i++) {
            this.bullets[i].draw(1);
            this.bullets[i].TankCollsionCheck();
        }
    }
}

enemy3Obj.prototype.wander = function() {
    if (dist(panzer.x, panzer.y, this.position.x, this.position.y) > 5) {
        this.step.set(panzer.x - this.position.x, panzer.y - this.position.y);
        this.step.normalize();
        this.step.mult(4);
        this.position.add(this.step);
    }
};

var enemy4Obj = function(x, y, s) {
    this.position = new PVector(x, y);
    this.step = new PVector(0, 0);
    this.wanderAngle = random(0, 180);
    this.wanderDistance = random(0, 600);
    this.pursueTarget = new PVector(0, 0);
    this.defeated = false;
    this.health = 40;
    this.bullets = [];
    this.objectType = ObjectType_e.ENEMY;
};

enemy4Obj.prototype.draw = function() {
    if (!this.defeated) {
        image(Assets_t.ENEMY4_BASE, this.position.x, this.position.y, TILE_WIDTH, TILE_HEIGHT);
        image(Assets_t.ENEMY4_TURRET, this.position.x, this.position.y, TILE_WIDTH, TILE_HEIGHT);
        
        // add bullet to bullet list
        if (loopCount % 200 === 0) {
            this.bullets.push(new bulletObj(this.position.x + TILE_WIDTH * 2 / 3, this.position.y + TILE_HEIGHT, 6));
        }

        for (var i = 0; i < this.bullets.length; i++) {
            this.bullets[i].draw(1);
            this.bullets[i].TankCollsionCheck();
        }
    }
}

enemy4Obj.prototype.wander = function() {
    this.step.set(cos(this.wanderAngle), sin(this.wanderAngle));
    var oldY = this.position.y;
    this.position.add(this.step);
    // this.wanderAngle += random(-15, 15);

    this.wanderDistance--;
    if (this.wanderDistance < 0) {
        this.wanderDistance = random(70, 700);
        this.wanderAngle += random(-90, 90);
    }

    if (this.position.x > 840) {
        this.position.x = 10;
    }
    else if (this.position.x < 5) {
        this.position.x = 800;
    }
    if (this.position.y > (oldY + 30)) {this.position.y = (oldY - 30);}
    else if (this.position.y < (oldY - 30)) {this.position.y = (oldY + 30);}
};

var bossEnemy = function(x, y) {
    this.position = new PVector(x, y);
    this.step = new PVector(0, 0);
    this.wanderAngle = random(0, 180);
    this.wanderDistance = random(0, 100);
    this.pursueTarget = new PVector(0, 0);
    this.defeated = false;
    this.health = 1500;
    this.objectType = ObjectType_e.ENEMY;
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
    // Level 1 tilemaps
    this.tilemap = [];
    this.tilemap2 = [];

    // Level 2 tilemaps
    this.tilemap3 = [];
    this.tilemap4 = [];

    // Level 3 tilemaps
    this.tilemap5 = [];
    this.tilemap6 = [];
    
    // Game objects array for 1st iteration of level 1
    this.gameObjects = [];
    this.enemyObjects = [];

    // Game objects array for 2nd iteration of level 1
    this.gameObjects2 = [];
    this.enemyObjects2 = [];

    // Game objects array for 1st iteration of level 2
    this.gameObjects3 = [];
    this.enemyObjects3 = [];

    // Game objects array for 2nd iteration of level 2
    this.gameObjects4 = [];
    this.enemyObjects4 = [];
    
    // Game objects array for 1st iteration of level 3
    this.gameObjects5 = [];
    this.enemyObjects5 = [];
    
    // Game objects array for 2nd iteration of level 3
    this.gameObjects6 = [];
    this.enemyObjects6 = [];

    this.yCoor = 0;
    this.xCoor = 0;
    this.score = 0;
    this.scoreMultiplier = 10;
    this.enemyCount = 0;
};

var MapDifficulty_e = {
    EASY: 0,
    MEDIUM: 1,
    HARD: 2,
};

/*
 * Random tilemap generator
 * The tilemap created is based on a difficult passed in.
 * A different probability for number of enemies per line and probability that
 * a certain enemy (depending on their toughness/difficulty level) will be selected
 * to be placed on that particular line.
 * This function is a very valuable piece to this game as it is nearly impossible to get the
 * same gameplay twice.
 */
var createRandomizedTileMap = function(tMap, difficulty, iterNum) {
    var lineLength = 12;

    switch(difficulty) { // Generate a random tilemap based on the difficulty specified
        
        case MapDifficulty_e.EASY:
            var enemySymbols = ['a', 'a', 'b'];
            var probability = [0, 0, 0, 0, 0, 1, 1, 2];
            for (var i = 0; i < TILE_MAP_LENGTH - 8; i++) {
                var numEnemiesInLine = probability[round(random(0, probability.length - 1))];
                var enemyLocation = [-1, -1];  // Locations to be > 0 && < 12

                // Potential positions for enemy placement
                var potentialLineLocations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

                if (numEnemiesInLine === 2) {
                    var temp = round(random(0, potentialLineLocations.length));
                    enemyLocation[0] = potentialLineLocations[temp];

                    // Remove that item from the possible line positions
                    // to avoid repeating the same location
                    potentialLineLocations.splice(temp, 1);  
                    temp = round(random(0, potentialLineLocations.length));
                    enemyLocation[1] = potentialLineLocations[temp];
                }

                if (numEnemiesInLine === 1) {
                    enemyLocation[0] = round(random(1, 11));
                }
                
                // Sort the enemy location array in ascending array before assembling the line string
                enemyLocation.sort(); 
                
                var line = "";  // Create a line to be added to the pagemap later

                // Assemble the line to add to the tilemap
                for (var j = 0; j < lineLength; j++) {
                    
                    if (j !== enemyLocation[0] && j !== enemyLocation[1]) {
                        line += " ";
                    }
                    if (j === enemyLocation[0]) {
                        // Pick a random enemy in the potential enemy
                        var t = round(random(0, enemySymbols.length - 1))
                        line += enemySymbols[t];
                    }
                    if (j === enemyLocation[1]) {
                        // Pick a random enemy in the potential enemy
                        var t = round(random(0, enemySymbols.length - 1))
                        line += enemySymbols[t];
                    }
                }

                // Finally, add the randomly assembled line to the tilemap
                tMap.push(line);
            }
            tMap.push("            ");
            tMap.push("            ");
            if (iterNum === 1) {
                tMap.push("     y      ");
            }
            else {
                tMap.push("            ");
            }
            tMap.push("            ");
            tMap.push("            ");
            tMap.push("            ");
            tMap.push("            ");
            tMap.push("            ");
            break;

        case MapDifficulty_e.MEDIUM:
            var enemySymbols = ['a', 'a', 'b', 'c'];
            var probability = [0, 0, 0, 0, 1, 1, 1, 2, 2, 3];
            for (var i = 0; i < TILE_MAP_LENGTH - 8; i++) {
                var numEnemiesInLine = probability[round(random(0, probability.length - 1))];
                var enemyLocation = [-1, -1, -1];  // Locations to be > 0 && < 12

                // Potential positions for enemy placement
                var potentialLineLocations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
                 
                if (numEnemiesInLine === 3) {
                    var temp = round(random(0, potentialLineLocations.length));
                    enemyLocation[0] = potentialLineLocations[temp];

                    // Remove that item from the possible line positions
                    // to avoid repeating the same location
                    potentialLineLocations.splice(temp, 1);  
                    temp = round(random(0, potentialLineLocations.length));
                    enemyLocation[1] = potentialLineLocations[temp];

                    potentialLineLocations.splice(temp, 1);
                    temp = round(random(0, potentialLineLocations.length));
                    enemyLocation[2] = potentialLineLocations[temp];
                }

                if (numEnemiesInLine === 2) {
                    var temp = round(random(0, potentialLineLocations.length));
                    enemyLocation[0] = potentialLineLocations[temp];

                    // Remove that item from the possible line positions
                    // to avoid repeating the same location
                    potentialLineLocations.splice(temp, 1);  
                    temp = round(random(0, potentialLineLocations.length));
                    enemyLocation[1] = potentialLineLocations[temp];
                }

                if (numEnemiesInLine === 1) {
                    enemyLocation[0] = round(random(1, 11));
                }
                
                // Sort the enemy location array in ascending array before assembling the line string
                enemyLocation.sort(); 
                
                var line = "";  // Create a line to be added to the pagemap later

                // Assemble the line to add to the tilemap
                for (var j = 0; j < lineLength; j++) {
                    
                    if (j !== enemyLocation[0] && j !== enemyLocation[1]) {
                        line += " ";
                    }
                    if (j === enemyLocation[0]) {
                        // Pick a random enemy in the potential enemy
                        var t = round(random(0, enemySymbols.length - 1))
                        line += enemySymbols[t];
                    }
                    if (j === enemyLocation[1]) {
                        // Pick a random enemy in the potential enemy
                        var t = round(random(0, enemySymbols.length - 1))
                        line += enemySymbols[t];
                    }
                    if (j === enemyLocation[2]) {
                        // Pick a random enemy in the potential enemy
                        var t = round(random(0, enemySymbols.length - 1))
                        line += enemySymbols[t];
                    }
                }

                // Finally, add the randomly assembled line to the tilemap
                tMap.push(line);
            }
            tMap.push("            ");
            tMap.push("            ");
            tMap.push("            ");
            if (iterNum === 1) {
                tMap.push("         m  ");  // m = minigun
            }
            else {
                tMap.push("            ");
            }
            tMap.push("            ");
            tMap.push("            ");
            tMap.push("            ");
            tMap.push("            ");
            break;

        case MapDifficulty_e.HARD:
            var enemySymbols = ['a', 'a', 'a', 'b', 'b', 'c', 'c', 'd'];
            var probability = [0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4];

            for (var i = 0; i < TILE_MAP_LENGTH - 8; i++) {
                var numEnemiesInLine = probability[round(random(0, probability.length - 1))];
                var enemyLocation = [-1, -1, -1, -1];  // Locations to be > 0 && < 12

                // Potential positions for enemy placement
                var potentialLineLocations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
                 
                if (numEnemiesInLine === 4) {
                    var temp = round(random(0, potentialLineLocations.length));
                    enemyLocation[0] = potentialLineLocations[temp];

                    // Remove that item from the possible line positions
                    // to avoid repeating the same location
                    potentialLineLocations.splice(temp, 1);  
                    temp = round(random(0, potentialLineLocations.length));
                    enemyLocation[1] = potentialLineLocations[temp];

                    potentialLineLocations.splice(temp, 1);
                    temp = round(random(0, potentialLineLocations.length));
                    enemyLocation[2] = potentialLineLocations[temp];

                    potentialLineLocations.splice(temp, 1);
                    temp = round(random(0, potentialLineLocations.length));
                    enemyLocation[3] = potentialLineLocations[temp];

                }

                if (numEnemiesInLine === 3) {
                    var temp = round(random(0, potentialLineLocations.length));
                    enemyLocation[0] = potentialLineLocations[temp];

                    // Remove that item from the possible line positions
                    // to avoid repeating the same location
                    potentialLineLocations.splice(temp, 1);  
                    temp = round(random(0, potentialLineLocations.length));
                    enemyLocation[1] = potentialLineLocations[temp];

                    potentialLineLocations.splice(temp, 1);
                    temp = round(random(0, potentialLineLocations.length));
                    enemyLocation[2] = potentialLineLocations[temp];
                }

                if (numEnemiesInLine === 2) {
                    var temp = round(random(0, potentialLineLocations.length));
                    enemyLocation[0] = potentialLineLocations[temp];

                    // Remove that item from the possible line positions
                    // to avoid repeating the same location
                    potentialLineLocations.splice(temp, 1);  
                    temp = round(random(0, potentialLineLocations.length));
                    enemyLocation[1] = potentialLineLocations[temp];
                }

                if (numEnemiesInLine === 1) {
                    enemyLocation[0] = round(random(1, 11));
                }
                
                // Sort the enemy location array in ascending array before assembling the line string
                enemyLocation.sort(); 
                
                var line = "";  // Create a line to be added to the pagemap later

                // Assemble the line to add to the tilemap
                for (var j = 0; j < lineLength; j++) {
                    
                    if (j !== enemyLocation[0] && j !== enemyLocation[1]) {
                        line += " ";
                    }
                    if (j === enemyLocation[0]) {
                        // Pick a random enemy in the potential enemy
                        var t = round(random(0, enemySymbols.length - 1))
                        line += enemySymbols[t];
                    }
                    if (j === enemyLocation[1]) {
                        // Pick a random enemy in the potential enemy
                        var t = round(random(0, enemySymbols.length - 1))
                        line += enemySymbols[t];
                    }
                    if (j === enemyLocation[2]) {
                        // Pick a random enemy in the potential enemy
                        var t = round(random(0, enemySymbols.length - 1))
                        line += enemySymbols[t];
                    }
                    if (j === enemyLocation[3]) {
                        // Pick a random enemy in the potential enemy
                        var t = round(random(0, enemySymbols.length - 1))
                        line += enemySymbols[t];
                    }
                }

                // Finally, add the randomly assembled line to the tilemap
                tMap.push(line);
            }
            tMap.push("            ");
            tMap.push("            ");
            tMap.push("            ");
            if (iterNum === 1) {
                tMap.push("    s       ");  // s = shotgun
            }
            else {
                tMap.push("            ");
            }
            tMap.push("            ");
            tMap.push("            ");
            tMap.push("            ");
            tMap.push("            ");
            break;
    } // End switch
};


gameObj.prototype.initialize = function() {
    // Randomize tilemaps so every game is not the same
    // Create custom tilemaps for level 1
    createRandomizedTileMap(this.tilemap, MapDifficulty_e.EASY, 1);  // last parameter is iteration of loop number
    createRandomizedTileMap(this.tilemap2, MapDifficulty_e.EASY, 2);
    
    // Create custom tilemaps for level 2
    createRandomizedTileMap(this.tilemap3, MapDifficulty_e.MEDIUM, 1);
    createRandomizedTileMap(this.tilemap4, MapDifficulty_e.MEDIUM, 2);
    
    // Create custom tilemaps for level 3
    createRandomizedTileMap(this.tilemap5, MapDifficulty_e.HARD, 1);
    createRandomizedTileMap(this.tilemap6, MapDifficulty_e.HARD, 2);
    
    // Initialize arrays based off of tilemap for 1st iteration of the 1st level
    for (var i = 0; i < this.tilemap.length; i++) {
        for (var j = 0; j < this.tilemap[i].length; j++) {
            switch (this.tilemap[i][j]) {
                case 'a':
                    this.enemyObjects.push(new enemy1Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'b':
                    this.enemyObjects.push(new enemy2Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'c':
                    this.enemyObjects.push(new enemy3Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'd':
                    this.enemyObjects.push(new enemy4Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'y':
                    this.gameObjects.push(new upgradedObj(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'm':
                    this.gameObjects.push(new miniGunPickUp(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 's':
                    this.gameObjects.push(new shotGunPickUp(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'h':
                    this.gameObjects.push(new healthPickUp(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                default:
                    break;
            }
        }
    }

    // Initialize 2nd iteration of the 1st level
    for (var i = 0; i < this.tilemap2.length; i++) {  
        for (var j = 0; j < this.tilemap2[i].length; j++) {
            switch (this.tilemap2[i][j]) {
                case 'a':
                    this.enemyObjects2.push(new enemy1Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'b':
                    this.enemyObjects2.push(new enemy2Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'c':
                    this.enemyObjects2.push(new enemy3Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'd':
                    this.enemyObjects2.push(new enemy4Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'y':
                    this.gameObjects2.push(new upgradedObj(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'm':
                    this.gameObjects2.push(new miniGunPickUp(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 's':
                    this.gameObjects2.push(new shotGunPickUp(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'h':
                    this.gameObjects2.push(new healthPickUp(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                default:
                    break;
            }
        }
    }

    // Initialize 1st iteration of the 2nd level
    for (var i = 0; i < this.tilemap3.length; i++) {  
        for (var j = 0; j < this.tilemap3[i].length; j++) {
            switch (this.tilemap3[i][j]) {
                case 'a':
                    this.enemyObjects3.push(new enemy1Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'b':
                    this.enemyObjects3.push(new enemy2Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'c':
                    this.enemyObjects3.push(new enemy3Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'd':
                    this.enemyObjects3.push(new enemy4Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'y':
                    this.gameObjects3.push(new upgradedObj(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'm':
                    this.gameObjects3.push(new miniGunPickUp(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 's':
                    this.gameObjects3.push(new shotGunPickUp(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'h':
                    this.gameObjects3.push(new healthPickUp(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                default:
                    break;
            }
        }
    }

    // Initialize 2nd iteration of the 2nd level
    for (var i = 0; i < this.tilemap4.length; i++) {  
        for (var j = 0; j < this.tilemap4[i].length; j++) {
            switch (this.tilemap4[i][j]) {
                case 'a':
                    this.enemyObjects4.push(new enemy1Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'b':
                    this.enemyObjects4.push(new enemy2Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'c':
                    this.enemyObjects4.push(new enemy3Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'd':
                    this.enemyObjects4.push(new enemy4Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'y':
                    this.gameObjects4.push(new upgradedObj(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'm':
                    this.gameObjects4.push(new miniGunPickUp(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 's':
                    this.gameObjects4.push(new shotGunPickUp(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'h':
                    this.gameObjects4.push(new healthPickUp(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                default:
                    break;
            }
        }
    }

    // Initialize 1st iteration of the 1st level
    for (var i = 0; i < this.tilemap5.length; i++) {  
        for (var j = 0; j < this.tilemap5[i].length; j++) {
            switch (this.tilemap5[i][j]) {
                case 'a':
                    this.enemyObjects5.push(new enemy1Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'b':
                    this.enemyObjects5.push(new enemy2Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'c':
                    this.enemyObjects5.push(new enemy3Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'd':
                    this.enemyObjects5.push(new enemy4Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'y':
                    this.gameObjects5.push(new upgradedObj(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'm':
                    this.gameObjects5.push(new miniGunPickUp(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 's':
                    this.gameObjects5.push(new shotGunPickUp(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'h':
                    this.gameObjects5.push(new healthPickUp(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                default:
                    break;
            }
        }
    }

    // Initialize 2nd iteration of the 1st level
    for (var i = 0; i < this.tilemap6.length; i++) {  
        for (var j = 0; j < this.tilemap6[i].length; j++) {
            switch (this.tilemap6[i][j]) {
                case 'a':
                    this.enemyObjects6.push(new enemy1Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'b':
                    this.enemyObjects6.push(new enemy2Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'c':
                    this.enemyObjects6.push(new enemy3Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'd':
                    this.enemyObjects6.push(new enemy4Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'y':
                    this.gameObjects6.push(new upgradedObj(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'm':
                    this.gameObjects6.push(new miniGunPickUp(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 's':
                    this.gameObjects6.push(new shotGunPickUp(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                case 'h':
                    this.gameObjects6.push(new healthPickUp(j * TILE_WIDTH, i * TILE_HEIGHT));
                    break;
                default:
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
    else if (loopIteration === 1) {  // Second iteration
        for (var i = 0; i < GAME_INST.enemyObjects2.length; i++) { // enemy objects
            GAME_INST.enemyObjects2[i].draw();
            GAME_INST.enemyObjects2[i].wander();
        }
        for (var i = 0; i < GAME_INST.gameObjects2.length; i++) { // collectable objects
            if (!GAME_INST.gameObjects2[i].collected) {
                GAME_INST.gameObjects2[i].draw(y);
            }
        }
    }
};

gameObj.prototype.drawLevelTwo = function(y, loopIteration) {
    image(GameScreens_t.LEVEL_TWO, this.xCoor, this.yCoor);
    if (loopIteration === 0) {  // First iteration
        for (var i = 0; i < GAME_INST.enemyObjects3.length; i++) { // enemy objects
            GAME_INST.enemyObjects3[i].draw();
            GAME_INST.enemyObjects3[i].wander();
        }
        for (var i = 0; i < GAME_INST.gameObjects3.length; i++) { // collectable objects
            if (!GAME_INST.gameObjects3[i].collected) {
                GAME_INST.gameObjects3[i].draw(y);
            }
        }
    }
    else if (loopIteration === 1) {  // Second iteration
        for (var i = 0; i < GAME_INST.enemyObjects4.length; i++) { // enemy objects
            GAME_INST.enemyObjects4[i].draw();
            GAME_INST.enemyObjects4[i].wander();
        }
        for (var i = 0; i < GAME_INST.gameObjects4.length; i++) { // collectable objects
            if (!GAME_INST.gameObjects4[i].collected) {
                GAME_INST.gameObjects4[i].draw(y);
            }
        }
    }
}

gameObj.prototype.drawLevelThree = function(y, loopIteration) {
    image(GameScreens_t.LEVEL_THREE, this.xCoor, this.yCoor);
    if (loopIteration === 0) {  // First iteration
        for (var i = 0; i < GAME_INST.enemyObjects5.length; i++) { // enemy objects
            GAME_INST.enemyObjects5[i].draw();
            GAME_INST.enemyObjects5[i].wander();
        }
        for (var i = 0; i < GAME_INST.gameObjects5.length; i++) { // collectable objects
            if (!GAME_INST.gameObjects5[i].collected) {
                GAME_INST.gameObjects5[i].draw(y);
            }
        }
    }
    else if (loopIteration === 1) {  // Second iteration
        for (var i = 0; i < GAME_INST.enemyObjects6.length; i++) { // enemy objects
            GAME_INST.enemyObjects6[i].draw();
            GAME_INST.enemyObjects6[i].wander();
        }
        for (var i = 0; i < GAME_INST.gameObjects6.length; i++) { // collectable objects
            if (!GAME_INST.gameObjects6[i].collected) {
                GAME_INST.gameObjects6[i].draw(y);
            }
        }
    }
}

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

/*
 * Pass in a loop counter to track how many loop passes have been made
 */
prevTime = 0;
var loseAnimationLength = 5;
var numLoseAnimationFrames = 8;
var animatedLoseScreen = function(animationCount) {
    if (animationCount < loseAnimationLength) {
        image(GameScreens_t.LOSE_SCREEN_TRANSITIONS[0], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= loseAnimationLength * 1 && animationCount < loseAnimationLength * 2) {
        image(GameScreens_t.LOSE_SCREEN_TRANSITIONS[1], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= loseAnimationLength * 2 && animationCount < loseAnimationLength * 3) {
        image(GameScreens_t.LOSE_SCREEN_TRANSITIONS[2], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= loseAnimationLength * 3 && animationCount < loseAnimationLength * 4) {
        image(GameScreens_t.LOSE_SCREEN_TRANSITIONS[3], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= loseAnimationLength * 4 && animationCount < loseAnimationLength * 5) {
        image(GameScreens_t.LOSE_SCREEN_TRANSITIONS[4], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= loseAnimationLength * 5 && animationCount < loseAnimationLength * 6) {
        image(GameScreens_t.LOSE_SCREEN_TRANSITIONS[5], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= loseAnimationLength * 6 && animationCount < loseAnimationLength * 7) {
        image(GameScreens_t.LOSE_SCREEN_TRANSITIONS[6], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= loseAnimationLength * 7 && animationCount < loseAnimationLength * 8) {
        image(GameScreens_t.LOSE_SCREEN_TRANSITIONS[7], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
};

/*
 * Pass in a loop counter to track how many loop passes have been made
 */
prevTime = 0;
var winAnimationLength = 5;
var numWinAnimationFrames = 24;
var animatedWinScreen = function(animationCount) {
    if (animationCount < winAnimationLength) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[0], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= winAnimationLength * 1 && animationCount < winAnimationLength * 2) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[1], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= winAnimationLength * 2 && animationCount < winAnimationLength * 3) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[2], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= winAnimationLength * 3 && animationCount < winAnimationLength * 4) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[3], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= winAnimationLength * 4 && animationCount < winAnimationLength * 5) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[4], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= winAnimationLength * 5 && animationCount < winAnimationLength * 6) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[5], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= winAnimationLength * 6 && animationCount < winAnimationLength * 7) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[6], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= winAnimationLength * 7 && animationCount < winAnimationLength * 8) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[7], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= winAnimationLength * 8 && animationCount < winAnimationLength * 9) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[8], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= winAnimationLength * 9 && animationCount < winAnimationLength * 10) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[9], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= winAnimationLength * 10 && animationCount < winAnimationLength * 11) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[10], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= winAnimationLength * 11 && animationCount < winAnimationLength * 12) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[11], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= winAnimationLength * 12 && animationCount < winAnimationLength * 13) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[12], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= winAnimationLength * 13 && animationCount < winAnimationLength * 14) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[13], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= winAnimationLength * 14 && animationCount < winAnimationLength * 15) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[14], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= winAnimationLength * 15 && animationCount < winAnimationLength * 16) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[15], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= winAnimationLength * 16 && animationCount < winAnimationLength * 17) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[16], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= winAnimationLength * 17 && animationCount < winAnimationLength * 18) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[17], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= winAnimationLength * 18 && animationCount < winAnimationLength * 19) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[18], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= winAnimationLength * 19 && animationCount < winAnimationLength * 20) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[19], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= winAnimationLength * 20 && animationCount < winAnimationLength * 21) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[20], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= winAnimationLength * 21 && animationCount < winAnimationLength * 22) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[21], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= winAnimationLength * 22 && animationCount < winAnimationLength * 23) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[22], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else if (animationCount >= winAnimationLength * 23 && animationCount < winAnimationLength * 24) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[23], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
};


// Simple structure to track the current state of the mouse clicks
var MouseState = {
    PRESSED: 0,
};

// Define what to do on mouse pressed event
var mousePressed = function() {
    MouseState.PRESSED = 1;
};

// Define what to do on mouse release event
var mouseReleased = function() {
    MouseState.PRESSED = 0;
};

// Provide function to handle changing from one game state to another
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

// Function to draw the help screen complete with a blinking back arrow
var drawHelpScreen = function(frameCount) {
    image(GameScreens_t.HELP_SCREEN, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);  // Control instructions
    // Back Arrow blink functionality
    if ((frameCount % HelpSpeedOptions_e.MEDIUM) * -1 <= HelpSpeedOptions_e.MEDIUM / 2) {  
        image(GameScreens_t.HELP_SCREEN_BACK_BUTTON, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
};

// Initialize a new game object and set the starting screen to the main menu
var GAME_INST = new gameObj();
var CURRENT_GAME_STATE = GameState_e.START_SCREEN;
GAME_INST.initialize();

// Create necessary objects outside the overloaded 'draw' callback function
// Also set up any control variables to aid with manipulating the game's FSM
// and other necessary tasks
var tankSpeed = 3;
var loopCount = -3400;
var panzer = createTank(
    SCREEN_WIDTH / 2 - TILE_WIDTH / 2, 
    -loopCount + SCREEN_HEIGHT * 2 / 3, 
    tankSpeed, 
    TankOptions_e.BASIC);
var upgradeCollected = false;
var tankUpgraded = false;
var animationFinished = false;
var animationCount = 0;
var fontSize = 48;
var loopIterations = 0;

/*
 * Overload Processing's callback function 
 * This function is called at 60 FPS (frames per second)
 * Setup the FSM within this function
 */
var draw = function() { 
    switch(CURRENT_GAME_STATE) {
        
        /*
         * ------------------------
         * |  START SCREEN STATE  |
         * ------------------------
         */
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

        /*
         * ------------------------------------
         * |  ANIMATED LOAD TRANSITION STATE  |
         * ------------------------------------
         * (Currently a placeholder for future developements of the game where
         * a short load transition will be added to pad the loading of each 
         * level)
         */
        case GameState_e.ANIMATED_LOAD_TRANSITION: 
            changeGameState(GameState_e.LEVEL_THREE)    // change back to one
            break;

        /*
         * -------------------
         * |  LEVEL 1 STATE  |
         * -------------------
         */
        case GameState_e.LEVEL_ONE:
            // changeGameState(GameState_e.ANIMATED_LOSE_TRANSITION);
            pushMatrix();
            translate(0, loopCount);
            GAME_INST.drawLevelOne(loopCount, loopIterations);

            // Implement constantly scrolling background
            // Loop counter to keep track of the translation iteration we are currently on
            loopCount++;
            if (loopCount > 0) { 
                loopCount = -3400;
                panzer.y -= loopCount;
                loopIterations++;
            }
            
            // Advance to level 2 once level 1 is complete
            if (loopIterations === 2) {  
                loopCount = -3400;
                loopIterations = 0;
                changeGameState(GameState_e.LEVEL_TWO);
            }

            // Display character's health as a part of the H.U.D.
            stroke()
            fill(230, 30, 30);
            textSize(14);
            text("HEALTH: " + panzer.health, 10, -loopCount + SCREEN_HEIGHT * 1 / 20);
            text("SCORE: " + GAME_INST.score*10, 700, -loopCount + SCREEN_HEIGHT * 1 / 20);
            noStroke();
            
            // 1st wave of enemies contained in the first tilemap defined in 
            // the game object
            if (loopIterations === 0) {  
                checkCollisionWithEnemies(panzer, GAME_INST.enemyObjects);
            }
            // 2nd wave of enemies (2nd map iteration) = 2nd tilemap
            else if (loopIterations === 1) {  
                checkCollisionWithEnemies(panzer, GAME_INST.enemyObjects2);
            }

            // Main functionality of the panzer tank
            panzer.draw(loopCount, GameState_e.LEVEL_ONE);
            
            // Lose Condition = Health is fully diminished and (tank is dead)
            if (panzer.health <= 0) { 
                changeGameState(GameState_e.ANIMATED_LOSE_TRANSITION);
            }

            // Check if the tank is upgraded
            upgradeCollected = checkCollisionWithUpgrade(panzer, GAME_INST.gameObjects);

            // Case: Basic upgrade collected
            if (upgradeCollected === ObjectType_e.BASIC_GUN && !tankUpgraded) {  
                var autoFireEnabled = panzer.autoFireEnabled;
                var currentHealth = panzer.health;
                panzer = createTank(panzer.x, panzer.y, tankSpeed, TankOptions_e.UPGRADED);  // Create the upgraded tank
                panzer.autoFireEnabled = autoFireEnabled;  // Remember previous tank state
                panzer.health = currentHealth;  // Update the upgraded tanks health 
                tankUpgraded = true;  // Control variable to ensure only 1x execution of this logical block
            }

            // Case: Health collected
            if (upgradeCollected === ObjectType_e.HEALTH) {
                panzer.health += 250;
            }

            // Case: Shotgun collected
            if (upgradeCollected === ObjectType_e.SHOT_GUN) {
                panzer.shotGunEnabled = true;
            }

            // Case: MiniGun Collected
            if (upgradeCollected === ObjectType_e.MINI_GUN) {
                panzer.miniGunEnabled = true;
            }

            popMatrix();
            break;

        /*
         * -------------------
         * |  LEVEL 2 STATE  |
         * -------------------
         */
        case GameState_e.LEVEL_TWO:  
            pushMatrix();
            translate(0, loopCount);
            GAME_INST.drawLevelTwo(loopCount, loopIterations);

            // Implement constantly scrolling background
            // Loop counter to keep track of the translation iteration we are currently on
            loopCount++;
            if (loopCount > 0) { 
                loopCount = -3400;
                panzer.y -= loopCount;
                loopIterations++;
            }
            
            // Advance to level 3 once level 2 is complete
            if (loopIterations === 2) {  
                loopCount = -3400;
                loopIterations = 0;
                changeGameState(GameState_e.LEVEL_THREE);
            }

            // Display character's health as a part of the H.U.D.
            stroke()
            fill(230, 30, 30);
            textSize(14);
            text("HEALTH: " + panzer.health, 10, -loopCount + SCREEN_HEIGHT * 1 / 20);
            text("SCORE: " + GAME_INST.score*10, 700, -loopCount + SCREEN_HEIGHT * 1 / 20);
            noStroke();
            
            // 1st wave of enemies contained in the first tilemap defined in 
            // the game object
            if (loopIterations === 0) {  
                checkCollisionWithEnemies(panzer, GAME_INST.enemyObjects3);
            }
            // 2nd wave of enemies (2nd map iteration) = 2nd tilemap
            else if (loopIterations === 1) {  
                checkCollisionWithEnemies(panzer, GAME_INST.enemyObjects4);
            }

            // Main functionality of the panzer tank
            panzer.draw(loopCount, GameState_e.LEVEL_TWO);
            
            // Lose Condition = Health is fully diminished and (tank is dead)
            if (panzer.health <= 0) { 
                changeGameState(GameState_e.ANIMATED_LOSE_TRANSITION);
            }

            // Check if the tank is upgraded
            upgradeCollected = checkCollisionWithUpgrade(panzer, GAME_INST.gameObjects3);

            // Case: Basic upgrade collected
            if (upgradeCollected === ObjectType_e.BASIC_GUN && !tankUpgraded) {  
                var autoFireEnabled = panzer.autoFireEnabled;
                var currentHealth = panzer.health;
                panzer = createTank(panzer.x, panzer.y, tankSpeed, TankOptions_e.UPGRADED);  // Create the upgraded tank
                panzer.autoFireEnabled = autoFireEnabled;  // Remember previous tank state
                panzer.health = currentHealth;  // Update the upgraded tanks health 
                tankUpgraded = true;  // Control variable to ensure only 1x execution of this logical block
            }

            // Case: Health collected
            if (upgradeCollected === ObjectType_e.HEALTH) {
                panzer.health += 250;
            }

            // Case: Shotgun collected
            if (upgradeCollected === ObjectType_e.SHOT_GUN) {
                panzer.shotGunEnabled = true;
            }

            // Case: MiniGun Collected
            if (upgradeCollected === ObjectType_e.MINI_GUN) {
                panzer.miniGunEnabled = true;
            }

            popMatrix();
            break;
        
        /*
         * -------------------
         * |  LEVEL 3 STATE  |
         * -------------------
         */
        case GameState_e.LEVEL_THREE:  // TODO: Complete 
            pushMatrix();
            translate(0, loopCount);
            GAME_INST.drawLevelThree(loopCount, loopIterations);

            // Implement constantly scrolling background
            // Loop counter to keep track of the translation iteration we are currently on
            loopCount++;
            if (loopCount > 0) { 
                loopCount = -3400;
                panzer.y -= loopCount;
                loopIterations++;
            }
            
            // Advance to winning transition once level 3 is complete
            if (loopIterations === 2) {  
                loopCount = -3400;
                loopIterations = 0;
                changeGameState(GameState_e.ANIMATED_WIN_TRANSITION)
            }

            // Display character's health as a part of the H.U.D.
            stroke()
            fill(230, 30, 30);
            textSize(14);
            text("HEALTH: " + panzer.health, 10, -loopCount + SCREEN_HEIGHT * 1 / 20);
            text("SCORE: " + GAME_INST.score*10, 700, -loopCount + SCREEN_HEIGHT * 1 / 20);
            noStroke();
            
            // 1st wave of enemies contained in the first tilemap defined in 
            // the game object
            if (loopIterations === 0) {  
                checkCollisionWithEnemies(panzer, GAME_INST.enemyObjects5);
            }
            // 2nd wave of enemies (2nd map iteration) = 2nd tilemap
            else if (loopIterations === 1) {  
                checkCollisionWithEnemies(panzer, GAME_INST.enemyObjects6);
            }

            // Main functionality of the panzer tank
            panzer.draw(loopCount, GameState_e.LEVEL_THREE);
            
            // Lose Condition = Health is fully diminished and (tank is dead)
            if (panzer.health <= 0) { 
                changeGameState(GameState_e.ANIMATED_LOSE_TRANSITION);
            }

            // Check if the tank is upgraded
            upgradeCollected = checkCollisionWithUpgrade(panzer, GAME_INST.gameObjects5);

            // Case: Basic upgrade collected
            if (upgradeCollected === ObjectType_e.BASIC_GUN && !tankUpgraded) {  
                var autoFireEnabled = panzer.autoFireEnabled;
                var currentHealth = panzer.health;
                panzer = createTank(panzer.x, panzer.y, tankSpeed, TankOptions_e.UPGRADED);  // Create the upgraded tank
                panzer.autoFireEnabled = autoFireEnabled;  // Remember previous tank state
                panzer.health = currentHealth;  // Update the upgraded tanks health 
                tankUpgraded = true;  // Control variable to ensure only 1x execution of this logical block
            }

            // Case: Health collected
            if (upgradeCollected === ObjectType_e.HEALTH) {
                panzer.health += 250;
            }

            // Case: Shotgun collected
            if (upgradeCollected === ObjectType_e.SHOT_GUN) {
                panzer.shotGunEnabled = true;
            }

            // Case: MiniGun Collected
            if (upgradeCollected === ObjectType_e.MINI_GUN) {
                panzer.miniGunEnabled = true;
            }

            popMatrix();
            break;
        
        /*
         * -----------------------------------
         * |  ANIMATED TO HELP SCREEN STATE  | 
         * -----------------------------------
         */
        case GameState_e.ANIMATED_HELP_TRANSITION:
            animatedHelpTransition(animationCount);
            if (animationCount >= animationLength * numHelpAnimationFrames) {
                //println("loopCount = " + loopCount);
                //animationCount = 0;  // reset the animation count
                changeGameState(GameState_e.HELP_SCREEN);
            }
            animationCount++;
            break;

        /*
         * -----------------------
         * |  HELP SCREEN STATE  |
         * -----------------------
         * (This screen contains the game instructions)
         */
        case GameState_e.HELP_SCREEN: // Transition from the main menu to the help screen
            drawHelpScreen(loopCount); // Draw the help screen

            // Check if the user clicked the animated back button
            var mouseInArrow = MouseState.PRESSED && mouseX < 675 && mouseX > 574 && mouseY < 587 && mouseY > 490;
            var mouseInArrowStem = MouseState.PRESSED && mouseX < 575 && mouseX > 523 && mouseY < 556 && mouseY > 524;

            // If mouse click is placed correctly, transition back to the menu
            // via reversed animation
            if (mouseInArrow || mouseInArrowStem) {
                changeGameState(GameState_e.ANIMATED_MENU_TRANSITION);
                MouseState.PRESSED = 0;  // Force a click release
            }
            loopCount++;
            break;

        /*
         * -----------------------------------
         * |  ANIMATED TO MENU SCREEN STATE  |
         * -----------------------------------
         * (This state is a temporary animation state to nicely transition
         * back to the main menu)
         */
        case GameState_e.ANIMATED_MENU_TRANSITION:  // Transition back to the main menu
            animatedHelpTransition(animationCount);
            if (animationCount <= 0) {
                changeGameState(GameState_e.START_SCREEN);
            }
            animationCount--;
            break;
        
        /*
         * -------------------
         * |  CREDITS STATE  |
         * -------------------
         */
        case GameState_e.CREDITS:  // TODO: Placeholder for end credits
            changeGameState(GameState_e.START_SCREEN)
            break;
        
        /*
         * ------------------------------------
         * |  ANIMATED LOSE TRANSITION STATE  |
         * ------------------------------------
         */
        case GameState_e.ANIMATED_LOSE_TRANSITION:  // TODO: Placeholder for future edits for transitioning to lose screen
            changeGameState(GameState_e.LOSE_SCREEN)
            break;

        /*
         * -----------------------
         * |  LOSE SCREEN STATE  |
         * -----------------------
         */
        case GameState_e.LOSE_SCREEN:
            if(animationCount >= loseAnimationLength * numLoseAnimationFrames) {
                animationCount = 0;
            }
            animatedLoseScreen(animationCount)
            animationCount++;

            if (MouseState.PRESSED) {
                MouseState.PRESSED = 0;
                changeGameState(GameState_e.CREDITS)
            }
            break;

        /*
         * -----------------------------------
         * |  ANIMATED WIN TRANSITION STATE  |
         * -----------------------------------
         */
        case GameState_e.ANIMATED_WIN_TRANSITION:  // TODO: Placeholder for future edits for transitioning to win screen
            changeGameState(GameState_e.WIN_SCREEN)
            break;

        /*
         * ----------------------
         * |  WIN SCREEN STATE  |
         * ----------------------
         */
        case GameState_e.WIN_SCREEN:  // TEMPORARY: Placeholder win screen for win condition
            if(animationCount >= winAnimationLength * numWinAnimationFrames) {
                animationCount = 0;
            }
            animatedWinScreen(animationCount)
            animationCount++;
            
            // Display end game credits
            if (MouseState.PRESSED) {
                changeGameState(GameState_e.CREDITS)
            }
            //background(0, 0, 0);
            //stroke()
            //fill(255, 255, 255);
            //textSize(fontSize);
            //text("YOU WIN!!!", 200, 280);
            //noStroke();
            //println("TEMPORARY: WIN_SCREEN");
            break;
        
        /*
         * -------------
         * |  DEFAULT  |
         * -------------
         * (Default case should not be hit.  Here for debugging purposes only)
         */
        default: 
            console.debug("Error: Default game state hit!");
            println("Error: Default game state hit!");
            break;
    } // End switch
};  // End draw()


}};  // End program
