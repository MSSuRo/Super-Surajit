// ===============================
// MOBILE TOUCH CONTROLS
// ===============================

const mobileControls = document.createElement("div");

mobileControls.id = "mobileControls";

mobileControls.innerHTML = `
    <button id="leftBtn">◀</button>

    <button id="jumpBtn">▲</button>

    <button id="rightBtn">▶</button>
`;

document.body.appendChild(mobileControls);


// ===============================
// BUTTON STYLE
// ===============================

const mobileStyle = document.createElement("style");

mobileStyle.textContent = `

#mobileControls {

    position: fixed;

    bottom: 20px;
    left: 0;

    width: 100%;

    display: none;

    justify-content: space-between;

    padding: 0 25px;

    pointer-events: none;

    z-index: 999;

}


#mobileControls button {

    width: 65px;
    height: 65px;

    border: none;

    border-radius: 50%;

    background: rgba(0, 0, 0, 0.65);

    color: white;

    font-size: 28px;

    font-weight: bold;

    pointer-events: auto;

    touch-action: none;

    user-select: none;

}


#mobileControls button:active {

    background: rgba(255, 255, 255, 0.35);

    transform: scale(0.92);

}


@media (max-width: 768px) {

    #mobileControls {

        display: flex;

    }

}

`;

document.head.appendChild(mobileStyle);


// ===============================
// BUTTONS
// ===============================

const leftButton =
    document.getElementById("leftBtn");

const rightButton =
    document.getElementById("rightBtn");

const jumpButton =
    document.getElementById("jumpBtn");


// ===============================
// TOUCH START
// ===============================

function pressKey(key) {

    keys[key] = true;

}


// ===============================
// TOUCH END
// ===============================

function releaseKey(key) {

    keys[key] = false;

}


// ===============================
// LEFT BUTTON
// ===============================

leftButton.addEventListener(
    "touchstart",
    (event) => {

        event.preventDefault();

        pressKey("arrowleft");

    },
    { passive: false }
);


leftButton.addEventListener(
    "touchend",
    (event) => {

        event.preventDefault();

        releaseKey("arrowleft");

    },
    { passive: false }
);


// ===============================
// RIGHT BUTTON
// ===============================

rightButton.addEventListener(
    "touchstart",
    (event) => {

        event.preventDefault();

        pressKey("arrowright");

    },
    { passive: false }
);


rightButton.addEventListener(
    "touchend",
    (event) => {

        event.preventDefault();

        releaseKey("arrowright");

    },
    { passive: false }
);


// ===============================
// JUMP BUTTON
// ===============================

jumpButton.addEventListener(
    "touchstart",
    (event) => {

        event.preventDefault();

        pressKey("arrowup");

    },
    { passive: false }
);


jumpButton.addEventListener(
    "touchend",
    (event) => {

        event.preventDefault();

        releaseKey("arrowup");

    },
    { passive: false }
);
