#ifdef GL_SL
precision highp float;
#endif

void main()
{
  vec3 color = vec3(0.0, 1.0, 0.0);
  
  gl_FragColor = vec4(color, 1.0);
}
