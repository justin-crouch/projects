function transformFromBody(body)
{
  translate(body.position.x, body.position.y);
  rotate(body.angle);
}

function drawRectFromBody(body, size)
{
  transformFromBody(body);
  rect(-size.width/2, -size.height/2, size.width, size.height);

  if(body.health) drawCracksOnRect(body, size);
}

function drawCracksOnRect(body, size)
{
  if(body.health <= 50)
  {
    randomSeed(body.id);
    let rx = random(size.width),
	ry = random(size.height);    

    beginShape();
      vertex(-size.width/2, -size.height/2);
      vertex(rx, ry);
      vertex(size.width/2, -size.height/2);
      vertex(rx, ry);
      vertex(size.width/2, size.height/2);
      vertex(rx, ry);
      vertex(-size.width/2, size.height/2);
    endShape();
  }
}

function drawCircleFromBody(body, size)
{
  transformFromBody(body);
  circle(0, 0, size.radius*2);
  line(0, 0, size.radius, 0);

  if(body.health) drawCracksOnCircle(body, size);
}

function drawCracksOnCircle(body, size)
{
  if(body.health <= 50)
  {
    randomSeed(body.id);
    let rx = random(size.radius),
	ry = random(size.radius);    

    beginShape();
      vertex(size.radius, 0);
      vertex(rx, ry);
      
      vertex(0, size.radius);
      vertex(rx, ry);

      vertex(-size.radius, 0);
      vertex(rx, ry);

      vertex(0, -size.radius);
      vertex(rx, ry);
    endShape();
  }
}

function drawSlice(body)
{
//  transformFromBody(body);
  beginShape();
    for(let p of body.vertices)
    {
      vertex(p.x, p.y);
    }
  endShape(CLOSE);
}

function customShape(origin, points, scale=1, color='#fff')
{
  push();
  translate(origin[0], origin[1]);
  fill(color);
  beginShape();

    for(let p of points)
    {
      vertex(p[0]*scale, p[1]*scale);
    }

  endShape(CLOSE);
  pop();
}
