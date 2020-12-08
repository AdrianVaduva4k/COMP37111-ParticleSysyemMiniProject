let system;
// A wind direction vector
let wind;

//PRELOAD
function preload(){
  // Request the data from metaweather.com
  let url = 'https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/2459115/';
  loadJSON(url,gotWeather);
  wind = createVector();
}
//SETUP
function setup() {
  createCanvas(1280, 720);
  system = new ParticleSystem(createVector(width / 2, 300));
}

function draw() {
  background(0);
  system.addParticle();
  system.run();
}

// PARTICLE CLASS
let Particle = function(position) {
  this.acceleration = wind;
  this.velocity = createVector(random(-0.5, 0.5), random(-0.5, 0));
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
  this.lifespan -= 2;
};

// Method to display
Particle.prototype.display = function() {
  // stroke(200, this.lifespan);
  // strokeWeight(2);
  // fill(127, this.lifespan);
  fill(255,this.lifespan);
  noStroke();
  ellipse(this.position.x, this.position.y, 10, 10);
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
  wind = p5.Vector.fromAngle(angle, windmag*0.0015);
};