/*
       document : space-game.js
     created on : 2016 jaunary 12, 09:44 am (tuesday)
    modified on : 2022 april 17, 12:23 pm (sunday)
         author : audrey bongalon
    description : space shooter game. based on stuff i did in 10th grade
                  modified to be a CTF for (USC miniCTF 2022)
                               ___
                              /\  \
      ______    ___  ___      \_\  \    ______    ______   ___  ___
     /  __  \  /\  \/\  \    /  __  \  /\   __\  /  __  \ /\  \/\  \
    /\  \L\  \ \ \  \_\  \  /\  \L\  \ \ \  \_/ /\   ___/ \ \  \_\  \
    \ \___/\__\ \ \___/\__\ \ \___/\__\ \ \__\  \ \_____\  \ \____   \
     \/__/\/__/  \/___/\__/  \/___/\__/  \/__/   \/_____/   \/___/_\  \
                                                               /\_____/
                                                               \/____/
*/


// canvas variables
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// reference images, so they know how to look
const shipImage = document.getElementById("spaceship");
const shipDamagedImage = document.getElementById("spaceship-damaged");
const enemyImage = document.getElementById("enemy");
const enemyDamagedImage = document.getElementById("enemy-damaged");
const explosion1 = document.getElementById("explosion1");
const explosion2 = document.getElementById("explosion2");

const redBulletImage = document.getElementById("red-bullet");
const greenBulletImage = document.getElementById("green-bullet");




let gameState = "initial";      // initial -> playing -> done




// -------- bullets ------------------------------------------------------------




class PlayerBullet {
    constructor(x, y) {
        this.pos = {
            x: x,
            y: y
        }

        this.height = 25;
        this.width = 2;

        this.speed = 15;
        this.power = 6;
    }

    // bullet only moves up the screen
    move() {
        this.pos.y -= this.speed;    // update position
    }

    // render the bullet at the appropriate location
    draw() {
        ctx.drawImage(redBulletImage, this.pos.x, this.pos.y, this.width, this.height);
    }

    // check if bullet is off screen
    get isOffScreen() {
        return this.pos.y < -(this.height);
    }
}




class EnemyBullet {
    constructor(x, y) {
        this.pos = {
            x: x,
            y: y
        }

        this.height = 25;
        this.width = 2;

        this.speed = 4;
        this.power = 10;
    }

    move() {
        this.pos.y += this.speed;           // move bullet down
    };

    // render the bullet at the appropriate location
    draw() {
        ctx.drawImage(greenBulletImage, this.pos.x, this.pos.y, this.width, this.height);
    };

    get isOffScreen() {
        return this.pos.y > canvas.height;
    }
}




// -------- ships --------------------------------------------------------------




// player's spaceship
class Ship {
    constructor() {
        this.width = 30;
        this.height = 35;

        // ship starting position
        this.pos = {
            x: (canvas.width / 2) - 15,     // "-15" because 1/2 image width
            y: canvas.height - 80           // slightly above bottom of screen
        };

        this.speed = {
            x: 5,
            y: 3
        };

        // initial HP and sprite
        this.hp = 100;
        this.skin = shipImage;      // start out normal (not damaged)

        // initial cannon state
        this.canShoot = true;

        this.bullets = [];          // will function as a queue
    }




    // movement is bounded by "invisible walls"
    move() {
        if (playerInput.up && this.pos.y > canvas.height / 2) {
            this.pos.y -= this.speed.y;
        }
        if (playerInput.down && this.pos.y < canvas.height - 55) {
            this.pos.y += this.speed.y;
        }
        if (playerInput.left && this.pos.x > 5) {
            this.pos.x -= this.speed.x;
        }
        if (playerInput.right && this.pos.x < canvas.width - 35) {
            this.pos.x += this.speed.x;
        }
    }

    // render the ship on canvas
    draw() {
        ctx.drawImage(this.skin, this.pos.x, this.pos.y, this.width, this.height);
    }

    // render the HP bar
    drawHP() {
        ctx.beginPath();
        ctx.rect(15, canvas.height - 13, (this.hp * 0.01) * (canvas.width - 30), 3); // "13" = "10 + bar height"
        ctx.fillStyle = "rgba(255, 0, 0, 0.75)";    // red
        ctx.fill();
    }

    // shooting the enemy involves pushing bullets into the queue
    shoot() {
        if (this.canShoot) {
            // push pullet. initial position is at ship's location
            this.bullets.push(new PlayerBullet(this.pos.x + this.width / 2 - 1, this.pos.y - 19));

            this.canShoot = false;                  // disable shooting for now
            window.setTimeout(function () {
                this.canShoot = true;               // re-enable after timer
            }.bind(this), 250);        // fire rate cap = one shot per 250 milliseconds
        }
    }
}

const playerShip = new Ship();




class Enemy {
    constructor() {
        this.width = 25;
        this.height = 19;

        // ship starting position
        this.pos = {
            x: (canvas.width / 2) - (this.width / 2),   // centre of screen
            y: 20
        };
        this.positionCounter = 0;           // used to calculate position

        // initial HP and sprite
        this.hp = 100;                      // start out with 100 HP
        this.regenAmount = 0.5;             // health regeneration
        this.skin = enemyImage;             // start out normal (not damaged)
        this.explosionStatus = 0;

        this.gone = false;
        this.displayYouWin = false;

        // initial cannon state
        this.canShoot = false;
        this.shootCounter = 0;

        this.bullets = [];                  // will function as a queue
    }


    skinSelect() {
        switch(this.explosionStatus) {
            case 0:
                this.skin = enemyImage;         break;
            case 1:
                this.skin = enemyDamagedImage;  break;
            case 20:
                this.skin = explosion1;         break;
            case 60:
                this.skin = explosion2;         break;
            case 100:
                this.gone = true;               break;
        }
    }

    // render the enemy on canvas
    draw() {
        ctx.drawImage(this.skin, this.pos.x - this.width / 2, this.pos.y, this.width, this.height);
    }

    // render the HP bar
    drawHP() {
        ctx.beginPath();
        ctx.rect(15, 10, (this.hp * 0.01) * (canvas.width - 30), 3);   // draws the HP bar at the appropriate width
        ctx.fillStyle = "rgba(50, 255, 50, 0.75)";                              // colours the HP bar green
        ctx.fill();
    }

    // shoots a bullet, if possible
    shoot() {
        if (this.canShoot) {        // prevent shooting during intro message
            // shooting the enemy involves pushing bullets into the queue
            this.bullets.push(new EnemyBullet(this.pos.x - 1, this.pos.y + this.height));

            this.canShoot = false;                  // disable shooting for now
            window.setTimeout(function() {
                this.canShoot = true;               // re-enable after timer
            }.bind(this), 100);
        }
    }
}

const enemyShip = new Enemy();




// -------- player input -------------------------------------------------------




// keeps track of player input
let playerInput = {
    up:     false,
    down:   false,
    left:   false,
    right:  false,
    space:  false
};




// detect keyboard presses
document.addEventListener("keydown", event => {
    // prevent page from scrolling when you press space, up, or down
    if (playerShip.hp > 0) {                            // cannot move if dead
        if (event.code === "ArrowUp")    { playerInput.up    = true; event.preventDefault(); }
        if (event.code === "ArrowDown")  { playerInput.down  = true; event.preventDefault(); }
        if (event.code === "ArrowLeft")  { playerInput.left  = true; event.preventDefault(); }
        if (event.code === "ArrowRight") { playerInput.right = true; event.preventDefault(); }

        if (event.code === "Space") {
            event.preventDefault();
            if (gameState === "playing") {
                playerInput.space = true;   // spacebar to shoot (during game)
            }
            else {
                gameState = "playing";      // spacebar starts the game
                enemyShip.canShoot = true;
            }
        }
    }
});

// detect when keyboard buttons are released
document.addEventListener("keyup", event => {
    if (event.code === "ArrowUp")       playerInput.up    = false;
    if (event.code === "ArrowDown")     playerInput.down  = false;
    if (event.code === "ArrowLeft")     playerInput.left  = false;
    if (event.code === "ArrowRight")    playerInput.right = false;
    if (event.code === "Space")         playerInput.space = false;
});




// -------- game messages + collision detection --------------------------------




// draw text before the game starts
function drawIntro() {
    ctx.beginPath();
    ctx.font = "33px 'Press Start 2P'";
    ctx.fillStyle = "#44ff44";
    ctx.strokeStyle = "#111111";
    ctx.textAlign = "center";
    ctx.fillText("press space", canvas.width / 2, (canvas.height / 3) * 2 - 30);
    ctx.strokeText("press space", canvas.width / 2, (canvas.height / 3) * 2 - 30);

    ctx.font = "33px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.fillText("to start", canvas.width / 2, (canvas.height / 3) * 2 + 10);
    ctx.strokeText("to start", canvas.width / 2, (canvas.height / 3) * 2 + 10);
}




// draw a message when you win
function drawWin() {
    // prevent cheating by just calling this function
    /* IT'S CONSIDERED CHEATING IF YOU MODIFY THIS FUNCTION! */
    if (enemyShip.hp > 0 || playerShip.hp <= 0) {
        return;
    }

    // if enemy is dead and explosion animation is complete, screen slightly fades to white...
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.fill();

    // ...and displays the "you win" message
    ctx.font = "25px 'Press Start 2P'";
    ctx.fillStyle = "#44ff44";
    ctx.strokeStyle = "#111111";
    ctx.textAlign = "center";
    ctx.fillText("yay! you win!", canvas.width / 2, canvas.height / 2);
    ctx.strokeText("yay! you win!", canvas.width / 2, canvas.height / 2);

    /* HEY! NO READING THIS! THIS IS CHEATING! */
    const flag = getFlag([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]][([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]]((!![]+[])[+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+([][[]]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+!+[]]+(+[![]]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+!+[]]]+(!![]+[])[!+[]+!+[]+!+[]]+(+(!+[]+!+[]+!+[]+[+!+[]]))[(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([]+[])[([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]][([][[]]+[])[+!+[]]+(![]+[])[+!+[]]+((+[])[([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]]+[])[+!+[]+[+!+[]]]+(!![]+[])[!+[]+!+[]+!+[]]]](!+[]+!+[]+!+[]+[!+[]+!+[]])+(![]+[])[+!+[]]+(![]+[])[!+[]+!+[]])()(([]+[])[(![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(!![]+[])[+[]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]]()[+!+[]+[!+[]+!+[]]]+(+(+!+[]+[+[]]+[+!+[]]))[(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([]+[])[([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]][([][[]]+[])[+!+[]]+(![]+[])[+!+[]]+((+[])[([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]]+[])[+!+[]+[+!+[]]]+(!![]+[])[!+[]+!+[]+!+[]]]](!+[]+!+[]+[+!+[]])[+!+[]]+(![]+[])[+!+[]]+(+(+!+[]+[+[]]+[+!+[]]))[(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([]+[])[([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]][([][[]]+[])[+!+[]]+(![]+[])[+!+[]]+((+[])[([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]]+[])[+!+[]+[+!+[]]]+(!![]+[])[!+[]+!+[]+!+[]]]](!+[]+!+[]+!+[]+[!+[]+!+[]+!+[]+!+[]])[+!+[]]+([]+[])[(![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(!![]+[])[+[]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]]()[+!+[]+[!+[]+!+[]]]));

    ctx.font = "20px 'Press Start 2P'";
    ctx.fillText(flag, canvas.width / 2, 3 * canvas.height / 4);
    ctx.strokeText(flag, canvas.width / 2, 3 * canvas.height / 4);
}




// draw a message when you die
function drawLoss() {
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);          // if player is dead, screen slightly fades to white...
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.fill();

    ctx.font = "35px 'Press Start 2P'";                                     // ...and displays the "game over" message
    ctx.fillStyle = "#ff4444";
    ctx.strokeStyle = "#111111";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    ctx.strokeText("GAME OVER", canvas.width / 2, canvas.height / 2);

    ctx.font = "15px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.fillText("you is deaded", canvas.width / 2, canvas.height / 2 + 30);
    ctx.strokeText("you is deaded", canvas.width / 2, canvas.height / 2 + 30);
}




/** collision detection between bullet and ship.
 *  if bullet is not above, below, left, or right of the ship, then it has
 *  collided with the ship */
function areColliding(bullet, ship) {
    return (!(                                                      // not
        bullet.pos.y + bullet.height < ship.pos.y               ||  // up
        bullet.pos.y                 > ship.pos.y + ship.height ||  // down
        bullet.pos.x + bullet.width  < ship.pos.x               ||  // left
        bullet.pos.x                 > ship.pos.x + ship.width      // right
    ));
}




// -----------------------------------------------------------------------------

/*
     _______  _______  __   __  _______      ___      _______  _______  _______
    |       ||       ||  |_|  ||       |    |   |    |       ||       ||       |
    |    ___||   _   ||       ||    ___|    |   |    |   _   ||   _   ||    _  |
    |   | __ |  |_|  ||       ||   |___     |   |    |  | |  ||  | |  ||   |_| |
    |   ||  ||       ||       ||    ___|    |   |    |  |_|  ||  |_|  ||    ___|
    |   |_| ||   _   || ||_|| ||   |___     |   |___ |       ||       ||   |
    |_______||__| |__||_|   |_||_______|    |_______||_______||_______||___|
*/





function gameLoop() {
    // screen clear and reset
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);   // clears the canvas




    /* player movement */
    playerShip.move();
    playerShip.draw();




    /* enemy movement */
    if (enemyShip.hp > 0) {             // if enemy is alive
        enemyShip.positionCounter++;    // increase its movement counter
    }
    // "2 * 17" because subtracting 17 pix from both sides
    enemyShip.pos.x = (-((canvas.width - (2 * 17)) / 2) * (Math.sin((6.28318530718 / 400) * enemyShip.positionCounter))) + (canvas.width / 2);
    enemyShip.pos.y = (-((20 - (canvas.height / 3)) / 2) * (Math.sin((6.28318530718 / 200) * enemyShip.positionCounter))) + 100;
    /* these equations are basic sine equatons (precal classes are finally paying off lol). they're in the form
     * y = A * (B(x-C)) + D form. both the x and y direction fluctuate back and forth, creating the figure-8 movement.
     * i made sure the enemy and spaceship x-speeds were different. that way, it's harder to shoot the enemy ship */

    /* draw enemy */
    if (!enemyShip.gone) {
        enemyShip.skinSelect();
        enemyShip.draw();                                                           // draws the enemy
    }




    /* player shooting */
    if (playerInput.space) {
        playerShip.shoot();
    }




    /* enemy shooting */

    // enemy shoots at a regular rate
    if (enemyShip.shootCounter < 30) {
        enemyShip.shootCounter++;
    }
    else {
        enemyShip.shootCounter = 0; // reset counter
        enemyShip.shoot();
    }

    // have the enemy also shoot at random times, to make it harder
    if (Math.random() < 1 / 120) {
        enemyShip.shoot();
    }

    // enemy will fire early if player is right beneath it
    if ((enemyShip.pos.x >= playerShip.pos.x) && ((enemyShip.pos.x + enemyShip.width) <= (playerShip.pos.x + playerShip.width))) {
        enemyShip.shoot();
    }




    /* draw player bullets. handle situation where it hits the enemy */
    for (let i = 0; i < playerShip.bullets.length; i++) {
        let bullet = playerShip.bullets[i]; // for convenience
        bullet.move();
        bullet.draw();

        // remove bullets from memory once they're off screen
        if (bullet.isOffScreen) {
            playerShip.bullets.splice(i, 1);
        }

        if (areColliding(bullet, enemyShip)) {          // player shot enemy
            playerShip.bullets.splice(i, 1);    // bullet despawns if it hits the enemy
            enemyShip.hp -= bullet.power;               // enemy loses HP

            // make enemy "blink" when shot (unless dead)
            if (enemyShip.hp > 0) {
                enemyShip.skin = enemyDamagedImage;     // damage
                window.setTimeout(function() {
                    enemyShip.skin = enemyImage;        // reset
                }, 190);
            }

            i--;    // because we shifted the array
        }
    }




    /* draw enemy bullets. handle situation where it hits the player */
    for (let i = 0; i < enemyShip.bullets.length; i++) {
        let bullet = enemyShip.bullets[i];  // for convenience
        bullet.move();
        bullet.draw();

        // remove bullets from memory once they're off screen
        if (bullet.isOffScreen) {
            enemyShip.bullets.splice(i, 1);
        }

        if (areColliding(bullet, playerShip)) {         // player got shot
            enemyShip.bullets.splice(i, 1);     // bullet despawns
            playerShip.hp -= bullet.power;              // enemy loses HP

            // make player "blink" when shot
            playerShip.skin = shipDamagedImage;     // make ship look damaged...
            window.setTimeout(function() {
                playerShip.skin = shipImage;        // ...then reset
            }, 125);

            i--;    // because we shifted the array
        }
    }



    /* draw the HP of everyone */
    playerShip.hp = Math.max(0, playerShip.hp); // prevent "negative health"
    playerShip.drawHP();

    enemyShip.hp = Math.max(0, enemyShip.hp);   // prevent "negative health"
    enemyShip.drawHP();                                                             // draws the enemy HP bar




    // game messages
    if (gameState === "initial") {
        drawIntro();
    }
    else if (playerShip.hp <= 0) {
        drawLoss();
    }




    // detect if the enemy just died. if so, start the explosion animation
    if (enemyShip.hp <= 0) {
        enemyShip.canShoot = false; // cannot shoot once dead
        enemyShip.explosionStatus++;
    }
    else {
        // for CTF, let enemy regenerate health to make it really difficult
        enemyShip.hp += enemyShip.regenAmount;
        enemyShip.hp = Math.min(100, enemyShip.hp); // prevent ovenflow
    }


    // detect when the explosion sequence is over
    if (enemyShip.explosionStatus === 180) {
        enemyShip.displayYouWin = true;
    }
    // once sequence is over, display message
    else if (enemyShip.displayYouWin) {
        /* we need to check each time, since the game loop is still running.
         * hence why we have the "displayYouWin" flag */
        drawWin();
    }

    window.requestAnimationFrame(gameLoop);                                     // loops the gameLoop
}

gameLoop();




/*
    notes on collision detection

    !isColliding
    Up      2.pos.y + 2.height < 1.pos.y
    Down    2.pos.y            > 1.pos.y + 1.height
    Left    2.pos.x + 2.width  < 1.pos.x
    Right   2.pos.x            > 1.pos.x + 1.width
*/

