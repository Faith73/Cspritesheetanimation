const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world;
var canvas, angle, tower, ground, cannon, cannonball;
var balls = [];
var boats = [];

var boatAnimation=[];
var boatSpritedata,boatSpritesheet;
var brokenBoatAnimation=[];
var brokenBoatSpritedata,brokenBoatSpritesheet;

function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
  brokenBoatSpritedata=loadJSON("assets/boat/broken-ship-01.json")
  brokenBoatSpritesheet=loadImage("assets/boat/broken-ship-01.png");
  boatSpritedata=loadJSON("assets/boat/boat.json")
  boatSpritesheet=loadImage("assets/boat/boat.png");
}

function setup() {
  canvas = createCanvas(windowWidth -10, windowHeight -5);
  engine = Engine.create();
  world = engine.world;
  angle=-PI/4;
  ground=new Ground(0,height -1,width *2,10);

  tower = new Tower(width/2-650,height-300,200,500,400);
  cannon=new Cannon (width/2-620,height/2-210,120,40,angle);
  boat = new Boat (width,height - 100,200,200,-100);

  var boatFrames=boatSpritedata.frames;
  for(var i=0; i<boatFrames.length; i++){
    var pos=boatFrames[i].position;
    var img=boatSpritesheet.get(pos.x,pos.y,pos.w,pos.h);
    boatAnimation.push(img);
  }

  var brokenBoatFrames=brokenBoatSpritedata.frames;
  for(var i=0; i<brokenBoatFrames.length; i++){
    var pos=brokenBoatFrames[i].position;
    var img=brokenBoatSpritesheet.get(pos.x,pos.y,pos.w,pos.h);
    brokenBoatAnimation.push(img);
  }
}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  

  Engine.update(engine);
  ground.display();
  
  showBoats();
  tower.display();
  cannon.display();
 
  for(var i=0; i<balls.length; i=i+1){
    showCannonballs(balls[i],i);
    for(var j=0;j<boats.length; j++){
      if (balls[i]!==undefined && boats [j]!==undefined){
        var collision = Matter.SAT.collides(balls[i].body,boats[j].body);
        if (collision.collided){
          boats[j].remove(j);

          World.remove(world,balls[i].body);
          balls.splice(i,1);
          i--;
        }
      }
    
  }
  }

}

//creatng the cannonball on keypress
function keyPressed(){
  if (keyCode===DOWN_ARROW){
    cannonball = new CannonBall(cannon.x,cannon.y);
    balls.push(cannonball);
  }
}

//function to shoot the ball
function keyReleased(){
  if (keyCode===DOWN_ARROW){
    balls[balls.length-1].shoot();
  }
}

//function to show the ball
function showCannonballs(ball,index){
  ball.display();
  if (ball.body.position.x>=width || ball.body.position.y>=height-50){
    World.remove(world,ball.body);
    balls.splice(index,1);
  }
}

//function to show the boats
function showBoats(){
  if (boats.length>0){
    if (boats.length<4 && boats[boats.length-1].body.position.x<width-300){
      var positions = [-40,-60,-70,-20];
      var position = random(positions);
      var boat = new Boat(width,height-100,170,170,position,boatAnimation);
      boats.push(boat);
    }
    
    for(var i=0;i<boats.length; i++){
      Matter.Body.setVelocity(boats[i].body,{x:-0.9,y:0});
      boats[i].display();
      boats[i].animate();
    }
}
  else{
    var boat = new Boat(width,height-60,170,170,-60,boatAnimation);
    boats.push(boat);
  }
}


