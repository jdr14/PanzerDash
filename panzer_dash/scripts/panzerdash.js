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

var SCREEN_WIDTH = 500;
var SCREEN_HEIGHT = 500;

var sketchProc=function(processingInstance){ with (processingInstance){
size(SCREEN_WIDTH, SCREEN_HEIGHT); 
frameRate(60);

//ProgramCodeGoesHere

var TS = 20;  // Global var/switch to enforce a certain pixel count for height and width per tile

// Preload necessary game assets by using Processing's preload directive
/*
    @pjs 
    preload =
        '../assets/main_menu.jpg',
        '../assets/bg_scene3.png',
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
    DEFAULT: 11,
};

// Created a struct like variable to store the different game screens
var GameScreens_t = {
    START_SCREEN: loadImage('../assets/main_menu.jpg'),
    ANIMATION: loadImage('../assets/bg_scene1.png'),
    LEVEL_ONE: loadImage('../assets/bg_scene3.png'),
    ENEMY_ONE: loadImage('../assets/enemy1.png'),
    ENEMY_TWO: loadImage('../assets/enemy2.png'),
    ENEMY_THREE: loadImage('../assets/enemy3.png'),
    ENEMY_FOUR: loadImage('../assets/enemy4.png'),
};

var Assets_t = {
    // Load assets in here
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

/*
 * Asset object definitions should go below here
 */

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

/*
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
*/

var drawStartScreen = function() {
    image(GameScreens_t.START_SCREEN, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
};

var gameObj = function() {
    // Each tile is 20 x 20 pixels, 
    this.tilemap = [ // TODO: Currently an empty 50x50 tilemap
        "                                                  ",  // row: 1  - 20   px
        "                                                  ",  // row: 2  - 40   px
        "                                                  ",  // row: 3  - 60   px
        "                                                  ",  // row: 4  - 80   px
        "                                                  ",  // row: 5  - 100  px
        "                                                  ",  // row: 6  - 120  px
        "                                                  ",  // row: 7  - 140  px
        "                                                  ",  // row: 8  - 160  px
        "                                                  ",  // row: 9  - 180  px
        "                                                  ",  // row: 10 - 200  px
        "                                                  ",  // row: 11 - 220  px
        "                                                  ",  // row: 12 - 240  px
        "                                                  ",  // row: 13 - 260  px
        "                                                  ",  // row: 14 - 280  px
        "                                                  ",  // row: 15 - 300  px
        "                                                  ",  // row: 16 - 320  px
        "                                                  ",  // row: 17 - 340  px
        "                                                  ",  // row: 18 - 360  px
        "                                                  ",  // row: 19 - 380  px
        "                                                  ",  // row: 20 - 400  px
        "                                                  ",  // row: 21 - 420  px
        "                                                  ",  // row: 22 - 440  px
        "                                                  ",  // row: 23 - 460  px
        "                                                  ",  // row: 24 - 480  px
        "                                                  ",  // row: 25 - 500  px
        "                                                  ",  // row: 26 - 520  px
        "                                                  ",  // row: 27 - 540  px
        "                                                  ",  // row: 28 - 560  px
        "                                                  ",  // row: 29 - 580  px
        "                                                  ",  // row: 30 - 600  px
        "                                                  ",  // row: 31 - 620  px
        "                                                  ",  // row: 32 - 640  px
        "                                                  ",  // row: 33 - 660  px
        "                                                  ",  // row: 34 - 680  px
        "                                                  ",  // row: 35 - 700  px
        "                                                  ",  // row: 36 - 720  px
        "                                                  ",  // row: 37 - 740  px
        "                                                  ",  // row: 38 - 760  px
        "                                                  ",  // row: 39 - 780  px
        "                                                  ",  // row: 40 - 800  px
        "                                                  ",  // row: 41 - 820  px
        "                                                  ",  // row: 42 - 840  px
        "                                                  ",  // row: 43 - 860  px
        "                                                  ",  // row: 44 - 880  px
        "                                                  ",  // row: 45 - 900  px
        "                                                  ",  // row: 46 - 920  px
        "                                                  ",  // row: 47 - 940  px
        "                                                  ",  // row: 48 - 960  px
        "                                                  ",  // row: 49 - 980  px
        "                                                  ",  // row: 50 - 1000 px
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

//GAME_INST.initialize();
/*
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
*/

/*
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
*/

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
var CURRENT_GAME_STATE = GameState_e.START_SCREEN;

var changeGameState = function(GameState) {
    CURRENT_GAME_STATE = GameState;
};


//var player = playerOptions.BASIC;
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

//var drawBackground

var drawHelpScreen = function() {
    image(GameScreens_t.LEVEL_ONE, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
};

var drawEnemy1 = function() {
    image(GameScreens_t.ENEMY_ONE, 30, 10, 60, 60);
    fill(255, 255, 0);
    text("Enemy One", 30, 100);
};

var drawEnemy2 = function() {
    image(GameScreens_t.ENEMY_TWO, 160, 10, 60, 60);
    fill(255, 255, 0);
    text("Enemy Two", 160, 100);
};

var drawEnemy3 = function() {
    image(GameScreens_t.ENEMY_THREE, 280, 10, 60, 60);
    fill(255, 255, 0);
    text("Enemy Three", 280, 100);
};

var drawEnemy4 = function() {
    image(GameScreens_t.ENEMY_FOUR, 400, 10, 60, 60);
    fill(255, 255, 0);
    text("Enemy Four", 400, 100);
};

var drawTank = function() {
    fill(45, 148, 22);
    ellipse(120, 470, 80, 20);
    noStroke();
    ellipse(120, 450, 80, 40);
    rect(80, 410, 50, 40);
    fill(255, 255, 255);
    rect(90, 420, 30, 20);
    fill(0,0,0);
    ellipse(100, 470, 15, 15);
    ellipse(120, 470, 15, 15);
    ellipse(140, 470, 15, 15);
    rect(95, 425, 20, 10);
    fill(150, 102, 30)
    rect(130, 440, 10, 10);
    fill(255, 255, 255);
    text("The enemies as listed above are the\n different" +
    "levels of difficulty. The tank\n as shown below is one of " +
    "three different\n characters to play!", 180, 330);
}

var drawInstructions = function() {
    fill(10, 5, 153);
    text("Objective of Game:\n" +
    "While trying to get to the end of the battlefield,\n" +
    "you are going to be doging several obstacles\n" +
    "by doing special and cool maneuvers. With\n every" +
    "level and the farther you get, the more\n obstancles" +
    "appear in your path! Each enemy\n has a special attack" +
    "that they will perform to\n stop you from completing the" +
    "course! And if\n that was not hard enough before you can\n" +
    "cross the finish line, you will have to defeat\n the Big Bad" +
    "Boss. Throughout the game you\n can purchase weapons that will " +
    "help defend\n youself. The rewards are high, but the road\n to victory" +
    "is a long one. Take it if you dare!!", 170, 70);
}

// Setup the FSM within this function
var draw = function() {
    switch(CURRENT_GAME_STATE) {
        case GameState_e.START_SCREEN:
            drawStartScreen();
            if (MouseState.PRESSED && mouseX < 195 && mouseX > 25 && mouseY < 120 && mouseY > 55) {
                changeGameState(GameState_e.ANIMATED_LOAD_TRANSITION);
                MouseState.PRESSED = 0;  // Force a click release
            }
            if (MouseState.PRESSED && mouseX < 128 && mouseX > 33 && mouseY < 205 && mouseY > 163) {
                changeGameState(GameState_e.HELP_SCREEN);
                MouseState.PRESSED = 0;  // Force a click release
            }
            break;
        case GameState_e.ANIMATED_LOAD_TRANSITION:
            println("Some animation to load level one for a smoother transition.");
            animatedLoadTransition();
            changeGameState(GameState_e.LEVEL_ONE);
            break;
        case GameState_e.LEVEL_ONE:
            println("TODO: LEVEL_ONE");
            changeGameState(GameState_e.DEFAULT);
            break;
        case GameState_e.LEVEL_TWO:
            println("TODO: LEVEL_TWO");
            break;
        case GameState_e.LEVEL_THREE:
            println("TODO: LEVEL_THREE");
            break;
        case GameState_e.HELP_SCREEN:
            println("TODO: HELP_SCREEN");
            drawHelpScreen();
            drawInstructions();
            break;
        case GameState_e.CREDITS:
            println("TODO: CREDITS");
            break;
        case GameState_e.ANIMATED_LOSE_TRANSITION:
            println("TODO: ANIMATED_LOSE_TRANSITION");
            break;
        case GameState_e.LOSE_SCREEN:
            println("TODO: LOSE_SCREEN");
            break;
        case GameState_e.ANIMATED_WIN_TRANSITION:
            println("TODO: ANIMATED_WIN_TRANSITION");
            break;
        case GameState_e.WIN_SCREEN:
            println("TODO: WIN_SCREEN");
            break;
        default:
            drawEnemy1();
            drawEnemy2();
            drawEnemy3();
            drawEnemy4();
            drawTank();
            // console.debug("Error: Default game state hit!");
            // println("Error: Default game state hit!");
            break;
    } // End switch
};


}};
