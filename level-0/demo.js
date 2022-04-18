/*
       document : demo.js
     created on : 2022 april 17, 4:40 am (sunday)
         author : audrey bongalon (bongalon@usc.edu)
    description : intro for easy web app CTF. teaching js (USC miniCTF 2022)

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

const demoDiv        = document.getElementById("demo-div");
const mouseOutputX   = document.getElementById("mouse-x");
const mouseOutputY   = document.getElementById("mouse-y");
const clickOutputX   = document.getElementById("click-x");
const clickOutputY   = document.getElementById("click-y");
const keyboardOutput = document.getElementById("key-pressed");




// set up CSS properties for the div
demoDiv.style.transition = "background-color 0.25s ease";
const flashColour = getComputedStyle(document.body).getPropertyValue("--level-colour");




// track mouse movement
document.addEventListener("mousemove", event => {
    mouseOutputX.innerHTML = event.pageX;
    mouseOutputY.innerHTML = event.pageY;
});


// track clicks
document.addEventListener("mousedown", event => {
    clickOutputX.innerHTML = event.pageX;
    clickOutputY.innerHTML = event.pageY;

    demoDiv.style.backgroundColor = flashColour;
});


// track keyboard presses
document.addEventListener("keydown", event => {
    keyboardOutput.innerHTML = event.key === " " ? "Space" : event.key;
    demoDiv.style.backgroundColor = flashColour;
});




// reset colour after a click
document.addEventListener("mouseup", event => {
    demoDiv.style.backgroundColor = "transparent";
});


// reset colour after a key press
document.addEventListener("keyup", event => {
    demoDiv.style.backgroundColor = "transparent";
});

