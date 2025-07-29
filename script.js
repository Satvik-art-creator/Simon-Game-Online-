let main = document.querySelector("main");
let boxes = document.querySelectorAll(".box");
let lvlDisplay = document.querySelector(".level");
let li = document.querySelector(".strt");
let highScoreDs = document.querySelector(".highScore");
let audio = document.querySelector("audio");

let Box4 = document.querySelector(".box4");
let Box5 = document.querySelector(".box5");

let rndmBox = ["box0", "box1", "box2", "box3"];

let lvlCount = 0;
let scores = [];

let started = false;
let userClick = true;

let gameSeq = [];
let userSeq = [];

//sets the volume of audio
audio.volume = 0.6;

while(true){
  let userName = prompt("What's ur Name? [KIMI WO NA]");

if (userName === "" || userName === null) {
  userName = prompt("What's ur Name? [KIMI WO NA]");
} else {
  alert(
    `KONICHIWA!! ${userName}\nLet's see your Memory!!\nEnjoy the game 😄😄`
  );
}
break;
}

// Flash function for Simon (game) sequence
function flash(box) {
  let btnDiv = document.querySelector(`.${box}`);
  btnDiv.classList.add("flash");
  setTimeout(() => {
    btnDiv.classList.remove("flash");
  }, 250);
}

// Flash function for user clicks
function userFlash(userBox) {
  userBox.classList.add("userFlash");
  setTimeout(() => {
    userBox.classList.remove("userFlash");
  }, 250);
}

// Level-up logic and next box generation
function levelUp() {
  lvlCount += 1;
  lvlDisplay.innerText = `Level ${lvlCount}`;
  userClick = false; // Block user input while showing the next sequence

  // console.log(rndmBox.length-1);

  let num = rndmBox.length - 1;
  let rndm = Math.floor(Math.random() * num);
  let nextBox = rndmBox[rndm];
  gameSeq.push(nextBox);

  setTimeout(() => {
    flash(nextBox);
    userClick = true; // Allow input after flashing
  }, 300);

  if (lvlCount >= 10) {
    Box4.style.display = "block";
    Box5.style.display = "block";
    main.style.gridTemplateColumns = "repeat(3, 280px)";

    rndmBox.push("box4", "box5");
  } else {
    Box4.style.display = "none";
    Box5.style.display = "none";
    main.style.gridTemplateColumns = "repeat(2, 280px)";

    rndmBox = ["box0", "box1", "box2", "box3"];
  }
}

// Only add click listeners ONCE
for (let box of boxes) {
  box.addEventListener("click", function () {
    if (userClick && started) {
      userClick = false; // Temporarily block additional clicks
      userFlash(this);
      userSeq.push(this.classList[1]);
      checkSeq(userSeq.length - 1);

      // Re-enable click after short cooldown
      setTimeout(() => {
        userClick = true;
      }, 250); // Adjust timing as needed
    }
  });

  //prevent doubleclicking of user
  box.addEventListener("dblclick", (e) => e.preventDefault());
}

// console.log(newBox4, lvlCount,);

// Game start
document.addEventListener("keydown", () => {
  if (!started) {
    started = true;
    userClick = false;
    lvlCount = 0;
    li.innerText = "★★ Good Luck!!";
    gameSeq = [];
    userSeq = [];

    for (let box of boxes) {
      box.style.cursor = "pointer";
    }

    levelUp();
    highScore();

    audio.play();
  }
});

// Sequence checking logic
function checkSeq(idx) {
  if (gameSeq[idx] === userSeq[idx]) {
    if (gameSeq.length === userSeq.length) {
      setTimeout(levelUp, 700);
      userSeq = [];
    }
  } else {
    reset();
  }
}

// Game over effect
function gameOver() {
  let body = document.querySelector("body");
  body.style.backgroundColor = "#880808";
  setTimeout(() => {
    body.style.backgroundColor = "#fff";
  }, 500);
}

// Reset game after wrong input
function reset() {
  gameOver();
  started = false;
  userClick = false;

  if (!scores.includes(lvlCount)) {
    scores.push(lvlCount);
  }

  li.innerText = `Press any key to start the game again !!`;
  lvlDisplay.innerText = `GAME OVER!! Your final score is ${lvlCount}`;

  for (let box of boxes) {
    box.style.cursor = "default";
  }

  highScore();

  lvlCount = 0;
  gameSeq = [];
  userSeq = [];

  audio.pause();
}

// Show high score
function highScore() {
  let bigScore = scores.length > 0 ? Math.max(...scores) : 0;
  highScoreDs.innerText = `High Score: ${bigScore}`;
}
