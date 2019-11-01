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
 * Artist: Alex Shammas (Artist behind all of the assets including the unique background)
 * Author: Joey (Joseph) Rodgers (Programmer and also used the assets to lay out a custom tilemap)
 * Date: 9/27/2019
 */

var sketchProc=function(processingInstance){ with (processingInstance){
size(400, 400); 
frameRate(60);

//ProgramCodeGoesHere

var TS = 20;  // Global var/switch to enforce a certain pixel count for height and width per tile

// Preload necessary game assets by using Processing's preload directive
/*
    @pjs 
    preload =
        '../assets/samurai_cover.jpg',
        '../assets/bones.png',
        '../assets/enemy1.png',
        '../assets/enemy2.png',
        '../assets/map.png',
        '../assets/obj_fence_x.png',
        '../assets/obj_fence_y.png',
        '../assets/obj_statue.png',
        '../assets/obj_stone1.png',
        '../assets/obj_stone2.png',
        '../assets/obj_torch.png',
        '../assets/obj_wall_bottom.png',
        '../assets/obj_wall_l.png',
        '../assets/obj_wall_top.png',
        '../assets/obj_wall_x.png',
        '../assets/obj_wall_y.png',
        '../assets/player_upgraded.png',
        '../assets/player.png',
        '../assets/sword.png';

    crisp='true';
*/

// Created an enum for use in a switch statement later to track the current game state
var GameState_e = {
    START: 0,
    GAME_IN_PROGRESS: 1,
    GAME_OVER_LOSE: 2,
    GAME_OVER_WIN: 3,
};

// Created a struct like variable to store the different game screens
var GameScreens_t = {
    START_SCREEN: loadImage('../assets/samurai_cover.jpg'),
    BACKGROUND:   loadImage('../assets/map.png'),
    LOSE_SCREEN:  loadImage('../assets/lose_screen.jpg'),   
    WIN_SCREEN:   loadImage('../assets/win_screen.jpg'),    
};

var Assets_t = {
    PLAYER:    loadImage('../assets/player.png'),
    PLAYER_UG: loadImage('../assets/player_upgraded.png'),
    ENEMY_1:   loadImage('../assets/enemy1.png'),   
    ENEMY_2:   loadImage('../assets/enemy2.png'),
    BONES:     loadImage('../assets/bones.png'),           // Tilemap key: 'b'   
    FENCE_X:   loadImage('../assets/obj_fence_x.png'),     // Tilemap key: 'f'
    FENCE_Y:   loadImage('../assets/obj_fence_y.png'),     // Tilemap key: 'g'
    STATUE:    loadImage('../assets/obj_statue.png'),      // Tilemap key: 's'
    STONE_1:   loadImage('../assets/obj_stone1.png'),      // Tilemap key: '1'
    STONE_2:   loadImage('../assets/obj_stone2.png'),      // Tilemap key: '2'
    WALL_X:    loadImage('../assets/obj_wall_x.png'),      // Tilemap key: 'x'
    WALL_Y:    loadImage('../assets/obj_wall_y.png'),      // Tilemap key: 'y'
    WALL_BOT:  loadImage('../assets/obj_wall_bottom.png'), // Tilemap key: 'w'
    WALL_TOP:  loadImage('../assets/obj_wall_top.png'),    // Tilemap key: 't'
    WALL_L:    loadImage('../assets/obj_wall_l.png'),      // Tilemap key: 'l'
    SWORD:     loadImage('../assets/sword.png'),           // Tilemap key: 'S'
}

// This is the main character (i.e. the samurai)
var playerObj = function(x, y, s) {
    this.x = x;
    this.y = y;
    this.speed = s;
};

var playerUpgradedObj = function(x, y, s) {
    this.x = x;
    this.y = y;
    this.speed = s;
};

var enemy1Obj = function(x, y, s) {
    this.position = new PVector(x, y);
    this.step = new PVector(0, 0);
    this.speed = s;
    this.wanderAngle = random(0, 180);
    this.wanderDistance = random(0, 100);
    this.pursueTarget = new PVector(0, 0);
    this.defeated = false;
};

var enemy2Obj = function(x, y, s) {
    this.x = x;
    this.position = new PVector(x, y);
    this.step = new PVector(0, 0);
    this.speed = s;
    this.wanderAngle = random(0, 180);
    this.wanderDistance = random(0, 100);
    this.pursueTarget = new PVector(0, 0);
    this.defeated = false;
};

// This is the collectable item.  Several will be placed throughout the map
var bonesObj = function(x, y) {
    this.x = x;
    this.y = y;
    this.collected = false;
    this.collectable = true;
    this.isSword = false;
};

var fenceXObj = function(x, y) {
    this.x = x;
    this.y = y;
    this.collectable = false;
    this.isSword = false;
};

var fenceYObj = function(x, y) {
    this.x = x;
    this.y = y;
    this.collectable = false;
    this.isSword = false;
};

var statueObj = function(x, y) {
    this.x = x;
    this.y = y;
    this.collectable = false;
    this.isSword = false;
};

// Stone objects are defined below
var stone1Obj = function(x, y) {
    this.x = x;
    this.y = y;
    this.collectable = false;
    this.isSword = false;
};

var stone2Obj = function(x, y) {
    this.x = x;
    this.y = y;
    this.collectable = false;
    this.isSword = false;
};

// Wall objects are defined below
var wallXObj = function(x, y) {
    this.x = x;
    this.y = y;
    this.collectable = false;
    this.isSword = false;
};

var wallYObj = function(x, y) {
    this.x = x;
    this.y = y;
    this.collectable = false;
    this.isSword = false;
};

var wallBotObj = function(x, y) {
    this.x = x;
    this.y = y;
    this.collectable = false;
    this.isSword = false;
};

var wallTopObj = function(x, y) {
    this.x = x;
    this.y = y;
    this.collectable = false;
    this.isSword = false;
};

var wallLObj = function(x, y) {
    this.x = x;
    this.y = y;
    this.collectable = false;
    this.isSword = false;
};

// One instance of this magical item will be placed in the tilemap for the player to collect
var swordObj = function(x, y) {
    this.x = x;
    this.y = y;
    this.collected = false;
    this.collectable = true;
    this.isSword = true;
};

// Define key press state structure and related functions
var keyState = {
    PRESSED: 0,
};

var keyPressed = function() {
    keyState.PRESSED = 1;
};

var keyReleased = function() {
    keyState.PRESSED = 0;
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

var DISABLE = {
    W: false,
    A: false,
    S: false,
    D: false,
};

playerObj.prototype.draw = function() {
    var self = this;

    var updatePosByKey = function() {
        if (aPressed() && DISABLE.A === false && wPressed() && DISABLE.W === false) {
            self.y -= self.speed;
            self.x -= self.speed;
        }
        if (aPressed() && DISABLE.A === false && sPressed() && DISABLE.S === false) {
            self.y += self.speed; 
            self.x -= self.speed;
        }
        if (dPressed() && DISABLE.D === false && wPressed() && DISABLE.W === false) {
            self.x += self.speed;
            self.y -= self.speed;  
        }
        if (dPressed() && DISABLE.D === false && sPressed() && DISABLE.S === false) {
            self.x += self.speed;
            self.y += self.speed;  
        }
        if (wPressed() && DISABLE.W === false) {   
            self.y -= self.speed;  
        }
        if (sPressed() && DISABLE.S === false) {
            self.y += self.speed;  
        }
        if (dPressed() && DISABLE.D === false) {
            self.x += self.speed;
        }
        if (aPressed() && DISABLE.A === false) {
            self.x -= self.speed;
        }
    };

    updatePosByKey();  // Get key press updates to move player
    image(Assets_t.PLAYER, self.x, self.y, TS, TS);
};

playerUpgradedObj.prototype.draw = function() {
    var self = this;

    var updatePosByKey = function() {
        if (wPressed() && DISABLE.W === false) {                 
            self.y -= self.speed; 
        }
        if (sPressed() && DISABLE.S === false) {
            self.y += self.speed;  
        }
        if (dPressed() && DISABLE.D === false) {
            self.x += self.speed;
        }
        if (aPressed() && DISABLE.A === false) {
            self.x -= self.speed;
        }
    };

    updatePosByKey();  // Get key press updates to move player
    image(Assets_t.PLAYER_UG, self.x, self.y, TS, TS);
};

enemy1Obj.prototype.wander = function() {
    this.step.set(cos(this.wanderAngle), sin(this.wanderAngle));
    this.step.mult(this.speed);
    this.position.add(this.step);
    this.wanderDistance--;
    if (this.wanderDistance < 0) {
        this.wanderDistance = random(0, 50);
        this.wanderAngle += random(-90, 90);
    }
}

enemy1Obj.prototype.seek = function() {
    if (dist(player.x, player.y, this.position.x, this.position.y) > 5) {
        this.step.set(player.x - this.position.x, player.y - this.position.y);
        this.step.normalize();
        this.step.mult(this.speed);
        this.position.add(this.step);
    }
}

enemy2Obj.prototype.wander = function() {
    this.step.set(cos(this.wanderAngle), sin(this.wanderAngle));
    this.step.mult(this.speed);
    this.position.add(this.step);
    this.wanderDistance--;
    if (this.wanderDistance < 0) {
        this.wanderDistance = random(0, 50);
        this.wanderAngle += random(-90, 90);
    }
}

enemy2Obj.prototype.seek = function() {
    if (dist(player.x, player.y, this.position.x, this.position.y) > 5) {
        this.step.set(player.x - this.position.x, player.y - this.position.y);
        this.step.normalize();
        this.step.mult(this.speed);
        this.position.add(this.step);
    }
}

enemy1Obj.prototype.draw = function() {
    image(Assets_t.ENEMY_1, this.position.x, this.position.y, TS, TS);
};

enemy2Obj.prototype.draw = function() {
    image(Assets_t.ENEMY_2, this.position.x, this.position.y, TS, TS);
};

bonesObj.prototype.draw = function() {
    image(Assets_t.BONES, this.x, this.y, TS, TS);
};

fenceXObj.prototype.draw = function() {
    image(Assets_t.FENCE_X, this.x, this.y, TS, TS);
};

fenceYObj.prototype.draw = function() {
    image(Assets_t.FENCE_Y, this.x, this.y, TS, TS);
};

statueObj.prototype.draw = function() {
    image(Assets_t.STATUE, this.x, this.y, TS, TS);
};

stone1Obj.prototype.draw = function() {
    image(Assets_t.STONE_1, this.x, this.y, TS, TS);
};

stone2Obj.prototype.draw = function() {
    image(Assets_t.STONE_2, this.x, this.y, TS, TS);
};

wallXObj.prototype.draw = function() {
    image(Assets_t.WALL_X, this.x, this.y, TS, TS);
};

wallYObj.prototype.draw = function() {
    image(Assets_t.WALL_Y, this.x, this.y, TS, TS);
};

wallBotObj.prototype.draw = function() {
    image(Assets_t.WALL_BOT, this.x, this.y, TS, TS);
};

wallTopObj.prototype.draw = function() {
    image(Assets_t.WALL_TOP, this.x, this.y, TS, TS);
};

wallLObj.prototype.draw = function() {
    image(Assets_t.WALL_L, this.x, this.y, TS, TS);
};

swordObj.prototype.draw = function() {
    image(Assets_t.SWORD, this.x, this.y, TS, TS);
};

var drawStartScreen = function() {
    image(GameScreens_t.START_SCREEN, 0, 0, 400, 400);
};

var drawLosingEndScreen = function() {
    image(GameScreens_t.LOSE_SCREEN, 0, 0, 400, 400);
};

var drawWinningEndScreen = function() {
    image(GameScreens_t.WIN_SCREEN, 0, 0, 400, 400);
};

var gameObj = function() {
    // Because each tile is 20 x 20 pixels, 
    this.tilemap = [
        "lxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",  // row: 1  - 20   px
        "y               g        g                  11111y",  // row: 2  - 40   px
        "y               g        g                  22222y",  // row: 3  - 60   px
        "y               g        g                  11111y",  // row: 4  - 80   px
        "y     s         g        g                       y",  // row: 5  - 100  px
        "y               2        2                       y",  // row: 6  - 120  px
        "y               g        g                       y",  // row: 7  - 140  px
        "y   s           g        g   s121    2222    1fffy",  // row: 8  - 160  px
        "y               g        g   1 b     g sg    g s y",  // row: 9  - 180  px
        "y       s       g        g   1       gs g    g   y",  // row: 10 - 200  px
        "y               g        g   s  g    gs g    gs sy",  // row: 11 - 220  px
        "y               g        g   2  g    g  g    g   y",  // row: 12 - 240  px
        "y               g        g   2  g    g sg    g s y",  // row: 13 - 260  px
        "y               g        g      g    g sg    g   y",  // row: 14 - 280  px
        "y               g        g      g    gs g    gs sy",  // row: 15 - 300  px
        "y               g        g   s  g    g  g    g   y",  // row: 16 - 320  px
        "y               g        g   2  g    gs g    g s y",  // row: 17 - 340  px
        "y               1ffffffff1   s  g    g sg    g   y",  // row: 18 - 360  px
        "y                            1 bg    gs g    gs sy",  // row: 19 - 380  px
        "y    s                       s  g    1111    g111y",  // row: 20 - 400  px
        "y                                                y",  // row: 21 - 420  px
        "y           s                                    y",  // row: 22 - 440  px
        "y                                                y",  // row: 23 - 460  px
        "y         s                     b                y",  // row: 24 - 480  px
        "y                                                y",  // row: 25 - 500  px
        "y                                                y",  // row: 26 - 520  px
        "y   2ffffffffffff1    1ffff  ffffffffffffff2     y",  // row: 27 - 540  px
        "y   g            g    g  b                 g     y",  // row: 28 - 560  px
        "y   g  s1s1s     g    g   11111111111111   g     y",  // row: 29 - 580  px
        "y   g  2s2s2     g    g   2            2   g     y",  // row: 30 - 600  px
        "y   g  s1s1s     g    g   2   s     s  2         y",  // row: 31 - 620  px
        "y   g            g    g   2            2         y",  // row: 32 - 640  px
        "y   1ffffffffffff2    g   2            2   g     y",  // row: 33 - 660  px
        "y b                   g   2    s       2   g     y",  // row: 34 - 680  px
        "y           b         g   2            2   g     y",  // row: 35 - 700  px
        "y                         2  s     s   2   g     y",  // row: 36 - 720  px
        "22222           S         2            2   g     y",  // row: 37 - 740  px
        "     221 1            g   11111111111111   g     y",  // row: 38 - 760  px
        " 22    1 12           g         b          g     y",  // row: 39 - 780  px
        "y  22112 1 2          g                    g     y",  // row: 40 - 800  px
        "y      1 1  2         1fffffffffffff       g     y",  // row: 41 - 820  px
        "y      1 12  2                          b  g     y",  // row: 42 - 840  px
        "y          2  2                            g     y",  // row: 43 - 860  px
        "y   s       2  2                    11111111     y",  // row: 44 - 880  px
        "y            2  2                                y",  // row: 45 - 900  px
        "y      s s    2  2    s                          y",  // row: 46 - 920  px
        "y  b    s      2  2            b                 y",  // row: 47 - 940  px
        "y      s s   s g   22                            y",  // row: 48 - 960  px
        "y              g2    222222                      y",  // row: 49 - 980  px
        "y11111111111111g22         2xxxxxxxxxxxxxxxxxxxxxy",  // row: 50 - 1000 px
    ];
    
    this.gameObjects = [];
    this.enemies = [];
    this.yCoor = -600;
    this.xCoor = 0;
    this.score = 0;
    this.scoreMultiplier = 10;
    this.boneCount = 0;
    this.swordCollected = false;
    this.enemyCount = 0;
};

var GAME_INST = new gameObj();
var MAP_OFFSET_Y = -600;

gameObj.prototype.initialize = function() {
    for (var i = 0; i < this.tilemap.length; i++) {
        for (var j = 0; j < this.tilemap[i].length; j++) {
            switch (this.tilemap[i][j]) {
                case 'b':
                    this.gameObjects.push(new bonesObj(j*TS, i*TS + MAP_OFFSET_Y));
                    this.boneCount++;
                    break;
                case 'f': 
                    this.gameObjects.push(new fenceXObj(j*TS, i*TS + MAP_OFFSET_Y));
                    break;
                case 'g':
                    this.gameObjects.push(new fenceYObj(j*TS, i*TS + MAP_OFFSET_Y));
                    break;
                case 's':
                    this.gameObjects.push(new statueObj(j*TS, i*TS + MAP_OFFSET_Y));
                    break;
                case '1':
                    this.gameObjects.push(new stone1Obj(j*TS, i*TS + MAP_OFFSET_Y));
                    break;
                case '2':
                    this.gameObjects.push(new stone2Obj(j*TS, i*TS + MAP_OFFSET_Y));
                    break;
                case 'x':
                    this.gameObjects.push(new wallXObj(j*TS, i*TS + MAP_OFFSET_Y));
                    break;
                case 'y':
                    this.gameObjects.push(new wallYObj(j*TS, i*TS + MAP_OFFSET_Y));
                    break;
                case 'w':
                    this.gameObjects.push(new wallBotObj(j*TS, i*TS + MAP_OFFSET_Y));
                    break;
                case 't':
                    this.gameObjects.push(new wallTopObj(j*TS, i*TS + MAP_OFFSET_Y));
                    break;
                case 'l':
                    this.gameObjects.push(new wallLObj(j*TS, i*TS + MAP_OFFSET_Y));
                    break;
                case 'S':
                    this.gameObjects.push(new swordObj(j*TS, i*TS + MAP_OFFSET_Y));
                    break;
            }
        }
    }
    this.enemies.push(new enemy1Obj(300, 100, 2));  // Enemy 1 has a faster overall speed
    this.enemies.push(new enemy2Obj(300, -200, 1));
    this.enemyCount = this.enemies.length;  // Update the enemy count
};

GAME_INST.initialize();

//var SWORD_COLLECTED = false;

// Collision detection for the regular player
playerObj.prototype.checkCollision = function() {
    for (var i = 0; i < GAME_INST.gameObjects.length; i++) {
        if (GAME_INST.gameObjects[i].collectable && !GAME_INST.gameObjects[i].collected) {
            var xValid = (this.x < (GAME_INST.gameObjects[i].x + TS) && this.x > (GAME_INST.gameObjects[i].x - TS));
            var yValid = (this.y < (GAME_INST.gameObjects[i].y + TS/2) && this.y > (GAME_INST.gameObjects[i].y - TS/2));
            if (xValid && yValid) {
                GAME_INST.gameObjects[i].collected = true;
                if (GAME_INST.gameObjects[i].isSword) {
                    GAME_INST.swordCollected = true;
                }
                else {  // Item is a set of bones
                    GAME_INST.boneCount--;
                    GAME_INST.score++;
                }
            }
        }
        else {
            var xValid = (this.x < (GAME_INST.gameObjects[i].x + TS - 5) && this.x > (GAME_INST.gameObjects[i].x - TS + 5));
            var yValid = (this.y > (GAME_INST.gameObjects[i].y - TS/2) && this.y < (GAME_INST.gameObjects[i].y + TS));
            if (xValid && yValid && !GAME_INST.gameObjects[i].collectable) {
                DISABLE.W = true;
            }
            yValid = (this.y < (GAME_INST.gameObjects[i].y + TS/2) && this.y > (GAME_INST.gameObjects[i].y - TS));
            if (xValid && yValid && !GAME_INST.gameObjects[i].collectable) {
                DISABLE.S = true;
            }
            xValid = (this.x === GAME_INST.gameObjects[i].x - TS);
            yValid = (this.y < (GAME_INST.gameObjects[i].y + TS/2) && this.y > (GAME_INST.gameObjects[i].y - TS/2));
            if (xValid && yValid && !GAME_INST.gameObjects[i].collectable) {
                DISABLE.D = true;
            }
            xValid = (this.x === GAME_INST.gameObjects[i].x + TS);
            if (xValid && yValid && !GAME_INST.gameObjects[i].collectable) {
                DISABLE.A = true;
            }
        }
    }
    for (var i = 0; i < GAME_INST.enemies.length; i++) {
        var xValid = (this.x < (GAME_INST.enemies[i].position.x + TS) && this.x > (GAME_INST.enemies[i].position.x - TS));
        var yValid = (this.y < (GAME_INST.enemies[i].position.y + TS/2) && this.y > (GAME_INST.enemies[i].position.y - TS/2));
        if (xValid && yValid) {
            CURRENT_GAME_STATE = GameState_e.GAME_OVER_LOSE;
        }
    }
};

// Collision detection for the upgraded player
playerUpgradedObj.prototype.checkCollision = function() {
    for (var i = 0; i < GAME_INST.gameObjects.length; i++) {
        if (GAME_INST.gameObjects[i].collectable && !GAME_INST.gameObjects[i].collected) {
            var xValid = (this.x < (GAME_INST.gameObjects[i].x + TS) && this.x > (GAME_INST.gameObjects[i].x - TS));
            var yValid = (this.y < (GAME_INST.gameObjects[i].y + TS/2) && this.y > (GAME_INST.gameObjects[i].y - TS/2));
            if (xValid && yValid) {
                GAME_INST.score += 2;
                GAME_INST.boneCount--;
                GAME_INST.gameObjects[i].collected = true;
                // No sword detection needed as the sword has already been collected...
            }
        }
        else {
            var xValid = (this.x < (GAME_INST.gameObjects[i].x + TS - 5) && this.x > (GAME_INST.gameObjects[i].x - TS + 5));
            var yValid = (this.y > (GAME_INST.gameObjects[i].y - TS/2) && this.y < (GAME_INST.gameObjects[i].y + TS));
            if (xValid && yValid && !GAME_INST.gameObjects[i].collectable) {
                DISABLE.W = true;
            }
            yValid = (this.y < (GAME_INST.gameObjects[i].y + TS/2) && this.y > (GAME_INST.gameObjects[i].y - TS));
            if (xValid && yValid && !GAME_INST.gameObjects[i].collectable) {
                DISABLE.S = true;
            }
            xValid = (this.x === GAME_INST.gameObjects[i].x - TS);
            yValid = (this.y < (GAME_INST.gameObjects[i].y + TS/2) && this.y > (GAME_INST.gameObjects[i].y - TS/2));
            if (xValid && yValid && !GAME_INST.gameObjects[i].collectable) {
                DISABLE.D = true;
            }
            xValid = (this.x === GAME_INST.gameObjects[i].x + TS);
            if (xValid && yValid && !GAME_INST.gameObjects[i].collectable) {
                DISABLE.A = true;
            }
        }
    }
    if (GAME_INST.enemyCount > 0) {
        for (var i = 0; i < GAME_INST.enemies.length; i++) {
            if (!GAME_INST.enemies[i].defeated) {
                var xValid = (this.x < (GAME_INST.enemies[i].position.x + TS) && this.x > (GAME_INST.enemies[i].position.x - TS));
                var yValid = (this.y < (GAME_INST.enemies[i].position.y + TS/2) && this.y > (GAME_INST.enemies[i].position.y - TS/2));
                if (xValid && yValid) {
                    GAME_INST.score += 5;
                    GAME_INST.enemyCount--;
                    GAME_INST.enemies[i].defeated = true;
                }
            }
        }
    }
};

var pStartCoor = {
    X: 200,
    Y: 200,
};

var playerOptions = {
    BASIC: new playerObj(160, 260, 2),
    UPGRADED: new playerUpgradedObj(320, 120, 4),
};

// var upgraded_player = new playerUpgradedObj(320, 180, 3);

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

gameObj.prototype.drawBackground = function() {
    image(GameScreens_t.BACKGROUND, this.xCoor, this.yCoor);
    for (var i = 0; i < GAME_INST.gameObjects.length; i++) {
        if (GAME_INST.gameObjects[i].collectable) {  // This is either a sword or a set of bones
            if (!GAME_INST.gameObjects[i].collected) {
                GAME_INST.gameObjects[i].draw();
            }
        }
        else {
            GAME_INST.gameObjects[i].draw();
        }
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

// Functions to track the game state
var CURRENT_GAME_STATE = GameState_e.START;

var changeGameState = function(GameState) {
    CURRENT_GAME_STATE = GameState;
};

var player = playerOptions.BASIC;

var translationX, translationY;
var draw = function() {
    switch(CURRENT_GAME_STATE) {
        case GameState_e.START:
            drawStartScreen();
            if (MouseState.PRESSED && mouseX > 100 && mouseX < 310 && mouseY < 318 && mouseY > 292) {
                changeGameState(GameState_e.GAME_IN_PROGRESS);
                MouseState.PRESSED = 0;  // Force a click release
            }
            break;
        case GameState_e.GAME_IN_PROGRESS:
            // drawGameBackground(GAME_INST.xCoor, GAME_INST.yCoor);
            pushMatrix();
            if (player.x >= 200 && player.x <= 800 && player.y >= -400 && player.y <= 200) {  // Case mid-map
                translationX = (-player.x + pStartCoor.X);
                translationY = (-player.y + pStartCoor.Y);
                translate(translationX, translationY);
            }
            else if (player.y < -400 && player.x > 800) {  // Case top right corner of map
                var x_offset = (player.x - 800);
                var y_offset = (-400 - player.y);
                translationX = (-player.x + pStartCoor.X + x_offset);
                translationY = (-player.y + pStartCoor.Y - y_offset);
                translate(translationX, translationY);
            }
            else if (player.y < -400 && player.x < 200) {  // Case top left corner of map
                var x_offset = (player.x - 200);
                var y_offset = (-400 - player.y);
                translationX = (-player.x + pStartCoor.X + x_offset);
                translationY = (-player.y + pStartCoor.Y - y_offset);
                translate(translationX, translationY);
            }
            else if (player.y > 200 && player.x > 800) {  // Case bottom right corner of map
                var x_offset = (player.x - 800);
                var y_offset = (200 - player.y);
                translationX = (-player.x + pStartCoor.X + x_offset);
                translationY = (-player.y + pStartCoor.Y - y_offset);
                translate(translationX, translationY);
            }
            else if (player.y > 200 && player.x < 200) {  // Case bottom left corner of map
                var x_offset = (player.x - 200);
                var y_offset = (200 - player.y);
                translationX = (-player.x + pStartCoor.X + x_offset);
                translationY = (-player.y + pStartCoor.Y - y_offset);
                translate(translationX, translationY);
            }
            else if (player.x > 800) {
                var x_offset = (player.x - 800);
                translationX = (-player.x + pStartCoor.X + x_offset);
                translationY = (-player.y + pStartCoor.Y);
                translate(translationX, translationY);
            }
            else if (player.x < 200) {
                var x_offset = (player.x - 200);
                translationX = (-player.x + pStartCoor.X + x_offset);
                translationY = (-player.y + pStartCoor.Y);
                translate(translationX, translationY);
            }
            else if (player.y < -400) {
                var y_offset = (-400 - player.y);
                translationX = (-player.x + pStartCoor.X);
                translationY = (-player.y + pStartCoor.Y - y_offset);
                translate(translationX, translationY);
            }
            else if (player.y > 200) {
                var y_offset = (200 - player.y);
                translationX = (-player.x + pStartCoor.X);
                translationY = (-player.y + pStartCoor.Y - y_offset);
                translate(translationX, translationY);
            }

            GAME_INST.drawBackground();

            for (var i = 0; i < GAME_INST.enemies.length; i++) {
                if (!GAME_INST.enemies[i].defeated) {
                    GAME_INST.enemies[i].draw();
                    // GAME_INST.enemies[i].seek();
                    GAME_INST.enemies[i].wander();
                }
            }
            
            player.checkCollision();
            player.draw();
            
            // Reset the Key States
            DISABLE.W = false;
            DISABLE.A = false;
            DISABLE.S = false;
            DISABLE.D = false;

            if (GAME_INST.swordCollected) {  // Upgrade the player to the more advanced samurai
                player = playerOptions.UPGRADED;  
            }
            
            if (GAME_INST.boneCount === 0) {  // All bones have been collected (WIN CONDITION)
                CURRENT_GAME_STATE = GameState_e.GAME_OVER_WIN;
            }

            popMatrix();
            break;
        case GameState_e.GAME_OVER_LOSE:
            drawLosingEndScreen();
            displayScore();
            displayCredits();
            if (MouseState.PRESSED) {
                GAME_INST.initialize();  // Reinitialize the game state for the next game instance/iteration
                changeGameState(GameState_e.START);
            }
            break;
        case GameState_e.GAME_OVER_WIN:
            drawWinningEndScreen();
            displayScore();
            displayCredits();
            if (MouseState.PRESSED) {
                GAME_INST.initialize();
                changeGameState(GameState_e.START);
            }
            break;
        default:
            console.debug("Error: Default game state hit!");
            println("Error: Default game state hit!");
    }
};


}};
