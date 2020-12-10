// Using P%js library, I created a simple wind simulation
// I got help from the documenation and examples from p5js.org
// By: Adrian Vaduva

let system;
let numberOfParicles;
// A wind direction vector
let wind;

let img;

let renderMode;

let lifetaken;

let angle;
let windmag;

//Sliders
let valueSlider;
let colorSlider;
let renderModeSlider;
let lifespanSlider;
let angleSlider;

//PRELOAD
function preload(){
  // Request the data from metaweather.com
  let url = 'https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/28218/';
  loadJSON(url,gotWeather);
  wind = createVector();

  img = loadImage("smoke-lowres1.png");
}
//SETUP
function setup() {
  createCanvas(1280, 720, P2D);
  system = new ParticleSystem(createVector(width / 2, 300)); 
  renderMode = 1;

  //Sliders
  valueSlider = createSlider(1, 100, 30);
  valueSlider.position(10,100);
  valueSlider.style('width', '80px');


  lifespanSlider = createSlider(1, 10, 2);
  lifespanSlider.position(10,120);
  lifespanSlider.style('width', '80px');
  
  renderModeSlider = createSlider(1, 3, 1);
  renderModeSlider.position(10,140);
  renderModeSlider.style('width', '80px');
  
  angleSlider = createSlider(0, 360, 0);
  angleSlider.position(10,160);
  angleSlider.style('width', '80px');
}

function draw() {
  background(0);
  system.addParticle();
  system.run();

  //FPS counter
  let fps = frameRate();
  fill(255);
  stroke(0);
  text("FPS: " + fps.toFixed(2), 10, height - 10);

  // fill(255);
  // stroke(0);
  // text("Wind Speed", 110, 10);
  console.log("Framerate: " + frameRate() + " Number of particles: " + numberOfParicles);

  let valueSlider_val = valueSlider.value();
  if  (valueSlider_val != 30){
    wind.setMag(valueSlider_val*0.002);
    windmag = valueSlider_val;
  }

  let angleSlider_val = angleSlider.value();
  if  (angleSlider_val != 0){
    wind = p5.Vector.fromAngle(angleSlider.value()*Math.PI/180, windmag*0.002);
  }
    //console.log(angleSlider.value());
  lifetaken = lifespanSlider.value();
  renderMode = renderModeSlider.value();
}

// PARTICLE CLASS
let Particle = function(position) {
  this.acceleration = wind;
  this.velocity = p5.Vector.random2D().div(Math.floor(Math.random() * 9 + 2));
  this.position = position.copy();
  this.lifespan = 255;
};

Particle.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position
Particle.prototype.update = function(){
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.lifespan -= lifetaken;
};

// Method to display
Particle.prototype.display = function() {
  if(renderMode == 1){
    //RENDER 1
    stroke(200, this.lifespan);
    strokeWeight(2);
    fill(127, this.lifespan);
    ellipse(this.position.x, this.position.y, 12, 12);
  } else if (renderMode == 2){
    //RENDER 2
    fill(255,this.lifespan);
    noStroke();
    ellipse(this.position.x, this.position.y, 5, 5);
  } else{
    //RENDER 3
    imageMode(CENTER);
    tint(255,this.lifespan);
    image(img,this.position.x, this.position.y, 30, 30);
  }

};

// Is the particle still useful?
Particle.prototype.isDead = function(){
  return this.lifespan < 0;
};

//PARTCICLE SYSTEM CLASS
let ParticleSystem = function(position) {
  this.origin = position.copy();
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function() {
  this.particles.push(new Particle(this.origin));
};

ParticleSystem.prototype.run = function() {
  for (let i = this.particles.length-1; i >= 0; i--) {
    let p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
    numberOfParicles = this.particles.length;
  }
};

function gotWeather(weather) {
  let weather_today = weather.consolidated_weather[0];
  // Get the angle (convert to radians)
  angle = radians(Number(weather_today.wind_direction) - 90); //-90 to set the North as degree 0
  // Get the wind speed
  windmag = Number(weather_today.wind_speed);
  // Get weather condition
  let weathercondition = weather_today.weather_state_name;
  // Get wind direction
  let winddirection = weather_today.wind_direction;
  // Get location
  let location = weather.title;
  
  // Display as HTML elements
  let locationDiv = createDiv("LOCATION: " + location);
  let temperatureDiv = createDiv(floor(weather_today.the_temp) + '&deg;C');
  let windDiv = createDiv("WIND " + windmag + " <small>MPH</small>");
  let winddirectionDiv = createDiv("WIND DIRECTION: " + winddirection + '&deg;');
  let weatherconditionDiv = createDiv("WEATHER CONDITION: " + weathercondition)
  
  
  // Make a vector
  wind = p5.Vector.fromAngle(angle, windmag*0.002);
  console.log(angle);
};