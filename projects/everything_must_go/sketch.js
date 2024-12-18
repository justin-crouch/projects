const ASPECT_RATIO = 16 / 9;
const BASE_WINDOW = {'width': 1280, 'height': 720};
let   WIN_SCALE = 1;

// module aliases
const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    MConstraint = Matter.MouseConstraint,
    Mouse  = Matter.Mouse,
    Constraint = Matter.Constraint,
    Vector = Matter.Vector,
    Events = Matter.Events;

let engine = Engine.create({
  velocityIterations: 12,
  positionIterations: 16
});
Events.on(engine, 'collisionStart', onCollideStart);
Events.on(engine, 'collisionActive', onCollideEnd);

let mouseConstraint; 

let circleWorld = Composite.create();
let boxy;

let askFullscreen;

function setup() 
{
  let windowSize = getWindowSize();
  let canvas = createCanvas(windowSize.width, windowSize.height);
  frameRate(60);

  boxy = Bodies.rectangle(100, 200, 30, 30, {
    health: 100,
    minImpact: 180,
    mass: 10,
    defColor: color(0, 255, 0),
    color: color(0, 255, 0),
  });

  askFullscreen = createButton("Fullscreen");
  askFullscreen.position(0, 10);
  askFullscreen.center('horizontal');
  askFullscreen.style('font-size', '20px');
  askFullscreen.style('border-radius', '10px');
  askFullscreen.mousePressed(toggleFullscreen);

  let canvasMouse = Mouse.create(canvas.elt);
  canvasMouse.pixelRatio = pixelDensity();
  mouseConstraint = MConstraint.create(engine, {
    mouse: canvasMouse,
    constraint: {
      stiffness: 0.05
    }
  });

  Mouse.setScale(mouseConstraint.mouse, Vector.create(1/WIN_SCALE, 1/WIN_SCALE));
  Composite.add(engine.world, [boxy, circleWorld, mouseConstraint]);

  Composite.add(engine.world, Bodies.rectangle(640, 720, 1280, 50, {isStatic: true, color: color(255)}));
  Composite.add(engine.world, Bodies.rectangle(0, 360, 50, 720, {isStatic: true, color: color(255)}));
  Composite.add(engine.world, Bodies.rectangle(1280, 360, 50, 720, {isStatic: true, color: color(255)}));

  Runner.run(Runner.create(), engine);
}

function draw() {
  if(fullscreen())
  {
    askFullscreen.hide();
  } else
  {
    askFullscreen.show();
  }

  if(frameCount%60 == 0 && Composite.allBodies(circleWorld).length < 10)
  {
    let newColor = color(random(255), random(255), random(255));
    let newCircle = Bodies.circle(500 + random(3), 350 + random(3), 20, {
      defColor: newColor,
      color: newColor,
      health: 100,
      minImpact: 30
    });
    
    Composite.add(circleWorld, newCircle);
  }
  if(Composite.allBodies(circleWorld).length > 10)
  {
    Composite.remove(
      circleWorld,
      Composite.allBodies(circleWorld)[0]
    );
  }

  background(127);
  scale(WIN_SCALE);

  for(let body of Composite.allBodies(engine.world))
  {
    let outOfBounds = body.position.y > height*2;
    if(body.label == "Rectangle Body")
    {
      let index0 = createVector(body.vertices[0].x, body.vertices[0].y);
      let index1 = createVector(body.vertices[1].x, body.vertices[1].y);
      let index3 = createVector(body.vertices[3].x, body.vertices[3].y);

      let width = index0.dist(index1);
      let height = index0.dist(index3);
     
      push();
      fill(body.color);
      drawRectFromBody(body, {width: width, height: height});
      pop();

      if(outOfBounds) Composite.remove(engine.world, body);
    } else if(body.label == "Circle Body")
    {
      push();
      fill(body.color || color(255));
      drawCircleFromBody(body, {radius: body.circleRadius});
      pop();

      if(outOfBounds) Composite.remove(circleWorld, body);
    } else if(body.label == "Slice Body")
    {
      push();
      fill(body.color);
      drawSlice(body);
      pop();

      if(outOfBounds) Composite.remove(engine.world, body);
    }

    if(body.health)
    {
      push();
      translate(body.position.x, body.position.y);
      textSize(24);
      text(body.health, 0, 0);
      pop();
    }
  }
}

function windowResized()
{
  let windowSize = getWindowSize();
  resizeCanvas(windowSize.width, windowSize.height);

  Mouse.setScale(mouseConstraint.mouse, Vector.create(1/WIN_SCALE, 1/WIN_SCALE));
  askFullscreen.position(0, 10);
  askFullscreen.center('horizontal');
}

function keyPressed()
{
  if(key === 'f')
  {
    toggleFullscreen();
  }
}

function deviceOrientation()
{
  askFullscreen.position(0, 10);
  askFullscreen.center('horizontal');
}

function getWindowSize()
{
  let canvasWidth = windowWidth;
  let canvasHeight = windowWidth / ASPECT_RATIO;
  if(canvasHeight > windowHeight)
  {
    canvasWidth = windowHeight * ASPECT_RATIO;
    canvasHeight = windowHeight;
  }
  WIN_SCALE = canvasWidth / BASE_WINDOW.width;

  return {'width': canvasWidth, 'height': canvasHeight};
}

function toggleFullscreen()
{
  fullscreen( !fullscreen() );
}

function onCollideStart(evnt)
{
  for(let collision of evnt.pairs)
  {
    let bodyA = collision.bodyA,
	bodyB = collision.bodyB;

    bodyA.collisionVelocity = Vector.clone(bodyA.velocity);
    bodyB.collisionVelocity = Vector.clone(bodyB.velocity);
  }
}

function onCollideEnd(evnt)
{
  let collision = evnt.pairs[0];
  for(let collision of evnt.pairs)
  {
    for(let body of [collision.bodyA, collision.bodyB])
    {
      if(!body.collisionVelocity) continue;

      let momentum = getMomentum(body);
      if(damageBodyFromMomentum(body, momentum))
      {
	fractureBody(body);
      } else body.collisionVelocity = NaN;
    }
  }
}

function getMomentum(body)
{
  let momentum = Vector.mult((Vector.sub(body.velocity, body.collisionVelocity)), body.mass);
  return momentum;
}

function damageBody(body, amnt)
{
  body.health -= amnt;
  return body.health <= 0;
}

function damageBodyFromMomentum(body, momentum)
{
  if(!body.health) return false;
  
  const impact = Vector.magnitude(momentum);
  if(impact >= body.minImpact)
  {
    return damageBody(body, impact-body.minImpact);
  }
}

function fractureBody(body)
{
  randomSeed(body.id);
  let rx = random(body.width),plo
      ry = random(body.height);
  const vertices = body.vertices;

  for(let i=0; i<min(vertices.length-1, 8); i++)
  {
    let newSlice = Bodies.fromVertices(body.position.x, body.position.y, [
	vertices[i],
	Vector.create(rx+body.position.x, ry+body.position.y),
	vertices[i+1]
      ]);
    newSlice.label = "Slice Body";
    newSlice.defColor = body.defColor;
    newSlice.color = body.color;
    Composite.add(engine.world, newSlice);
  }

  let world = engine.world;
  if(body.label == "Circle Body") world = circleWorld;

  Composite.remove(world, body);
}
