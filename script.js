const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load track image
const track = new Image();
track.src = 'https://i.ibb.co/XxSR0bP9/upscaled-tr9.png';

// Load car images
const yellowCar = new Image();
yellowCar.src = 'https://i.ibb.co/Vc7pbpNz/yellow-car-removebg-preview-1.png';

const redCar = new Image();
redCar.src = 'https://i.ibb.co/RTsPfK4J/red-red-removebg-preview.png';

// **Starting Positions**
let car1X = 600, car1Y = 695, angle1 = 0, speed1 = 0;
let car2X = 597, car2Y = 730, angle2 = 0, speed2 = 0;

const maxSpeed = 3;
let keys = {};
let gameStarted = false; // Prevents movement before spacebar press

// **Allowed Free Blocks (Track Area)**
const freeBlocks = new Set([
    216, 217, 
    272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299,
    242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269,
    212, 213, 214, 215, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 236, 237, 238, 239,
    182, 183, 184, 206, 207, 208, 209,
    152, 153, 154, 157, 158, 159, 160, 161, 162, 163, 164, 175, 176, 177, 178, 179,
    122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 143, 144, 145, 146, 147, 148, 149,
    92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 112, 113, 114, 115, 116, 117, 118, 119,
    62, 63, 64, 65, 66, 67, 68, 69, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
    42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57
]);

// **Convert Position to Grid Number**
function getGridNumber(x, y) {
    let col = Math.floor(x / (canvas.width / 30));
    let row = Math.floor(y / (canvas.height / 10));
    return row * 30 + col + 1;
}

// **Check if position is allowed (Prevents entering blocked areas)**
function isAllowed(x, y) {
    return freeBlocks.has(getGridNumber(x, y));
}

// **Show Start Message with Game Info**
function showStartMessage() {
    const messageBox = document.createElement("div");
    messageBox.id = "messageBox";
    messageBox.innerHTML = `
        <h2>🏁 Welcome to the Ultimate Race! 🏁</h2>
        <p>🎮 <b>This is a 2-Player Game!</b></p>
        <p>🏆 <b>No Rules – Make Your Own!</b></p>
        <p>🔄 <b>No. of Laps:</b> Unlimited (Decide Among Yourselves!)</p>
        <p>🚗 <b>Controls:</b></p>
        <ul>
            <li>🟡 <b>Yellow Car:</b> Arrow Keys (⬆️⬇️⬅️➡️)</li>
            <li>🔴 <b>Red Car:</b> W A S D</li>
        </ul>
        <p>🎉 <b>Have Fun & Enjoy the Race!</b></p>
        <p><b>Press SPACEBAR to Start!</b></p>
    `;
    messageBox.style.position = "absolute";
    messageBox.style.top = "50%";
    messageBox.style.left = "50%";
    messageBox.style.transform = "translate(-50%, -50%)";
    messageBox.style.background = "rgba(0, 0, 0, 0.8)";
    messageBox.style.color = "white";
    messageBox.style.padding = "20px";
    messageBox.style.borderRadius = "10px";
    messageBox.style.fontSize = "18px";
    messageBox.style.textAlign = "center";
    document.body.appendChild(messageBox);
}

// **Update function**
function update() {
    if (!gameStarted) return; // Prevent movement before starting

    // **Player 1 (Yellow Car) - Arrow Key Controls**
    if (keys['ArrowUp']) speed1 = maxSpeed;
    else if (keys['ArrowDown']) speed1 = -maxSpeed / 2;
    else speed1 = 0;

    if (keys['ArrowLeft']) angle1 -= 4;
    if (keys['ArrowRight']) angle1 += 4;

    let nextCar1X = car1X + Math.cos(angle1 * Math.PI / 180) * speed1;
    let nextCar1Y = car1Y + Math.sin(angle1 * Math.PI / 180) * speed1;

    if (isAllowed(nextCar1X, nextCar1Y)) {
        car1X = nextCar1X;
        car1Y = nextCar1Y;
    }

    // **Player 2 (Red Car) - WASD Controls**
    if (keys['w']) speed2 = maxSpeed;
    else if (keys['s']) speed2 = -maxSpeed / 3;
    else speed2 = 0;

    if (keys['a']) angle2 -= 4;
    if (keys['d']) angle2 += 4;

    let nextCar2X = car2X + Math.cos(angle2 * Math.PI / 180) * speed2;
    let nextCar2Y = car2Y + Math.sin(angle2 * Math.PI / 180) * speed2;

    if (isAllowed(nextCar2X, nextCar2Y)) {
        car2X = nextCar2X;
        car2Y = nextCar2Y;
    }
}

// **Draw function**
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(track, 0, 0, canvas.width, canvas.height);

    // Draw Player 1 (Yellow Car)
    ctx.save();
    ctx.translate(car1X + 25, car1Y + 25);
    ctx.rotate((angle1 * Math.PI) / 180);
    ctx.drawImage(yellowCar, -25, -25, 50, 50);
    ctx.restore();

    // Draw Player 2 (Red Car)
    ctx.save();
    ctx.translate(car2X + 25, car2Y + 25);
    ctx.rotate((angle2 * Math.PI) / 180);
    ctx.drawImage(redCar, -25, -15, 50, 25);
    ctx.restore();
}

// **Game loop**
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// **Start game after assets load**
track.onload = () => {
    showStartMessage();
};

// **Start game on SPACEBAR press**
window.addEventListener('keydown', (e) => { 
    if (!gameStarted && e.key === " ") {
        gameStarted = true;
        document.getElementById("messageBox").remove();
        gameLoop();
    }
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => { keys[e.key] = false; });
 