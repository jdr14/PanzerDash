/*
 * About this project:
 *
 * Summary: Our goal with this program was to demonstrate a variety of learnings we have had in class
 * as well as some additional research we conducted on our own to bring this project to life.
 * In addition, we wanted to have fun making our first video game project (aside from the smaller
 * projects we have completed in our video game design (ECE 4525) class).  Our Project 
 *
 * Movement (via keyboard input): This project features movement based on keypresses as the main character is 
 * controlled by the WASD keys.  
 *
 * Collision Detection: We have implemented collision detection for the collectable
 * items, physical barriers, enemies, and ammunition.
 *
 * Custom and Randomized Tilemap: The PanzerDash game contains a unique tilemap for every gameplay
 * thanks to a special function we developed to generate custom tilemaps based on a given difficulty
 * the caller of the function can either specify EASY, MEDIUM, or HARD, and the random tilemap function
 * then uses probability and the random function to build each line of the tilemap.  For easy, the 
 * enemies are fewer and easier to combat.  Medium brings more enemies at a higher difficulty.  Hard
 * creates the highest concentration of enemies with the hardest difficulty
 *
 * Translation: This game also takes advantage of translation to give the player the feeling of
 * an overhead camera tracking their player on an 800 x 600 grid.
 *
 * Rotation: This game also features rotation to rotate the tank gun .png on top of the tank base to 
 * simulate a real tank
 *
 * Animations: We have animated our transitions, screens, and in game pickups to add character to our game
 *
 * Heads Up Display: We use available processingJS functions to give the user visible data on their life,
 * score, and boost available in game.  This is a common feature in most games.
 *
 * AI Enemy Algorithms: Our in game enemy AIs make use of wander and seek & find algorithms to present an adequate
 * challenge to the player (so they don't get bored)
 *
 * FSM (Finite State Machine): We use an FSM to keep track of our game states in processing's draw callback function
 * This FSM is well designed, robust, and was modeled after a diagram we first created when drafting up the idea of 
 * the game.
 *
 * Unique/Variety of Playing Fields and Enemies: Our game features several maps and enemies to demonstrate creativity
 * and give some flavor to our game.
 *
 * Note: The development of this game was inspired by the "Raptor: Call of the Shadows" game I played as a kid.  
 *
 * Originally developed for the final project of ECE 4525 (Video Game Design) class at Virginia Tech on 12/19
 *
 * Artist(s): 
 *     Alex Shammas (SCAD)
 * Programmer(s): 
 *     Joey (Joseph) Rodgers (VT: Software Systems)
 *     Jovany Cabrera (VT: Software Systems)
 */

// Play Screen Dimensions (in pixels)
var SCREEN_WIDTH = 800;
var SCREEN_HEIGHT = 600;

// Developer and beta testing switches
var ENABLE_CHEATS = false;
var ENABLE_DEBUG_MODE = false;

var sketchProc=function(processingInstance){ with (processingInstance) {
size(SCREEN_WIDTH, SCREEN_HEIGHT); 

FPS = 60;
frameRate(FPS);

// Variable describing the total map pixel lengths
var MAP_HEIGHT = 8000;
var MAP_OFFSET = MAP_HEIGHT - SCREEN_HEIGHT;

// Global var/switch to enforce a certain pixel count for height and width per tile
var TILE_HEIGHT = 80; 
var TILE_WIDTH = TILE_HEIGHT * SCREEN_HEIGHT / SCREEN_WIDTH;  // Keep proportions in line with aspect ratio 
var TILE_MAP_LENGTH = MAP_HEIGHT / TILE_HEIGHT;

// Custom tile dimmensions for the boss 
var BOSS_HEIGHT = TILE_HEIGHT * 2;
var BOSS_WIDTH = TILE_WIDTH * 2;

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
        '../assets/main_character/player_idle1.png',
        '../assets/main_character/player_idle2.png',
        '../assets/main_character/player_idle3.png',
        '../assets/main_character/tank_gun.png',
        '../assets/main_character/tank_gun2.png',
        '../assets/main_character/tank_gun_rockets.png',
        '../assets/main_character/tank_gun_dual_miniguns.png',
        '../assets/HUD/hud.png',
        '../assets/HUD/needle.png'
        '../assets/sound_files/tank.wav',
    crisp='true';
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
    FINAL_STAGE: 13,
    DEFAULT: 14,
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
    PANZER1:    loadImage('../assets/main_character/player_idle1.png'),
    PANZER2:    loadImage('../assets/main_character/player_idle2.png'),
    PANZER3:    loadImage('../assets/main_character/player_idle3.png'),
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
    BOSS_BASE:    loadImage('../assets/enemies/boss_base.png'),
    BOSS_FRONT:   loadImage('../assets/enemies/boss_front.png'),

    // Main character upgrades
    SHOT_GUN_PICKUP: loadImage('../assets/pickups/pickup_shotgun.png'),
    MINI_GUN_PICKUP: loadImage('../assets/pickups/pickup_rapidfire.png'),
    HEALTH_PICKUP:   loadImage('../assets/pickups/pickup_health.png'),

    // Heads up display
    HUD:        loadImage('../assets/HUD/hud.png'),
    HUD_NEEDLE: loadImage('../assets/HUD/needle.png'),
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

// Maps (to avoid unnecessary if statements and repetition)
// var PanzerMap = new Map(
//     [[0, Assets_t.PANZER1],
//     [1, Assets_t.PANZER2],
//     [2, Assets_t.PANZER3]]);
var PanzerMap = new Map();
PanzerMap.set(0, Assets_t.PANZER1);
PanzerMap.set(1, Assets_t.PANZER2);
PanzerMap.set(2, Assets_t.PANZER3);


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

var shotBulletObj = function(x, y, s, c) {
    this.pos1 = new PVector(x - 1, y);
    this.pos2 = new PVector(x, y);
    this.pos3 = new PVector(x + 1, y);
    this.w = 5;
    this.l = 5;
    if (c) {
        this.spreadWidth = c;
    }
    else {
        this.spreadWidth = 2;
    }
    this.speed = s;
    this.speed1 = new PVector(-this.spreadWidth, this.speed);
    this.speed2 = new PVector(0, this.speed);
    this.speed3 = new PVector(this.spreadWidth, this.speed);
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
    this.w = 2;  // width
    this.l = 12;  // length
    this.speed = new PVector(0, s);
    this.damage = 2;
    this.hit = 0;

    // These variables are to control the range that the bullet can go
    this.travelDistance = 0;
    this.range = 100;
    this.outOfRange = false;
};

bulletObj.prototype.draw = function(type) {
    //if (this.travelDistance >= this.range) {
    //    this.outOfRange = true;
    //} 
    if(this.hit === 0 && !this.outOfRange) {
        noStroke();
        if (type === 1) // type 1 signifies enemy bullets
        {
            fill(99, 0, 0);
            rect(this.position.x - (this.w * 2) / 2, this.position.y + (3 / 2 * this.l), (this.w * 3), (1 / 2 * this.l));
            
            fill(252, 66, 53);
            rect(this.position.x - (this.w * 2) / 2, this.position.y, (this.w * 3), (3 / 2 * this.l));
            //ellipse(this.position.x, this.position.y, (2 * this.w), (2 * this.w));
        }
        else // main character machine gun bullets
        {
            fill(31, 31, 24);
            rect(this.position.x - this.w / 2, this.position.y, this.w, this.l / 2);
            
            fill(255, 228, 120);
            rect(this.position.x - this.w / 2, this.position.y + this.l / 2, this.w, this.l / 2);
            //ellipse(this.position.x, this.position.y, this.w, this.w);
        }

        this.position.add(this.speed);
    }
    //this.travelDistance += 1;
};

bulletObj.prototype.hitTank = function() {
    var temp = (panzer.y + loopCount - SCREEN_HEIGHT * 1 / 20);
    if (dist(panzer.x, panzer.y, this.position.x, this.position.y) > 2) {
        fill(122, 120, 113);
        rect(this.position.x - (this.w*2) / 2, this.position.y, (this.w*2), (2*this.l));
        ellipse(this.position.x, this.position.y, (2*this.w), (2*this.w));
        this.speed.set(panzer.x - this.position.x, 3);
        this.speed.normalize();
        this.position.add(this.speed);
    }
}

bulletObj.prototype.EnemyCollisionCheck = function(enemyList, level) {
    if (level === GameState_e.FINAL_STAGE) {
        var tile_width = BOSS_WIDTH;
        var tile_height = BOSS_HEIGHT;
        //var within_x = this.position.x > round(GAME_INST.finalBoss.front_x) && this.position.x < round(GAME_INST.finalBoss.position.x) + tile_width;
        //var within_y = this.position.y > round(GAME_INST.finalBoss.position.y) - tile_height && this.position.y < round(GAME_INST.finalBoss.position.y) + tile_height;
        var within_x = this.position.x > round(GAME_INST.finalBoss.base_x) 
            && this.position.x < round(GAME_INST.finalBoss.base_x + tile_width);
        var within_y = this.position.y > round(GAME_INST.finalBoss.base_y - GAME_INST.finalBoss.base_height)
            && this.position.y < round(GAME_INST.finalBoss.base_y + GAME_INST.finalBoss.base_height);

        if (within_x && within_y && !GAME_INST.finalBoss.defeated && this.hit !== 1) {  // Check that object has not already been collected
            GAME_INST.finalBoss.health -= this.damage;
            if (GAME_INST.finalBoss.health < 1) {
                GAME_INST.finalBoss.defeated = true;
                GAME_INST.score++;
            }
            this.hit = 1;
        }
        return;
    }
    for (var i = 0; i < enemyList.length; i++) {
        var within_x = this.position.x > round(enemyList[i].position.x) && this.position.x < round(enemyList[i].position.x) + TILE_WIDTH;
        var within_y = this.position.y > round(enemyList[i].position.y) - TILE_HEIGHT && this.position.y < round(enemyList[i].position.y) + TILE_HEIGHT;

        if (within_x && within_y && !enemyList[i].defeated && this.hit !== 1) {  // Check that object has not already been collected
            enemyList[i].health -= this.damage;
            if (enemyList[i].health < 1) {
                enemyList[i].defeated = true;
                GAME_INST.score++;
            }
            this.hit = 1;
        }
    }
};

shotBulletObj.prototype.EnemyCollisionCheck = function(enemyList, level) {
    if (level === GameState_e.FINAL_STAGE) {
        var tile_height = BOSS_HEIGHT;
        var tile_width = BOSS_WIDTH;
        
        // Set the x and y collision values
        var within_x = this.pos1.x > round(GAME_INST.finalBoss.base_x) 
            && this.pos1.x < round(GAME_INST.finalBoss.base_x) + tile_width;

        var within_y = this.pos1.y > round(GAME_INST.finalBoss.base_y)
            && this.pos1.y < round(GAME_INST.finalBoss.base_y) + GAME_INST.finalBoss.base_height;

        // Check bullet 1 collision
        if (within_x && within_y && !GAME_INST.finalBoss.defeated && this.hit1 !== 1) {  
            GAME_INST.finalBoss.health -= this.damage;
            if (GAME_INST.finalBoss.health < 1) {
                GAME_INST.finalBoss.defeated = true;
                GAME_INST.score++;
            }
            this.hit1 = 1;
        }
        
        // update the x and y collision boolean values
        within_x = this.pos2.x > round(GAME_INST.finalBoss.base_x) 
            && this.pos2.x < round(GAME_INST.finalBoss.base_x) + tile_width;

        within_y = this.pos2.y > round(GAME_INST.finalBoss.base_y)
            && this.pos2.y < round(GAME_INST.finalBoss.base_y) + GAME_INST.finalBoss.base_height;

        // Check bullet 2 collision
        if (within_x && within_y && !GAME_INST.finalBoss.defeated && this.hit2 !== 1) {  
            GAME_INST.finalBoss.health -= this.damage;
            if (GAME_INST.finalBoss.health < 1) {
                GAME_INST.finalBoss.defeated = true;
                GAME_INST.score++;
            }
            this.hit2 = 1;
        }
        
        // update the x and y collision boolean values
        within_x = this.pos3.x > round(GAME_INST.finalBoss.base_x) 
            && this.pos3.x < round(GAME_INST.finalBoss.base_x) + tile_width;
        within_y = this.pos3.y > round(GAME_INST.finalBoss.base_y)
            && this.pos3.y < round(GAME_INST.finalBoss.base_y) + GAME_INST.finalBoss.base_height;

        // Check bullet 3 collision
        if (within_x && within_y && !GAME_INST.finalBoss.defeated && this.hit3 !== 1) { 
            GAME_INST.finalBoss.health -= this.damage;
            if (GAME_INST.finalBoss.health < 1) {
                GAME_INST.finalBoss.defeated = true;
                GAME_INST.score++;
            }
            this.hit3 = 1;
        }
        return;
    }
    
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

shotBulletObj.prototype.TankCollsionCheck = function() {
    // Check bullet stream 1
    var within_x = round(this.pos1.x) > panzer.x && round(this.pos1.x) < panzer.x + TILE_WIDTH;
    var within_y = round(this.pos1.y) > (panzer.y) && round(this.pos1.y) < panzer.y + TILE_HEIGHT;

    if (within_x && within_y && (this.hit1 !== 1)) {
        panzer.health -= this.damage;
        this.hit1 = 1;
        within_x = false;
    }

    // Check bullet stream 2
    var within_x = round(this.pos2.x) > panzer.x && round(this.pos2.x) < panzer.x + TILE_WIDTH;
    var within_y = round(this.pos2.y) > (panzer.y) && round(this.pos2.y) < panzer.y + TILE_HEIGHT;

    if (within_x && within_y && (this.hit2 !== 1)) {
        panzer.health -= this.damage;
        this.hit2 = 1;
        within_x = false;
    }

    // Check bullet stream 3
    var within_x = round(this.pos3.x) > panzer.x && round(this.pos3.x) < panzer.x + TILE_WIDTH;
    var within_y = round(this.pos3.y) > (panzer.y) && round(this.pos3.y) < panzer.y + TILE_HEIGHT;

    if (within_x && within_y && (this.hit3 !== 1)) {
        panzer.health -= this.damage;
        this.hit3 = 1;
        within_x = false;
    }
    return;
}

bulletObj.prototype.TankCollsionCheck = function() {
    var within_x = round(this.position.x) > panzer.x && round(this.position.x) < panzer.x + TILE_WIDTH;
    var within_y = round(this.position.y) > (panzer.y) && round(this.position.y) < panzer.y + TILE_HEIGHT;

    if (within_x && within_y && (this.hit !== 1)) {
        panzer.health -= this.damage;
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

var tankShellObj = function(x, y, s, gunAngle) {
    this.position = new PVector(x, y);
    this.w = 4;  // width
    this.l = 8;  // length
    this.speed = new PVector(s * Math.cos(gunAngle), s * Math.sin(gunAngle))
    this.damage = 3;
    this.hit = 0;
};

tankShellObj.prototype.draw = function(gunAngle) {
    if (this.hit === 0) {
        // Draw the actual tank shell
        // fill(160, 160, 160);
        // rect(this.position.x - this.w / 2, this.position.y, this.w, this.l);
        fill(240, 20, 20);
        ellipse(this.position.x, this.position.y, this.l / 2, this.l / 2);
    
        fill(40, 40, 40);
        ellipse(this.position.x, this.position.y, this.l, this.l);
        
        // Add velocity to the shell
        this.position.add(this.speed); 
    }

};

tankShellObj.prototype.EnemyCollisionCheck = function(enemyList, level) {

    if (level === GameState_e.FINAL_STAGE) {
        var tile_height = BOSS_HEIGHT;
        var tile_width = BOSS_WIDTH;
        var within_x = this.position.x > round(GAME_INST.finalBoss.base_x) 
            && this.position.x < round(GAME_INST.finalBoss.base_x + tile_width);
        var within_y = this.position.y > round(GAME_INST.finalBoss.base_y - GAME_INST.finalBoss.base_height / 2) 
            && this.position.y < round(GAME_INST.finalBoss.base_y + GAME_INST.finalBoss.base_height);
        if (within_x && within_y && !GAME_INST.finalBoss.defeated && this.hit != 1) {  // Check that object has not already been collected
            GAME_INST.finalBoss.health -= this.damage;
            // case where an emeny is killed
            if (GAME_INST.finalBoss.health < 1) {
                GAME_INST.finalBoss.defeated = true;
                GAME_INST.score++;
            }
            this.hit = 1;
        }
        return;
    }
    for (var i = 0; i < enemyList.length; i++) {
        var within_x = this.position.x > round(enemyList[i].position.x) && this.position.x < round(enemyList[i].position.x) + TILE_WIDTH;
        var within_y = this.position.y > round(enemyList[i].position.y) - TILE_HEIGHT && this.position.y < round(enemyList[i].position.y) + TILE_HEIGHT;

        if (within_x && within_y && !enemyList[i].defeated && this.hit != 1) {  // Check that object has not already been collected
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

// This is the main character (i.e. the samurai)
var tankObj = function(x, y, s) {
    this.x = x;
    this.y = y;
    this.speed = 3;
    this.bullets = [];
    this.bulletSpeed = -6;
    this.fireRate = 8;
    this.autoFireEnabled = false;
    this.health = 100;
    this.boostAvailable = 400;
    this.rechargeNeeded = false;
    this.rechargeTime = 300;
    this.objectType = ObjectType_e.TANK;
    this.miniGunEnabled = false;
    this.shotGunEnabled = false;
};

tankObj.prototype.draw = function(frameCount, currentLevel) {
    var self = this;
    
    if (DISABLE.W === false) { // } && self.y > 0) {
        self.y -= self.speed;
        // FPS+=2;
        // frameRate(FPS);
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
    // self.y -= 1;
    // FPS-=1;
    // frameRate(FPS);
    if (DISABLE.SPACE === false && self.boostAvailable > 3) { // && !self.rechargeNeeded) {
        self.speed = 5;
        self.boostAvailable -= 4;  // Decrement the available boost left
        if (self.boostAvailable === 0) {
            self.rechargeNeeded = true;
        }
    }
    else {
        //self.y -= 1;
        self.speed = 3;
        if (self.boostAvailable < 400) {
            self.boostAvailable++;
        }
        // if (self.rechargeNeeded) {
        //     self.rechargeTime -= 1;
        // }
        // if (self.rechargeTime === 0) {  // Force the recharge to take twice as long as the player can spend the boost
        //     self.rechargeNeeded = false;
        //     self.boostAvailable = 100;
        //     self.rechargeTime = 300;
        // }
    }

    if (!DISABLE.DOWN) {
        this.autoFireEnabled = !this.autoFireEnabled;  // toggle the auto fire enabled option
        this.autoFireToggled = true;
    }
    if (!DISABLE.UP || this.autoFireEnabled) {  // Fire the gun
        if (frameCount % this.fireRate === 0) {
            if (!this.shotGunEnabled) {
                this.bullets.push(new bulletObj(this.x + TILE_WIDTH / 2, this.y + TILE_HEIGHT / 6, this.bulletSpeed));
            }
            else {  // Shotgun enabled
                this.bullets.push(new shotBulletObj(this.x + TILE_WIDTH / 2, this.y + TILE_HEIGHT / 6, this.bulletSpeed));
            }
            if (this.miniGunEnabled) {
                this.fireRate = 4;
            }
        }   
    }

    if (frameCount % 5 === 0) { // TODO: Better implementation of the autofire delayed needed
        this.autoFireToggled = false;
    }
    
    // Animated tank track movement for the main character
    if (-frameCount % 15 < 5) { // 0 -> 3
        image(Assets_t.PANZER1, self.x, self.y, TILE_WIDTH, TILE_HEIGHT);
    }
    else if (-frameCount % 15 >= 5 && frameCount % 15 < 10) { // 4 -> 7
        image(Assets_t.PANZER2, self.x, self.y, TILE_WIDTH, TILE_HEIGHT);
    }
    else if (-frameCount % 15 >= 10 && frameCount % 15 < 15) { // 8 -> 11
        image(Assets_t.PANZER3, self.x, self.y, TILE_WIDTH, TILE_HEIGHT);
    }

    for (var i = 0; i < this.bullets.length; i++) {
        this.bullets[i].draw(0);

        if (loopIterations === 0 && currentLevel === GameState_e.LEVEL_ONE) { // Level 1: 1st wave of enemies (1st map iteration)
            this.bullets[i].EnemyCollisionCheck(GAME_INST.enemyObjects, GameState_e.LEVEL_ONE);
        }
        else if (loopIterations === 0 && currentLevel === GameState_e.LEVEL_TWO) { // Level 2: 1st wave of enemies (1st map iteration)
            this.bullets[i].EnemyCollisionCheck(GAME_INST.enemyObjects3, GameState_e.LEVEL_TWO);
        }
        else if (loopIterations === 0 && currentLevel === GameState_e.LEVEL_THREE) { // Level 3: 1st wave of enemies (1st map iteration)
            this.bullets[i].EnemyCollisionCheck(GAME_INST.enemyObjects5, GameState_e.LEVEL_THREE);
        }
        else if (loopIterations === 1 && currentLevel === GameState_e.LEVEL_ONE) { // Level 1: 2nd wave of enemies (2nd map iteration)
            this.bullets[i].EnemyCollisionCheck(GAME_INST.enemyObjects2, GameState_e.LEVEL_ONE);
        }
        else if (loopIterations === 1 && currentLevel === GameState_e.LEVEL_TWO) { // Level 2: 2nd wave of enemies (2nd map iteration)
            this.bullets[i].EnemyCollisionCheck(GAME_INST.enemyObjects4, GameState_e.LEVEL_TWO);
        }
        else if (loopIterations === 1 && currentLevel === GameState_e.LEVEL_THREE) { // Level 3: 2nd wave of enemies (2nd map iteration)
            this.bullets[i].EnemyCollisionCheck(GAME_INST.enemyObjects6, GameState_e.LEVEL_THREE);
        }
        else if (currentLevel === GameState_e.FINAL_STAGE) { // Level 3: 2nd wave of enemies (2nd map iteration)
            this.bullets[i].EnemyCollisionCheck(GAME_INST.finalBoss, GameState_e.FINAL_STAGE);
        }

        // Make sure to keep the array at a manageable iteration size so as to not bog down the game
        if (this.bullets.length > 100) {
            this.bullets.splice(0, 1);
        }
    }
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
    this.aimSpeed = 2;  // Aiming time delay in milliseconds
    
    this.bullets = [];
    this.bulletSpeed = -6;
    this.tankShells = [];
    this.laser = new laserObj(this.x, this.y);
    this.laserOn = false;
    this.tankShellSpeed = -10;
    this.autoFireEnabled = false;
    this.prevFrameCount = 0;

    this.fireRate = 8;
    this.cannonFireRate = 14;

    this.boostAvailable = 100;
    this.rechargeNeeded = false;
    this.rechargeTime = 300;

    this.health = 100;
    this.miniGunEnabled = false;
    this.shotGunEnabled = false;
};

tankUpgradedObj.prototype.draw = function(frameCount, currentLevel) {
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
    self.y -= 1;
    if (DISABLE.SPACE === false && self.boostAvailable > 0 && self.boostAvailable > 3) {
        self.speed = 5;
        self.boostAvailable -= 4;  // Decrement the available boost left
        // if (self.boostAvailable === 0) {
        //     self.rechargeNeeded = true;
        // }
    }
    else {
        // self.y -= 1;
        self.speed = 3;
        if (self.boostAvailable < 400) {
            self.boostAvailable++;
        }
        
        // if (self.rechargeNeeded) {
        //     self.rechargeTime--;
        // }
        // if (self.rechargeTime === 0) {  // Force the recharge to take twice as long as the player can spend the boost
        //     self.rechargeNeeded = false;
        //     self.boostAvailable = 100;
        //     self.rechargeTime = 300;
        // }
    }

    // Animated tank track movement for the main character
    if (-frameCount % 15 < 5) { // 0 -> 3
        image(Assets_t.PANZER1, self.x, self.y, TILE_WIDTH, TILE_HEIGHT);
    }
    else if (-frameCount % 15 >= 5 && frameCount % 15 < 10) { // 4 -> 7
        image(Assets_t.PANZER2, self.x, self.y, TILE_WIDTH, TILE_HEIGHT);
    }
    else if (-frameCount % 15 >= 10 && frameCount % 15 < 15) { // 8 -> 11
        image(Assets_t.PANZER3, self.x, self.y, TILE_WIDTH, TILE_HEIGHT);
    }

    //image(Assets_t.PANZER, this.x, this.y, TILE_WIDTH, TILE_HEIGHT);

    // Aiming (rotation/translation) of the tank gun
    if (!DISABLE.LEFT) {
        this.currGunAngle -= this.aimSpeed;
    }
    if (!DISABLE.RIGHT) {
        this.currGunAngle += this.aimSpeed;
    }
    
    // Rotate the tank gun
    pushMatrix();
    translate(this.x + TILE_WIDTH / 2, this.y + TILE_HEIGHT / 2);  // Move to the center of rotation
    rotate(radians(this.currGunAngle));
    translate( -(this.x + TILE_WIDTH / 2), -(this.y + TILE_HEIGHT / 2));  // Move back
    image(Assets_t.PANZER_GUN, this.x, this.y, TILE_WIDTH, TILE_HEIGHT);
    popMatrix();

    if (!DISABLE.DOWN) {
        this.autoFireEnabled = !this.autoFireEnabled;  // toggle the auto fire enabled option
        this.autoFireToggled = true;
        //this.laserOn = true;
    }
    if (!DISABLE.UP || this.autoFireEnabled) {  // Fire the gun
        if (frameCount % this.fireRate === 0) {
            if (!this.shotGunEnabled) {
                this.bullets.push(new bulletObj(this.x + TILE_WIDTH / 2, this.y - TILE_WIDTH / 6, this.bulletSpeed));
            }
            else {  // Shotgun enabled
                this.bullets.push(new shotBulletObj(this.x + TILE_WIDTH / 2, this.y - TILE_WIDTH / 6, this.bulletSpeed));
            }
            if (this.miniGunEnabled) {
                this.fireRate = 4;
            }
        }   
        
        // Load tank shells 
        if (frameCount % this.cannonFireRate === 0) { 
            this.tankShells.push(new tankShellObj(
                this.x + TILE_WIDTH / 2, 
                this.y + TILE_WIDTH / 2, 
                this.tankShellSpeed, 
                radians(this.currGunAngle + 90)));
        }
        //this.laserOn = true;
        this.laser = new laserObj(this.x + TILE_WIDTH / 2, this.y);
    }
    
    // Draw the regular machine gun bullets
    for (var i = 0; i < this.bullets.length; i++) {
        fill(186, 140, 0);
        this.bullets[i].draw(0);
        if (loopIterations === 0 && currentLevel === GameState_e.LEVEL_ONE) { // Level 1: 1st wave of enemies (1st map iteration)
            this.bullets[i].EnemyCollisionCheck(GAME_INST.enemyObjects, GameState_e.LEVEL_ONE);
        }
        else if (loopIterations === 0 && currentLevel === GameState_e.LEVEL_TWO) { // Level 2: 1st wave of enemies (1st map iteration)
            this.bullets[i].EnemyCollisionCheck(GAME_INST.enemyObjects3, GameState_e.LEVEL_TWO);
        }
        else if (loopIterations === 0 && currentLevel === GameState_e.LEVEL_THREE) { // Level 3: 1st wave of enemies (1st map iteration)
            this.bullets[i].EnemyCollisionCheck(GAME_INST.enemyObjects5, GameState_e.LEVEL_THREE);
        }
        else if (loopIterations === 1 && currentLevel === GameState_e.LEVEL_ONE) { // Level 1: 2nd wave of enemies (2nd map iteration)
            this.bullets[i].EnemyCollisionCheck(GAME_INST.enemyObjects2, GameState_e.LEVEL_ONE);
        }
        else if (loopIterations === 1 && currentLevel === GameState_e.LEVEL_TWO) { // Level 2: 2nd wave of enemies (2nd map iteration)
            this.bullets[i].EnemyCollisionCheck(GAME_INST.enemyObjects4, GameState_e.LEVEL_TWO);
        }
        else if (loopIterations === 1 && currentLevel === GameState_e.LEVEL_THREE) { // Level 3: 2nd wave of enemies (2nd map iteration)
            this.bullets[i].EnemyCollisionCheck(GAME_INST.enemyObjects6, GameState_e.LEVEL_THREE);
        }
        else if (currentLevel === GameState_e.FINAL_STAGE) { // Level 3: 2nd wave of enemies (2nd map iteration)
            this.bullets[i].EnemyCollisionCheck(GAME_INST.finalBoss, GameState_e.FINAL_STAGE);
        }

        // Make sure to keep the array at a manageable iteration size so as to not bog down the game
        if (this.bullets.length > 100) {
            this.bullets.splice(0, 1);
        }
    }

    // Draw the cannon turret tank shells
    for (var i = 0; i < this.tankShells.length; i++) {
        this.tankShells[i].draw(this.currGunAngle);
        if (loopIterations === 0 && currentLevel === GameState_e.LEVEL_ONE) { // Level 1: 1st wave of enemies (1st map iteration)
            this.tankShells[i].EnemyCollisionCheck(GAME_INST.enemyObjects, GameState_e.LEVEL_ONE);
        }
        else if (loopIterations === 0 && currentLevel === GameState_e.LEVEL_TWO) { // Level 2: 1st wave of enemies (1st map iteration)
            this.tankShells[i].EnemyCollisionCheck(GAME_INST.enemyObjects3, GameState_e.LEVEL_TWO);
        }
        else if (loopIterations === 0 && currentLevel === GameState_e.LEVEL_THREE) { // Level 3: 1st wave of enemies (1st map iteration)
            this.tankShells[i].EnemyCollisionCheck(GAME_INST.enemyObjects5, GameState_e.LEVEL_THREE);
        }
        else if (loopIterations === 1 && currentLevel === GameState_e.LEVEL_ONE) { // Level 1: 2nd wave of enemies (2nd map iteration)
            this.tankShells[i].EnemyCollisionCheck(GAME_INST.enemyObjects2, GameState_e.LEVEL_ONE);
        }
        else if (loopIterations === 1 && currentLevel === GameState_e.LEVEL_TWO) { // Level 2: 2nd wave of enemies (2nd map iteration)
            this.tankShells[i].EnemyCollisionCheck(GAME_INST.enemyObjects4, GameState_e.LEVEL_TWO);
        }
        else if (loopIterations === 1 && currentLevel === GameState_e.LEVEL_THREE) { // Level 3: 2nd wave of enemies (2nd map iteration)
            this.tankShells[i].EnemyCollisionCheck(GAME_INST.enemyObjects6, GameState_e.LEVEL_THREE);
        }
        else if (currentLevel === GameState_e.FINAL_STAGE) { // Level 3: 2nd wave of enemies (2nd map iteration)
            this.tankShells[i].EnemyCollisionCheck(GAME_INST.finalBoss, GameState_e.FINAL_STAGE);
        }

        // Make sure to keep the array at a manageable iteration size so as to not bog down the game
        if (this.tankShells.length > 100) {
            this.tankShells.splice(0, 1);
        }
    }
    
    // laser gun option
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
    }
};

var checkCollisionWithEnemies = function(tank, enemyObjects) {
    for (var i = 0; i < enemyObjects.length; i++) {
        var within_x = tank.x > round(enemyObjects[i].position.x) - TILE_WIDTH / 2 && tank.x < round(enemyObjects[i].position.x) + TILE_WIDTH / 2;
        var within_y = tank.y > round(enemyObjects[i].position.y) - TILE_HEIGHT * 3 / 2 && tank.y < round(enemyObjects[i].position.y) + TILE_HEIGHT * 3 / 2;
        
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

var checkCollisionWithBoss = function(tank, enemyBoss) {
    var within_base_x = tank.x > round(enemyBoss.base_x) && tank.x < round(enemyBoss.base_x + enemyBoss.base_width);
    var within_base_y = tank.x > round(enemyBoss.base_y) && tank.x < round(enemyBoss.base_y + enemyBoss.base_height);
    var within_front_x = tank.x > round(enemyBoss.front_x) && tank.x < round(enemyBoss.front_x + enemyBoss.front_width);
    var within_front_y = tank.y > round(enemyBoss.front_y) && tank.y < round(enemyBoss.front_y + enemyBoss.front_height);

    //var within_x = tank.x > round(enemyBoss.position.x) - BOSS_WIDTH / 2 && tank.x < round(enemyBoss.position.x) + BOSS_WIDTH / 2;
    //var within_y = tank.y > round(enemyBoss.position.y) - BOSS_HEIGHT * 3 / 2 && tank.y < round(enemyBoss.position.y) + BOSS_HEIGHT * 3 / 2;
        
    if ((within_base_x && within_base_y) || (within_front_x && within_front_y) && !enemyBoss.defeated) {  // Check that object has not already been collected
        // Inflict collateral damage
        tank.health -= 1;
        enemyBoss.health -= 1;
        if (enemyBoss.health < 0) {
            enemyBoss.defeated = true
            GAME_INST.score += 5;
        }
        return true;
    }
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
    // Draw the health image pickup
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

var enemy1Obj = function(x, y) {
    this.position = new PVector(x, y);
    this.step = new PVector(0, 0);
    this.wanderAngle = random(0, 180);
    this.wanderDistance = random(0, 100);
    this.pursueTarget = new PVector(0, 0);
    this.defeated = false;
    this.health = 20;
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

    if (this.position.x > 802) {this.position.x = -2;}
    else if (this.position.x < -2) {this.position.x = 802;}
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
    this.health = 30;
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
            // this.bullets[i].hitTank();
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

    if (this.position.x > 810) {this.position.x = -5;}
    else if (this.position.x < -5) {this.position.x = 810;}
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
    this.health = 50;
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
            // this.bullets[i].hitTank();
            this.bullets[i].TankCollsionCheck();
        }
    }
}

enemy3Obj.prototype.wander = function() {
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

    if (this.position.x > 810) {this.position.x = -5;}
    else if (this.position.x < -5) {this.position.x = 810;}
    if (this.position.y > (oldY + 30)) {this.position.y = (oldY - 30);}
    else if (this.position.y < (oldY - 30)) {this.position.y = (oldY + 30);}
};

var enemy4Obj = function(x, y, s) {
    this.position = new PVector(x, y);
    this.step = new PVector(0, 0);
    this.wanderAngle = random(0, 180);
    this.wanderDistance = random(0, 600);
    this.pursueTarget = new PVector(0, 0);
    this.defeated = false;
    this.health = 60;
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
            // this.bullets[i].hitTank();
            this.bullets[i].TankCollsionCheck();
        }
    }
}

enemy4Obj.prototype.wander = function() {
    var temp = (panzer.y+loopCount - SCREEN_HEIGHT * 1 / 20);
    if (dist(panzer.x, temp, this.position.x, this.position.y) > 5) {
        this.step.set((panzer.x - this.position.x), temp - this.position.y);
        this.step.normalize();
        // this.step.mult(2);
        this.position.add(this.step);
    }
};

var bossEnemy = function(x, y) {
    this.originalPosition = [x, y];
    this.position = new PVector(x, y);
    this.wanderMaxY = 150;
    this.wanderMaxX = 150;
    this.step = new PVector(0, 0);
    this.wanderAngle = random(0, 180);
    this.wanderDistance = random(0, 100);
    this.pursueTarget = new PVector(0, 0);
    this.defeated = false;
    this.health = 400;
    this.objectType = ObjectType_e.ENEMY;

    this.rightGun = [];
    this.leftGun = [];
    this.centerGun = [];

    this.rechargeCount = 300;
    this.rechargeNeeded = false;
    this.shotGunBulletSpeed = 7;
    this.bulletSpeed = 9;

    this.front_x = this.position.x + BOSS_WIDTH / 8;
    this.front_y = this.position.y - BOSS_HEIGHT / 2;
    this.front_width = BOSS_WIDTH * 3 / 4;
    this.front_height = BOSS_HEIGHT * 3 / 4;

    this.base_x = this.position.x;
    this.base_y = this.position.y;
    this.base_width = BOSS_WIDTH;
    this.base_height = BOSS_HEIGHT;

    this.left_turret_x = this.position.x;
    this.left_turret_y = this.position.y + BOSS_HEIGHT / 2;
    this.left_turret_width = BOSS_WIDTH / 2;
    this.left_turret_height = BOSS_HEIGHT / 2;

    this.right_turret_x = this.position.x + BOSS_WIDTH / 2;
    this.right_turret_y = this.position.y + BOSS_HEIGHT / 2;
    this.right_turret_width = BOSS_WIDTH / 2;
    this.right_turret_height = BOSS_HEIGHT / 2;
};

bossEnemy.prototype.draw = function() {
    if (!this.defeated) {
        image(Assets_t.BOSS_FRONT, this.front_x, this.front_y, this.front_width, this.front_height);
        image(Assets_t.BOSS_BASE, this.base_x, this.base_y, this.base_width, this.base_height);
        image(Assets_t.ENEMY_TURRET, this.left_turret_x, this.left_turret_y, this.left_turret_width, this.left_turret_height); // Draw left gun
        image(Assets_t.ENEMY_TURRET, this.right_turret_x, this.right_turret_y, this.right_turret_width, this.right_turret_height); // Draw right gun

        this.front_x = this.position.x + BOSS_WIDTH / 8;
        this.front_y = this.position.y - BOSS_HEIGHT / 2;
        this.base_x = this.position.x;
        this.base_y = this.position.y;
        this.left_turret_x = this.position.x;
        this.left_turret_y = this.position.y + BOSS_HEIGHT / 2;
        this.right_turret_x = this.position.x + BOSS_WIDTH / 2;
        this.right_turret_y = this.position.y + BOSS_HEIGHT / 2;

        stroke();
        fill(50, 230, 50);
        rect(this.position.x, MAP_OFFSET + this.position.y, 200, 10);
        fill(240, 30, 30);
        rect(this.position.x - this.health / 2, MAP_OFFSET + this.position.y, 200 - panzer.health / 2, 10);
        noStroke();

        if (this.rechargeCount <= 0) {
            this.rechargeNeeded = true;
        }

        if (this.rechargeNeeded) {
            this.rechargeCount += 2;
            if (this.rechargeCount >= 200) {
                this.rechargeNeeded = false;
            }
        }
        
        if (!this.rechargeNeeded) {
            this.rechargeCount -= 1;
        }
        
        // add bullet to bullet list
        if (loopCount % 10 === 0 && !this.rechargeNeeded) {
            this.rightGun.push(new bulletObj(this.right_turret_x + BOSS_WIDTH / 4, this.position.y + BOSS_HEIGHT, this.bulletSpeed));
        }

        if (loopCount % 10 === 0 && !this.rechargeNeeded) {
            this.leftGun.push(new bulletObj(this.left_turret_x + BOSS_WIDTH / 4, this.position.y + BOSS_HEIGHT, this.bulletSpeed));
        }

        if (loopCount % 10 === 0 && !this.rechargeNeeded) {
            var spreadVariation = round(20 - (this.rechargeCount % 200) / 10);
            this.centerGun.push(new shotBulletObj(this.base_x + BOSS_WIDTH / 2, this.base_y + BOSS_HEIGHT * 2 / 3, this.bulletSpeed, spreadVariation));
        }
        
        for (var i = 0; i < this.rightGun.length; i++) {
            this.rightGun[i].draw();
            this.rightGun[i].TankCollsionCheck();
        }

        for (var i = 0; i < this.leftGun.length; i++) {
            this.leftGun[i].draw();
            this.leftGun[i].TankCollsionCheck();
        }

        for (var i = 0; i < this.centerGun.length; i++) {
            this.centerGun[i].draw();
            this.centerGun[i].TankCollsionCheck();
        }
    }
};

bossEnemy.prototype.wander = function() {
    var oldY = this.position.y;
    
    // Check Y bounds of wander box
    if (this.position.y > this.originalPosition[1] + this.wanderMaxY) {
        if (sin(this.wanderAngle) > 0) {
            this.step.set(0, -sin(this.wanderAngle));
        }
        else {
            this.step.set(0, sin(this.wanderAngle));
        }
        //this.step.set(0, sin(this.wanderAngle));
        this.position.add(this.step);
    }
    else if (this.position.y < this.originalPosition[1] - this.wanderMaxY) {
        if (sin(this.wanderAngle) < 0) {  
            this.step.set(0, -sin(this.wanderAngle)); // Force step y value to be positive
        }
        else {
            this.step.set(0, sin(this.wanderAngle));
        }
        this.position.add(this.step);
    }
    else {
        this.step.set(0, sin(this.wanderAngle));
        this.position.add(this.step);
    }

    // Check X bounds of wander box
    if (this.position.x > this.originalPosition[0] + this.wanderMaxX) {
        if (cos(this.wanderAngle) > 0) {
            this.step.set(-cos(this.wanderAngle), 0);
        }
        else {
            this.step.set(cos(this.wanderAngle), 0);
        }
        this.position.add(this.step);
    }
    else if (this.position.x < this.originalPosition[0] - this.wanderMaxX) {
        if (cos(this.wanderAngle) < 0) {  
            this.step.set(-cos(this.wanderAngle), 0); // Force step y value to be positive
        }
        else {
            this.step.set(cos(this.wanderAngle), 0);
        }
        this.position.add(this.step);
    }
    else {
        this.step.set(cos(this.wanderAngle), 0);
        this.position.add(this.step);
    }
    // this.wanderAngle += random(-15, 15);

    this.wanderDistance--;
    if (this.wanderDistance < 0) {
        this.wanderDistance = random(40, 60);
        this.wanderAngle += random(-90, 90);
    }

    if (this.position.x > 800) {
        this.position.x = 10;
    }
    else if (this.position.x < 5) {
        this.position.x = 790;
    }
    if (this.position.y > (oldY + 150)) {
        this.position.y = (oldY - 10);
    }
    else if (this.position.y < (oldY - 150)) {
        this.position.y = (oldY + 10);
    }
}

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

/*
 * The game object contains all game relevant data
 */ 
var gameObj = function() {
    // Level 1 tilemaps
    this.tilemap = [];
    // this.tilemap2 = [];

    // Level 2 tilemaps
    this.tilemap3 = [];
    // this.tilemap4 = [];

    // Level 3 tilemaps
    this.tilemap5 = [];
    // this.tilemap6 = [];
    
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

    this.bossArray = [];

    this.currentLevel;
    this.mainCharacter;
};

/*
 * Options for the difficulty of the tilemap
 * EASY = fewer enemies, easy to medium enemies only, most health pickups
 * MEDIUM = moderate amount of enemies, easy to hard enemies, fewer health pickups
 * HARD = most amount of enemies, easy to expert enemies, fewest health pickups
 */
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
var createRandomizedTileMap = function(tMap, difficulty) {
    var lineLength = 12;

    switch(difficulty) { // Generate a random tilemap based on the difficulty specified
        
        /* 
         * ----------------------------
         * |  Easy tilemap generator  |
         * ----------------------------
         */
        case MapDifficulty_e.EASY:

            // Ratio of enemy types to be chosen from and inserted in the lines
            var enemySymbols = ['a', 'a', 'b'];

            // Array to control the number of enemies spawned per line
            var probability = [0, 0, 0, 0, 0, 1, 1, 2]; 

            // Most amount of health pickups allowed
            var healthLine  = "     h      ";

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
                if (i === 20) {
                    line = healthLine;
                }
                else {
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
                }

                // Finally, add the randomly assembled line to the tilemap
                tMap.push(line);
            }
            tMap.push("            ");
            tMap.push("            ");
            // if (iterNum === 1) {
                tMap.push("     y      ");
            // }
            // else {
            //     tMap.push("            ");
            // }
            tMap.push("            ");
            tMap.push("            ");
            tMap.push("            ");
            tMap.push("            ");
            tMap.push("            ");
            break;

        /* 
         * ------------------------------
         * |  Medium tilemap generator  |
         * ------------------------------
         */
        case MapDifficulty_e.MEDIUM:
            // Ratio of enemy types to be chosen from and inserted in the lines
            var enemySymbols = ['a', 'a', 'b', 'c'];
            
            // Array to control the number of enemies spawned per line
            var probability = [0, 0, 0, 0, 1, 1, 1, 2, 2, 3];

            // Most amount of health pickups allowed
            var maxHealthPickups = 3;
            var numHealthPickups = round(random(1, maxHealthPickups)); 
            var healthPickUpCount = 0;
            var healthLines = [
                "  h         ",
                "        h   ",
                "       h    ",
            ];
            var count = 0;

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
                if (i % 15 === 0 && i != 0 && count < healthLines.length) {
                    line = healthLines[count];
                    count++;
                }
                else {
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
                }

                // Finally, add the randomly assembled line to the tilemap
                tMap.push(line);
            }
            tMap.push("            ");
            tMap.push("            ");
            tMap.push("            ");
            // if (iterNum === 1) {
                tMap.push("         m  ");  // m = minigun
            // }
            // else {
            //     tMap.push("            ");
            // }
            tMap.push("            ");
            tMap.push("            ");
            tMap.push("            ");
            tMap.push("            ");
            break;

        /* 
         * ----------------------------
         * |  Hard tilemap generator  |
         * ----------------------------
         */
        case MapDifficulty_e.HARD:
            // Ratio of enemy types to be chosen from and inserted in the lines
            var enemySymbols = ['a', 'a', 'a', 'b', 'b', 'c', 'c', 'd'];

            // Array to control the number of enemies spawned per line
            var probability = [0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4];
            
            // Most amount of health pickups allowed
            var maxHealthPickups = 4;
            var numHealthPickups = round(random(1, maxHealthPickups)); 
            var healthPickUpCount = 0;
            var healthLines = [
                "      h     ",
                "         h  ",
                "  h         ",
                "     h      ",
            ];
            var count = 0;

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
                if (i % 10 === 0 && i != 0 && count < healthLines.length) {
                    line = healthLines[count];
                    count++;
                }
                else {
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
                }

                // Finally, add the randomly assembled line to the tilemap
                tMap.push(line);
            }
            tMap.push("            ");
            tMap.push("            ");
            tMap.push("            ");
            // if (iterNum === 1) {
                tMap.push("    s       ");  // s = shotgun
            // }
            // else {
            //     tMap.push("            ");
            // }
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
    createRandomizedTileMap(this.tilemap, MapDifficulty_e.EASY);
    // createRandomizedTileMap(this.tilemap2, MapDifficulty_e.EASY, 2);
    
    // Create custom tilemaps for level 2
    createRandomizedTileMap(this.tilemap3, MapDifficulty_e.MEDIUM);
    //createRandomizedTileMap(this.tilemap4, MapDifficulty_e.MEDIUM);
    
    // Create custom tilemaps for level 3
    createRandomizedTileMap(this.tilemap5, MapDifficulty_e.HARD);
    //createRandomizedTileMap(this.tilemap6, MapDifficulty_e.HARD);
    
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
                case 'z':
                    this.finalBoss = new bossEnemy(j * TILE_WIDTH, i * TILE_HEIGHT);
                    break;
                default:
                    break;
            }
        }
    }

    // Initialize 2nd iteration of the 1st level
    // for (var i = 0; i < this.tilemap2.length; i++) {  
    //     for (var j = 0; j < this.tilemap2[i].length; j++) {
    //         switch (this.tilemap2[i][j]) {
    //             case 'a':
    //                 this.enemyObjects2.push(new enemy1Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
    //                 break;
    //             case 'b':
    //                 this.enemyObjects2.push(new enemy2Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
    //                 break;
    //             case 'c':
    //                 this.enemyObjects2.push(new enemy3Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
    //                 break;
    //             case 'd':
    //                 this.enemyObjects2.push(new enemy4Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
    //                 break;
    //             case 'y':
    //                 this.gameObjects2.push(new upgradedObj(j * TILE_WIDTH, i * TILE_HEIGHT));
    //                 break;
    //             case 'm':
    //                 this.gameObjects2.push(new miniGunPickUp(j * TILE_WIDTH, i * TILE_HEIGHT));
    //                 break;
    //             case 's':
    //                 this.gameObjects2.push(new shotGunPickUp(j * TILE_WIDTH, i * TILE_HEIGHT));
    //                 break;
    //             case 'h':
    //                 this.gameObjects2.push(new healthPickUp(j * TILE_WIDTH, i * TILE_HEIGHT));
    //                 break;
    //             case 'z':
    //                 this.finalBoss = new bossEnemy(j * TILE_WIDTH, i * TILE_HEIGHT);
    //                 break;
    //             default:
    //                 break;
    //         }
    //     }
    // }

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
                case 'z':
                    this.finalBoss = new bossEnemy(j * TILE_WIDTH, i * TILE_HEIGHT);
                    break;
                default:
                    break;
            }
        }
    }

    // Initialize 2nd iteration of the 2nd level
    // for (var i = 0; i < this.tilemap4.length; i++) {  
    //     for (var j = 0; j < this.tilemap4[i].length; j++) {
    //         switch (this.tilemap4[i][j]) {
    //             case 'a':
    //                 this.enemyObjects4.push(new enemy1Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
    //                 break;
    //             case 'b':
    //                 this.enemyObjects4.push(new enemy2Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
    //                 break;
    //             case 'c':
    //                 this.enemyObjects4.push(new enemy3Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
    //                 break;
    //             case 'd':
    //                 this.enemyObjects4.push(new enemy4Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
    //                 break;
    //             case 'y':
    //                 this.gameObjects4.push(new upgradedObj(j * TILE_WIDTH, i * TILE_HEIGHT));
    //                 break;
    //             case 'm':
    //                 this.gameObjects4.push(new miniGunPickUp(j * TILE_WIDTH, i * TILE_HEIGHT));
    //                 break;
    //             case 's':
    //                 this.gameObjects4.push(new shotGunPickUp(j * TILE_WIDTH, i * TILE_HEIGHT));
    //                 break;
    //             case 'h':
    //                 this.gameObjects4.push(new healthPickUp(j * TILE_WIDTH, i * TILE_HEIGHT));
    //                 break;
    //             case 'z':
    //                 this.finalBoss = new bossEnemy(j * TILE_WIDTH, i * TILE_HEIGHT);
    //                 break;
    //             default:
    //                 break;
    //         }
    //     }
    // }

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
                case 'z':
                    this.finalBoss = new bossEnemy(j * TILE_WIDTH, i * TILE_HEIGHT);
                    break;
                default:
                    break;
            }
        }
    }

    // Initialize 2nd iteration of the 1st level
    // for (var i = 0; i < this.tilemap6.length; i++) {  
    //     for (var j = 0; j < this.tilemap6[i].length; j++) {
    //         switch (this.tilemap6[i][j]) {
    //             case 'a':
    //                 this.enemyObjects6.push(new enemy1Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
    //                 break;
    //             case 'b':
    //                 this.enemyObjects6.push(new enemy2Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
    //                 break;
    //             case 'c':
    //                 this.enemyObjects6.push(new enemy3Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
    //                 break;
    //             case 'd':
    //                 this.enemyObjects6.push(new enemy4Obj(j * TILE_WIDTH, i * TILE_HEIGHT));
    //                 break;
    //             case 'y':
    //                 this.gameObjects6.push(new upgradedObj(j * TILE_WIDTH, i * TILE_HEIGHT));
    //                 break;
    //             case 'm':
    //                 this.gameObjects6.push(new miniGunPickUp(j * TILE_WIDTH, i * TILE_HEIGHT));
    //                 break;
    //             case 's':
    //                 this.gameObjects6.push(new shotGunPickUp(j * TILE_WIDTH, i * TILE_HEIGHT));
    //                 break;
    //             case 'h':
    //                 this.gameObjects6.push(new healthPickUp(j * TILE_WIDTH, i * TILE_HEIGHT));
    //                 break;
    //             case 'z':
    //                 this.finalBoss = new bossEnemy(j * TILE_WIDTH, i * TILE_HEIGHT);
    //                 break;
    //             default:
    //                 break;
    //         }
    //     }
    // }

    this.finalBoss = new bossEnemy( (SCREEN_WIDTH / 4), 44 * TILE_HEIGHT);
    this.finalHealthPickups = [
        new healthPickUp((SCREEN_WIDTH / 4), 48 * TILE_HEIGHT),
        new healthPickUp((SCREEN_WIDTH * 3 /4), 48 * TILE_HEIGHT),
    ]
    // this.panzer = createTank(
    //     SCREEN_WIDTH / 2 - TILE_WIDTH / 2, 
    //     -loopCount + SCREEN_HEIGHT * 2 / 3, 
    //     tankSpeed, 
    //     TankOptions_e.BASIC);
    //this.bossArray.push(new bossEnemy(SCREEN_WIDTH / 0));
};

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

gameObj.prototype.drawFinalStage = function() {
    image(GameScreens_t.LEVEL_THREE, 0, 0);
    // for (var i = 0; i < this.finalHealthPickups.length; i++) {
    //     this.finalHealthPickups[i].draw(this.loopCount);
    // }
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
var animatedLoseScreen = function(animationCount, score) {
    stroke();
    fill(240, 30, 30);
    var x_pos = 500;
    var y_pos = 350;
    var msg = "Final Score: ";
    if (animationCount < loseAnimationLength) {
        image(GameScreens_t.LOSE_SCREEN_TRANSITIONS[0], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(32);
        text(msg + score, x_pos, y_pos);
    }
    else if (animationCount >= loseAnimationLength * 1 && animationCount < loseAnimationLength * 2) {
        image(GameScreens_t.LOSE_SCREEN_TRANSITIONS[1], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(33);
        text(msg + score, x_pos - 1, y_pos - 1);
    }
    else if (animationCount >= loseAnimationLength * 2 && animationCount < loseAnimationLength * 3) {
        image(GameScreens_t.LOSE_SCREEN_TRANSITIONS[2], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(34);
        text(msg + score, x_pos - 2, y_pos - 2);
    }
    else if (animationCount >= loseAnimationLength * 3 && animationCount < loseAnimationLength * 4) {
        image(GameScreens_t.LOSE_SCREEN_TRANSITIONS[3], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(33);
        text(msg + score, x_pos - 1, y_pos - 1);
    }
    else if (animationCount >= loseAnimationLength * 4 && animationCount < loseAnimationLength * 5) {
        image(GameScreens_t.LOSE_SCREEN_TRANSITIONS[4], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(32);
        text(msg + score, x_pos, y_pos);
    }
    else if (animationCount >= loseAnimationLength * 5 && animationCount < loseAnimationLength * 6) {
        image(GameScreens_t.LOSE_SCREEN_TRANSITIONS[5], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(31);
        text(msg + score, x_pos + 1, y_pos + 1);
    }
    else if (animationCount >= loseAnimationLength * 6 && animationCount < loseAnimationLength * 7) {
        image(GameScreens_t.LOSE_SCREEN_TRANSITIONS[6], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(30);
        text(msg + score, x_pos + 2, y_pos + 2);
    }
    else if (animationCount >= loseAnimationLength * 7 && animationCount < loseAnimationLength * 8) {
        image(GameScreens_t.LOSE_SCREEN_TRANSITIONS[7], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(31);
        text(msg + score, x_pos + 1, y_pos + 1);
    }
    noStroke();
};

/*
 * Pass in a loop counter to track how many loop passes have been made
 */
prevTime = 0;
var winAnimationLength = 5;
var numWinAnimationFrames = 24;
var animatedWinScreen = function(animationCount, score) {
    stroke();
    fill(240, 30, 30);
    var x_pos = 500;
    var y_pos = 300;
    var msg = "Final Score";
    if (animationCount < winAnimationLength) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[0], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(32);
        text(msg + score, x_pos, y_pos);
    }
    else if (animationCount >= winAnimationLength * 1 && animationCount < winAnimationLength * 2) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[1], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(31);
        text(msg + score, x_pos + 1, y_pos + 1);
    }
    else if (animationCount >= winAnimationLength * 2 && animationCount < winAnimationLength * 3) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[2], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(30);
        text(msg + score, x_pos + 2, y_pos + 2);
    }
    else if (animationCount >= winAnimationLength * 3 && animationCount < winAnimationLength * 4) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[3], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(31);
        text(msg + score, x_pos + 1, y_pos + 1);
    }
    else if (animationCount >= winAnimationLength * 4 && animationCount < winAnimationLength * 5) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[4], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(32);
        text(msg + score, x_pos, y_pos);
    }
    else if (animationCount >= winAnimationLength * 5 && animationCount < winAnimationLength * 6) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[5], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(33);
        text(msg + score, x_pos - 1, y_pos - 1);
    }
    else if (animationCount >= winAnimationLength * 6 && animationCount < winAnimationLength * 7) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[6], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(34);
        text(msg + score, x_pos - 2, y_pos - 2);
    }
    else if (animationCount >= winAnimationLength * 7 && animationCount < winAnimationLength * 8) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[7], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(33);
        text(msg + score, x_pos - 1, y_pos - 1);
    }
    else if (animationCount >= winAnimationLength * 8 && animationCount < winAnimationLength * 9) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[8], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(32);
        text(msg + score, x_pos, y_pos);
    }
    else if (animationCount >= winAnimationLength * 9 && animationCount < winAnimationLength * 10) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[9], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(31);
        text(msg + score, x_pos + 1, y_pos + 1);
    }
    else if (animationCount >= winAnimationLength * 10 && animationCount < winAnimationLength * 11) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[10], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(30);
        text(msg + score, x_pos + 2, y_pos + 2);
    }
    else if (animationCount >= winAnimationLength * 11 && animationCount < winAnimationLength * 12) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[11], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(31);
        text(msg + score, x_pos + 1, y_pos + 1);
    }
    else if (animationCount >= winAnimationLength * 12 && animationCount < winAnimationLength * 13) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[12], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(32);
        text(msg + score, x_pos, y_pos);
    }
    else if (animationCount >= winAnimationLength * 13 && animationCount < winAnimationLength * 14) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[13], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(33);
        text(msg + score, x_pos - 1, y_pos - 1);
    }
    else if (animationCount >= winAnimationLength * 14 && animationCount < winAnimationLength * 15) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[14], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(34);
        text(msg + score, x_pos - 2, y_pos - 2);
    }
    else if (animationCount >= winAnimationLength * 15 && animationCount < winAnimationLength * 16) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[15], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(33);
        text(msg+ score, x_pos - 1, y_pos - 1);
    }
    else if (animationCount >= winAnimationLength * 16 && animationCount < winAnimationLength * 17) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[16], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(32);
        text(msg + score, x_pos, y_pos);
    }
    else if (animationCount >= winAnimationLength * 17 && animationCount < winAnimationLength * 18) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[17], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(31);
        text(msg + score, x_pos + 1, y_pos + 1);
    }
    else if (animationCount >= winAnimationLength * 18 && animationCount < winAnimationLength * 19) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[18], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(30);
        text(msg + score, x_pos + 2, y_pos + 2);
    }
    else if (animationCount >= winAnimationLength * 19 && animationCount < winAnimationLength * 20) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[19], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(31);
        text(msg + score, x_pos + 1, y_pos + 1);
    }
    else if (animationCount >= winAnimationLength * 20 && animationCount < winAnimationLength * 21) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[20], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);        
        textSize(32);
        text(msg + score, x_pos, y_pos);
    }
    else if (animationCount >= winAnimationLength * 21 && animationCount < winAnimationLength * 22) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[21], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(33);
        text(msg + score, x_pos - 1, y_pos - 1);
    }
    else if (animationCount >= winAnimationLength * 22 && animationCount < winAnimationLength * 23) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[22], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(34);
        text(msg + score, x_pos - 2, y_pos - 2);
    }
    else if (animationCount >= winAnimationLength * 23 && animationCount < winAnimationLength * 24) {
        image(GameScreens_t.WIN_SCREEN_TRANSITIONS[23], 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        textSize(33);
        text(msg + score, x_pos - 1, y_pos - 1);
    }
    noStroke();
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
var loopCount = -MAP_OFFSET;
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

var drawHUD_old = function() {
    // Life bar 
    stroke();
    fill(50, 230, 50);
    rect(80, -loopCount + SCREEN_HEIGHT * 1 / 30, 100, 10);
    fill(240, 30, 30);
    rect(180 - (100 - panzer.health), -loopCount + SCREEN_HEIGHT * 1 / 30, 100 - panzer.health, 10);

    // Boost bar
    fill(30, 30, 240);
    rect(100, -loopCount + SCREEN_HEIGHT * 23 / 24, 100, 10);
    fill(240, 30, 30);
    if (panzer.boostAvailable > 0) {
        rect(200 - (100 - panzer.boostAvailable), -loopCount + SCREEN_HEIGHT * 23 / 24, 100 - panzer.boostAvailable, 10);
        text("BOOST:  " + panzer.boostAvailable, 10,  -loopCount + SCREEN_HEIGHT * 39 / 40);
    }
    else {
        rect(
            200 - (floor(panzer.rechargeTime / 3)), 
            -loopCount + SCREEN_HEIGHT * 23 / 24, 
            floor(panzer.rechargeTime / 3), 
            10);
        text("BOOST:  " + (100 - floor(panzer.rechargeTime / 3)), 10,  -loopCount + SCREEN_HEIGHT * 39 / 40);
    } 

    // Display character's health as a part of the H.U.D.
    fill(240, 30, 30);
    textSize(14);
    text("LIFE:  " + panzer.health, 10, -loopCount + SCREEN_HEIGHT * 1 / 20);
    text("SCORE:  " + GAME_INST.score * 10, 700, -loopCount + SCREEN_HEIGHT * 1 / 20);
    noStroke();
}

var drawHUD = function() {
    noStroke();
    fill(50, 230, 50);
    rect(0, -loopCount + SCREEN_HEIGHT * 1 / 40, 13, 210);
    fill(240, 30, 30);
    // 180 - (100 - panzer.health)
    rect(0, -loopCount + SCREEN_HEIGHT * 1 / 40, 13, 210 - panzer.health * 2.1);

    image(Assets_t.HUD, 0, -loopCount, SCREEN_WIDTH, SCREEN_HEIGHT);
    
    // Rotate the tank gun
    pushMatrix();
    translate(52, -loopCount + 40);  // Move to the center of rotation
    println(panzer.boostAvailable);
    rotate(radians((-200 + panzer.boostAvailable) / 2));
    translate(-50, -(-loopCount + 35));  // Move back
    image(Assets_t.HUD_NEEDLE, 45, -loopCount + 4, SCREEN_WIDTH / 70, SCREEN_HEIGHT / 18);
    popMatrix();
};

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
        case GameState_e.ANIMATED_LOAD_TRANSITION: // TODO:
            changeGameState(GameState_e.LEVEL_ONE)    // change back to one
            break;

        /*
         * -------------------
         * |  LEVEL 1 STATE  |
         * -------------------
         */
        case GameState_e.LEVEL_ONE:
            //changeGameState(GameState_e.LEVEL_TWO);

            pushMatrix();
            translate(0, loopCount);
            GAME_INST.drawLevelOne(loopCount, loopIterations);

            // Implement constantly scrolling background
            // Loop counter to keep track of the translation iteration we are currently on
            loopCount++;
            if (loopCount > 0) { 
                loopCount = -MAP_OFFSET;
                panzer.y -= loopCount;
                //loopIterations++;
                changeGameState(GameState_e.LEVEL_TWO);
            }
            var tem = loopCount - 400
            if (panzer.y > (abs(tem)+121)) {
                panzer.y = abs(tem)+120
            }

            if (panzer.y < (abs(tem)-401)) {
                panzer.y = abs(tem)-400
            }
            
            // Draw the heads up display
            drawHUD();
            
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
                //var boostAvailable = panzer.boostAvailable;
                //var rechargeTime = panzer.rechargeTime;
                //var rechargeNeeded = panzer.reachardNeeded;
                panzer = createTank(panzer.x, panzer.y, tankSpeed, TankOptions_e.UPGRADED);  // Create the upgraded tank
                panzer.autoFireEnabled = autoFireEnabled;  // Remember previous tank state
                panzer.health = currentHealth;  // Update the upgraded tanks health 
                //panzer.boostAvailable = boostAvailable;
                //panzer.rechargeTime = rechargeTime;
                //panzer.rechargeNeeded = rechargeNeeded;
                tankUpgraded = true;  // Control variable to ensure only 1x execution of this logical block
            }

            // Case: Health collected
            if (upgradeCollected === ObjectType_e.HEALTH) {
                if (panzer.health >= 90) {
                    panzer.health = 100;
                }
                else {
                    panzer.health += 10;
                }
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
                loopCount = -MAP_HEIGHT;
                panzer.y -= loopCount;
                //loopIterations++;
                changeGameState(GameState_e.LEVEL_THREE);
            }

            var tem = loopCount - 400
            if (panzer.y > (abs(tem)+121)) {
                panzer.y = abs(tem)+120
            }

            if (panzer.y < (abs(tem)-401)) {
                panzer.y = abs(tem)-400
            }
            
            // Advance to level 3 once level 2 is complete
            // if (loopIterations === 2) {  
            //     // loopCount = -MAP_HEIGHT;
            //     // loopIterations = 0;
                
            // }
            
            // Draw the heads up display
            drawHUD();
            
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
                if (panzer.health >= 90) {
                    panzer.health = 100;
                }
                else {
                    panzer.health += 10;
                }
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
                loopCount = -MAP_HEIGHT;
                panzer.y -= loopCount;
                //loopIterations++;
                changeGameState(GameState_e.FINAL_STAGE);
            }

            var tem = loopCount - 400
            if (panzer.y > (abs(tem)+121)) {
                panzer.y = abs(tem)+120
            }

            if (panzer.y < (abs(tem)-401)) {
                panzer.y = abs(tem)-400
            }
            
            // Advance to winning transition once level 3 is complete
            // if (loopIterations === 2) {  
            //     // loopCount = -MAP_HEIGHT;
            //     // loopIterations = 0;
                
            // }
            
            // Draw the heads up display
            drawHUD();
            
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
                if (panzer.health >= 90) {
                    panzer.health = 100;
                }
                else {
                    panzer.health += 10;
                }
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
         * -----------------
         * |  FINAL STAGE  |
         * -----------------
         * This is a non scrolling stage
         */
        case GameState_e.FINAL_STAGE:

            pushMatrix();
            translate(0, -MAP_HEIGHT);

            panzer.fireRate = 5;

            GAME_INST.drawFinalStage();

            loopCount++;
            if (loopCount > 0) { 
               loopCount = -MAP_HEIGHT;
            }

            var tem = -(MAP_OFFSET + SCREEN_HEIGHT / 2);
            if (panzer.y > (abs(tem)+121)) {
                panzer.y = abs(tem)+120
            }

            if (panzer.y < (abs(tem)-401)) {
                panzer.y = abs(tem)-400
            }

            // Main functionality of the panzer tank
            panzer.draw(loopCount, GameState_e.FINAL_STAGE);

            GAME_INST.finalBoss.draw();
            GAME_INST.finalBoss.wander();
            
            checkCollisionWithBoss(panzer, GAME_INST.finalBoss);

            // Lose Condition = Health is fully diminished and (tank is dead)
            if (panzer.health <= 0) { 
                changeGameState(GameState_e.ANIMATED_LOSE_TRANSITION);
            }
            
            // Win Condition (defeat the boss)
            if (GAME_INST.finalBoss.health <= 0) {
                changeGameState(GameState_e.ANIMATED_WIN_TRANSITION);
            }
            
            upgradeCollected = checkCollisionWithUpgrade(panzer, GAME_INST.finalHealthPickups);
            
            // Case: Health collected
            if (upgradeCollected === ObjectType_e.HEALTH) {
                if (panzer.health >= 90) {
                    panzer.health = 100;
                }
                else {
                    panzer.health += 10;
                }
            }

            // Case: Shotgun collected
            if (upgradeCollected === ObjectType_e.SHOT_GUN) {
                panzer.shotGunEnabled = true;
            }

            // Case: MiniGun Collected
            if (upgradeCollected === ObjectType_e.MINI_GUN) {
                panzer.miniGunEnabled = true;
            }

            // Draw the heads up display
            drawHUD();

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
        case GameState_e.CREDITS:  // Placeholder for end credits animation in a future version/release of the game
            // reinitialize all game variables for the next iteration of game play
            loopCount = -MAP_HEIGHT;
            panzer = createTank(
                SCREEN_WIDTH / 2 - TILE_WIDTH / 2, 
                -loopCount + SCREEN_HEIGHT * 2 / 3, 
                tankSpeed, 
                TankOptions_e.BASIC);
            upgradeCollected = false;
            tankUpgraded = false;
            loopIterations = 0;            

            // Return to main menu (start screen)
            changeGameState(GameState_e.START_SCREEN);
            break;
        
        /*
         * ------------------------------------
         * |  ANIMATED LOSE TRANSITION STATE  |
         * ------------------------------------
         */
        case GameState_e.ANIMATED_LOSE_TRANSITION:  // Placeholder for future edits for transitioning to lose screen
            changeGameState(GameState_e.LOSE_SCREEN);
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
            animatedLoseScreen(animationCount, GAME_INST.score * GAME_INST.scoreMultiplier);
            animationCount++;

            if (MouseState.PRESSED) {
                MouseState.PRESSED = 0;
                changeGameState(GameState_e.CREDITS);
            }
            break;

        /*
         * -----------------------------------
         * |  ANIMATED WIN TRANSITION STATE  |
         * -----------------------------------
         */
        case GameState_e.ANIMATED_WIN_TRANSITION:  // TODO: Placeholder for future edits for transitioning to win screen
            changeGameState(GameState_e.WIN_SCREEN);
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
            animatedWinScreen(animationCount, GAME_INST.score * GAME_INST.scoreMultiplier);
            animationCount++;
            
            // Display end game credits
            if (MouseState.PRESSED) {
                changeGameState(GameState_e.CREDITS);
            }
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
