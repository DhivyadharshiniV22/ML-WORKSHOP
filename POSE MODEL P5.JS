
let poseModelURL = 'https://teachablemachine.withgoogle.com/models/PASTE_YOUR_MODEL_ID_HERE/';

let classifier, video, label = "Waiting", confidence = 0.0;
let paintLayer;

function setup() {
  createCanvas(640, 520);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  paintLayer = createGraphics(640, 440);
  paintLayer.clear();

  classifier = ml5.imageClassifier(poseModelURL + 'model.json', video, () => classifyVideo());
}

function classifyVideo() { classifier.classify(gotResult); }

function gotResult(err, res) {
  if (!err && res.length > 0) {
    label = res[0].label;
    confidence = res[0].confidence;
  }
  classifyVideo();
}

function draw() {
  background(20);
  push(); translate(width, 0); scale(-1, 1);
  tint(255, 130);
  image(video, 0, 0, width, 440);
  pop();

  if (confidence > 0.80) {
    let mode = label.toLowerCase();
    if (mode.includes("draw")) {
      paintLayer.fill(0, 220, 255);
      paintLayer.noStroke();
      paintLayer.ellipse(mouseX, mouseY, 18, 18);
    } else if (mode.includes("clear")) {
      paintLayer.clear();
    }
  }

  image(paintLayer, 0, 0);

  fill(30); noStroke(); rect(0, 440, width, 80);
  fill(255); textSize(20); textAlign(LEFT, CENTER);
  text("Mode: " + label + " (" + floor(confidence * 100) + "%)", 20, 480);
}
