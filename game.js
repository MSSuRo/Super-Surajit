const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;

let coins = 0;
let score = 0;
let lives = 3;

let won = false;
let gameOver = false;


// =========================
// KEYBOARD CONTROLS
// =========================

const keys = {};

window.addEventListener("keydown", (e) => {

    keys[e.key.toLowerCase()] = true;

    if (
        [" ", "arrowup", "arrowleft", "arrowright"].includes(
            e.key.toLowerCase()
        )
    ) {
        e.preventDefault();
    }

    // Restart
    if (e.key.toLowerCase() === "r") {
        resetGame();
    }

});


window.addEventListener("keyup", (e) => {

    keys[e.key.toLowerCase()] = false;

});


// =========================
// PLAYER
// =========================

const player = {

    x: 80,
    y: 380,

    width: 30,
    height: 38,

    velocityX: 0,
    velocityY: 0,

    speed: 4.2,
    jumpPower: 12,

    grounded: false

};


// =========================
// PLATFORMS
// =========================

const platforms = [

    {
        x: 0,
        y: 500,
        width: 960,
        height: 40
    },

    {
        x: 80,
        y: 410,
        width: 170,
        height: 20
    },

    {
        x: 310,
        y: 350,
        width: 150,
        height: 20
    },

    {
        x: 520,
        y: 420,
        width: 150,
        height: 20
    },

    {
        x: 720,
        y: 330,
        width: 140,
        height: 20
    },

    {
        x: 860,
        y: 450,
        width: 100,
        height: 20
    },

    {
        x: 600,
        y: 260,
        width: 120,
        height: 20
    },

    {
        x: 390,
        y: 210,
        width: 130,
        height: 20
    }

];


// =========================
// COINS
// =========================

let coinList = [

    {
        x: 140,
        y: 375,
        radius: 8
    },

    {
        x: 350,
        y: 315,
        radius: 8
    },

    {
        x: 570,
        y: 385,
        radius: 8
    },

    {
        x: 765,
        y: 295,
        radius: 8
    },

    {
        x: 650,
        y: 225,
        radius: 8
    },

    {
        x: 445,
        y: 175,
        radius: 8
    }

];


// =========================
// ENEMIES
// =========================

const enemies = [

    {
        x: 280,
        y: 462,

        width: 28,
        height: 28,

        velocityX: 1.2,

        minX: 250,
        maxX: 470
    },

    {
        x: 690,
        y: 462,

        width: 28,
        height: 28,

        velocityX: -1.3,

        minX: 560,
        maxX: 850
    }

];


// =========================
// FINISH FLAG
// =========================

const goal = {

    x: 910,
    y: 405,

    width: 20,
    height: 95

};


// =========================
// COLLISION DETECTION
// =========================

function isColliding(a, b) {

    return (

        a.x < b.x + b.width &&

        a.x + a.width > b.x &&

        a.y < b.y + b.height &&

        a.y + a.height > b.y

    );

}


// =========================
// GAME RESET
// =========================

function resetGame() {

    player.x = 80;
    player.y = 380;

    player.velocityX = 0;
    player.velocityY = 0;

    player.grounded = false;


    coins = 0;
    score = 0;
    lives = 3;

    won = false;
    gameOver = false;


    coinList = [

        { x: 140, y: 375, radius: 8 },

        { x: 350, y: 315, radius: 8 },

        { x: 570, y: 385, radius: 8 },

        { x: 765, y: 295, radius: 8 },

        { x: 650, y: 225, radius: 8 },

        { x: 445, y: 175, radius: 8 }

    ];


    enemies[0].x = 280;
    enemies[1].x = 690;


    updateHUD();

}


// =========================
// PLAYER MOVEMENT
// =========================

function updatePlayer() {

    const left =
        keys["arrowleft"] ||
        keys["a"];

    const right =
        keys["arrowright"] ||
        keys["d"];

    const jump =
        keys[" "] ||
        keys["arrowup"] ||
        keys["w"];


    // Horizontal movement

    if (left) {

        player.velocityX = -player.speed;

    }
    else if (right) {

        player.velocityX = player.speed;

    }
    else {

        player.velocityX = 0;

    }


    // Jump

    if (
        jump &&
        player.grounded
    ) {

        player.velocityY =
            -player.jumpPower;

        player.grounded = false;

    }


    // Gravity

    player.velocityY += 0.55;


    // Move player

    player.x += player.velocityX;

    player.y += player.velocityY;


    // Keep player inside screen

    if (player.x < 0) {

        player.x = 0;

    }

    if (
        player.x + player.width > W
    ) {

        player.x =
            W - player.width;

    }


    // Platform collision

    player.grounded = false;


    for (const platform of platforms) {

        if (

            player.velocityY >= 0 &&

            player.x + player.width >
                platform.x &&

            player.x <
                platform.x + platform.width &&

            player.y + player.height >=
                platform.y &&

            player.y + player.height <=
                platform.y +
                player.velocityY +
                4

        ) {

            player.y =
                platform.y -
                player.height;

            player.velocityY = 0;

            player.grounded = true;

        }

    }


    // Fell from the map

    if (player.y > H + 50) {

        loseLife();

    }

}


// =========================
// COIN SYSTEM
// =========================

function updateCoins() {

    for (const coin of coinList) {

        const coinBox = {

            x: coin.x - coin.radius,

            y: coin.y - coin.radius,

            width: coin.radius * 2,

            height: coin.radius * 2

        };


        if (
            isColliding(
                player,
                coinBox
            )
        ) {

            coin.collected = true;

            coins++;

            score += 100;

        }

    }


    coinList =
        coinList.filter(
            coin => !coin.collected
        );

}


// =========================
// ENEMY SYSTEM
// =========================

function updateEnemies() {

    for (const enemy of enemies) {

        enemy.x += enemy.velocityX;


        // Reverse direction

        if (
            enemy.x < enemy.minX ||
            enemy.x > enemy.maxX
        ) {

            enemy.velocityX *= -1;

        }


        // Player vs enemy

        if (
            isColliding(
                player,
                enemy
            )
        ) {

            // Jumping on enemy

            if (
                player.velocityY > 0 &&
                player.y +
                    player.height -
                    enemy.y < 18
            ) {

                score += 250;

                enemy.x = -1000;

                player.velocityY =
                    -8;

            }

            // Enemy hits player

            else {

                loseLife();

            }

        }

    }

}


// =========================
// LOSE LIFE
// =========================

function loseLife() {

    lives--;


    if (lives <= 0) {

        gameOver = true;

    }

    else {

        player.x = 80;
        player.y = 380;

        player.velocityX = 0;
        player.velocityY = 0;

    }


    updateHUD();

}


// =========================
// GOAL / FINISH
// =========================

function checkGoal() {

    if (
        isColliding(
            player,
            goal
        )
    ) {

        won = true;

        score += 1000;

        updateHUD();

    }

}


// =========================
// HUD
// =========================

function updateHUD() {

    document.getElementById(
        "coins"
    ).textContent = coins;


    document.getElementById(
        "score"
    ).textContent = score;


    document.getElementById(
        "lives"
    ).textContent = lives;

}


// =========================
// BACKGROUND
// =========================

function drawBackground() {

    // Sky

    ctx.fillStyle = "#78c8ff";

    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    // Clouds

    ctx.fillStyle = "#ffffff";


    for (
        let i = 0;
        i < 6;
        i++
    ) {

        const x =
            80 + i * 180;

        const y =
            65 + (i % 2) * 35;


        ctx.beginPath();

        ctx.arc(
            x,
            y,
            22,
            0,
            Math.PI * 2
        );

        ctx.arc(
            x + 25,
            y + 5,
            30,
            0,
            Math.PI * 2
        );

        ctx.arc(
            x + 55,
            y,
            20,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    // Background hills

    ctx.fillStyle = "#79b85a";

    ctx.beginPath();

    ctx.moveTo(
        0,
        500
    );

    ctx.lineTo(
        0,
        430
    );


    for (
        let x = 0;
        x <= W;
        x += 80
    ) {

        ctx.quadraticCurveTo(
            x + 40,
            390,
            x + 80,
            430
        );

    }


    ctx.lineTo(
        W,
        500
    );

    ctx.fill();

}


// =========================
// DRAW PLATFORMS
// =========================

function drawPlatforms() {

    for (
        const platform of platforms
    ) {

        // Dirt

        ctx.fillStyle =
            "#8b5a2b";

        ctx.fillRect(
            platform.x,
            platform.y,
            platform.width,
            platform.height
        );


        // Grass

        ctx.fillStyle =
            "#38a852";

        ctx.fillRect(
            platform.x,
            platform.y,
            platform.width,
            6
        );

    }

}


// =========================
// DRAW COINS
// =========================

function drawCoins() {

    for (
        const coin of coinList
    ) {

        ctx.fillStyle =
            "#ffd43b";


        ctx.beginPath();

        ctx.arc(
            coin.x,
            coin.y,
            coin.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // Coin highlight

        ctx.fillStyle =
            "#fff1a8";


        ctx.beginPath();

        ctx.arc(
            coin.x - 2,
            coin.y - 2,
            2,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}


// =========================
// DRAW ENEMIES
// =========================

function drawEnemies() {

    for (
        const enemy of enemies
    ) {

        if (enemy.x < -100) {
            continue;
        }


        // Body

        ctx.fillStyle =
            "#7b3f00";

        ctx.fillRect(
            enemy.x,
            enemy.y,
            enemy.width,
            enemy.height
        );


        // Eyes

        ctx.fillStyle =
            "#ffffff";


        ctx.fillRect(
            enemy.x + 5,
            enemy.y + 6,
            6,
            7
        );


        ctx.fillRect(
            enemy.x + 17,
            enemy.y + 6,
            6,
            7
        );


        // Pupils

        ctx.fillStyle =
            "#111111";


        ctx.fillRect(
            enemy.x + 7,
            enemy.y + 8,
            3,
            4
        );


        ctx.fillRect(
            enemy.x + 19,
            enemy.y + 8,
            3,
            4
        );

    }

}


// =========================
// DRAW GOAL FLAG
// =========================

function drawGoal() {

    // Pole

    ctx.fillStyle =
        "#333333";

    ctx.fillRect(
        goal.x,
        goal.y,
        5,
        goal.height
    );


    // Flag

    ctx.fillStyle =
        "#e63946";

    ctx.fillRect(
        goal.x + 5,
        goal.y,
        45,
        28
    );

}


// =========================
// DRAW PLAYER
// =========================

function drawPlayer() {

    // Hat

    ctx.fillStyle =
        "#e63946";

    ctx.fillRect(
        player.x,
        player.y,
        player.width,
        12
    );


    // Body

    ctx.fillStyle =
        "#2563eb";

    ctx.fillRect(
        player.x,
        player.y + 12,
        player.width,
        26
    );


    // Face

    ctx.fillStyle =
        "#ffd7b3";

    ctx.fillRect(
        player.x + 7,
        player.y + 8,
        16,
        13
    );

}


// =========================
// GAME MESSAGE
// =========================

function drawGameMessage() {

    if (
        !won &&
        !gameOver
    ) {

        return;

    }


    // Dark overlay

    ctx.fillStyle =
        "rgba(0, 0, 0, 0.65)";

    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    ctx.textAlign =
        "center";


    // Main message

    ctx.fillStyle =
        "#ffffff";

    ctx.font =
        "bold 48px Arial";


    ctx.fillText(

        won
            ? "LEVEL COMPLETE!"
            : "GAME OVER",

        W / 2,
        H / 2 - 20

    );


    // Restart text

    ctx.font =
        "22px Arial";


    ctx.fillText(

        "Press R to play again",

        W / 2,
        H / 2 + 30

    );

}


// =========================
// DRAW EVERYTHING
// =========================

function draw() {

    drawBackground();

    drawPlatforms();

    drawCoins();

    drawEnemies();

    drawGoal();

    drawPlayer();

    drawGameMessage();

}


// =========================
// UPDATE GAME
// =========================

function update() {

    if (
        won ||
        gameOver
    ) {

        return;

    }


    updatePlayer();

    updateCoins();

    updateEnemies();

    checkGoal();

}


// =========================
// GAME LOOP
// =========================

function gameLoop() {

    update();

    draw();

    requestAnimationFrame(
        gameLoop
    );

}


// =========================
// START GAME
// =========================

updateHUD();

gameLoop();
