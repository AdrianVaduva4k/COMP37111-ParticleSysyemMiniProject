let system;
// A wind direction vector
let wind;

let img;

let renderMode;

let lifetaken;

//Sliders
let valueSlider;
let colorSlider;
let renderModeSlider;
let lifespanSlider;

//PRELOAD
function preload(){
  // Request the data from metaweather.com
  let url = 'https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/2459115/';
  loadJSON(url,gotWeather);
  wind = createVector();

  img = loadImage("smoke.png");
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


  lifespanSlider = createSlider(1, 10, 5);
  lifespanSlider.position(10,120);
  lifespanSlider.style('width', '80px');
  
  renderModeSlider = createSlider(1, 3, 1);
  renderModeSlider.position(10,140);
  renderModeSlider.style('width', '80px');
  

}

function draw() {
  background(0);
  system.addParticle();
  system.run();

  let valueSlider_val = valueSlider.value();
  if  (valueSlider_val != 30)
    wind.setMag(valueSlider_val*0.002);

  lifetaken = lifespanSlider.value();
  renderMode = renderModeSlider.value();
}

// PARTICLE CLASS
let Particle = function(position) {
  this.acceleration = wind;
  this.velocity = createVector(random(-0.5, 1), random(-0.5, 0));
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
  }
};

function gotWeather(weather) {
  let weather_today = weather.consolidated_weather[0];
  // Get the angle (convert to radians)
  let angle = radians(Number(weather_today.wind_direction));
  // Get the wind speed
  let windmag = Number(weather_today.wind_speed);
  // Get weather condition
  let weathercondition = weather_today.weather_state_name;
  // Get location
  let location = weather.title;
  
  // Display as HTML elements
  let temperatureDiv = createDiv(floor(weather_today.the_temp) + '&deg;C');
  let windDiv = createDiv("WIND " + windmag + " <small>MPH</small>");
  let locationDiv = createDiv("LOCATION: " + location);
  let weatherconditionDiv = createDiv("WEATHER CONDITION: " + weathercondition)

  
  // Make a vector
  wind = p5.Vector.fromAngle(angle, windmag*0.002);
};