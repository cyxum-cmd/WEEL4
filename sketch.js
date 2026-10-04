let circleX = [];
let circleY = [];
let circleSize = [];
let circleColor = [];

let squareX = [];
let squareY = [];
let squareSize = [];
let squareHealth = [];
let squarePic = [];
let popSound;

function preload() {
  popSound = loadSound('dragon-studio-pop-402324.mp3');
}

function setup() {
  createCanvas(800, 600);
  noStroke();

  popSound.playMode('sustain'); // lets pops overlap instead of restarting

  for (let i = 0; i < 6; i++) {
    circleX.push(0);
    circleY.push(0);
    circleSize.push(0);
    circleColor.push(0);
    resetCircle(i);
  }

  for (let i = 0; i < 10; i++) {
    squareX.push(0);
    squareY.push(0);
    squareSize.push(0);
    squareHealth.push(0);
    squarePic.push(0);
    resetSquare(i);
  }
}

// Browsers block audio until the user interacts, so click the canvas once
function mousePressed() {
  userStartAudio();
}

function draw() {
  background(240);

  for (let i = 0; i < 6; i++) {
    let nearestSquare = 0;
    let nearestDistance = 100000;

    for (let j = 0; j < 10; j++) {
      let centerX = squareX[j] + squareSize[j] / 2;
      let centerY = squareY[j] + squareSize[j] / 2;
      let distance = dist(circleX[i], circleY[i], centerX, centerY);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestSquare = j;
      }
    }

    let targetX = squareX[nearestSquare] + squareSize[nearestSquare] / 2;
    let targetY = squareY[nearestSquare] + squareSize[nearestSquare] / 2;

    if (nearestDistance > 2) {
      circleX[i] =
        circleX[i] + ((targetX - circleX[i]) / nearestDistance) * 1.5;
      circleY[i] =
        circleY[i] + ((targetY - circleY[i]) / nearestDistance) * 1.5;
    }

    for (let j = 0; j < 10; j++) {
      let closestX = constrain(
        circleX[i],
        squareX[j],
        squareX[j] + squareSize[j],
      );
      let closestY = constrain(
        circleY[i],
        squareY[j],
        squareY[j] + squareSize[j],
      );
      let distance = dist(circleX[i], circleY[i], closestX, closestY);

      if (distance < circleSize[i] / 2) {
        squarePic[j].erase();
        squarePic[j].circle(
          circleX[i] - squareX[j],
          circleY[i] - squareY[j],
          circleSize[i],
        );
        squarePic[j].noErase();

        squareHealth[j] = squareHealth[j] - 1;
        circleSize[i] = circleSize[i] + 0.08;

        if (squareHealth[j] <= 0) {
          popSound.play(); // circle finished eating a square
          resetSquare(j);
        }
      }
    }

    for (let k = 0; k < 6; k++) {
      if (k !== i) {
        let isBigger = circleSize[i] > circleSize[k] * 1.15;
        let isInside =
          dist(circleX[i], circleY[i], circleX[k], circleY[k]) <
          circleSize[i] / 2;

        if (isBigger && isInside) {
          circleSize[i] = circleSize[i] + circleSize[k] * 0.15;
          popSound.play(); // circle ate another circle
          resetCircle(k);
        }
      }
    }
  }

  for (let j = 0; j < 10; j++) {
    image(squarePic[j], squareX[j], squareY[j]);
  }

  for (let i = 0; i < 6; i++) {
    fill(circleColor[i]);
    circle(circleX[i], circleY[i], circleSize[i]);
  }
}

function resetCircle(i) {
  circleX[i] = random(width);
  circleY[i] = random(height);
  circleSize[i] = 15;
  circleColor[i] = color(
    random(120, 255),
    random(120, 255),
    random(120, 255),
    150,
  );
}

function resetSquare(i) {
  if (squarePic[i] !== 0) {
    squarePic[i].remove();
  }

  squareSize[i] = random(30, 90);
  squareX[i] = random(width - squareSize[i]);
  squareY[i] = random(height - squareSize[i]);
  squareHealth[i] = squareSize[i];

  squarePic[i] = createGraphics(squareSize[i], squareSize[i]);
  squarePic[i].noStroke();
  squarePic[i].fill(random(120, 255), random(120, 255), random(120, 255), 170);
  squarePic[i].square(0, 0, squareSize[i]);
}