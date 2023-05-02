const vertexShaderSource = `#version 300 es
 
// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
 
// all shaders have a main function
void main() {
 
  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = a_position;
}
`;

const fragmentShaderSource = `#version 300 es
 
// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;
 
// we need to declare an output for the fragment shader
out vec4 outColor;
 
void main() {
  // Just set the output to a constant reddish-purple
  outColor = vec4(1, 0, 0.5, 1);
}
`;

export function renderTriangle({ canvasSel }) {
  var canvas = document.querySelector(canvasSel);
  var gl = canvas.getContext('webgl2');
  if (!gl) {
    throw new Error('WebGL2 is not supported by this browser.');
  }

  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );
  var program = createProgram(gl, vertexShader, fragmentShader);

  // This is a pointer to the a_position variable in the vertex shader script.
  var positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  var positionBuffer = gl.createBuffer();
  // Make a global.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var positions: number[] = [0, 0, 0, 0.5, 0.5, 0];
  // Puts positions into positionBuffer.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  // I think this says that a source array should feed values to this location in the
  // vertex shader script.
  gl.enableVertexAttribArray(positionAttributeLocation);

  // The vertexAttribPointer call uses this to say how it should go through the
  // source array to feed the vertex shader script.
  const size = 2; // 2 components per iteration, e.g. use 0, 0, then 0, 0.5, then 0.7, 0.
  // Go pair by pair through positionBuffer.
  const type = gl.FLOAT; // the data is 32bit floats
  const normalize = false; // don't normalize the data
  const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  const offset = 0; // start at the beginning of the buffer

  // Implicitly binds positionAttributeLocation to positionBuffer.
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Bind the attribute/buffer set we want.
  gl.bindVertexArray(vao);

  var primitiveType = gl.TRIANGLES;

  // Starting at 0 in the array, draw three times.
  gl.drawArrays(primitiveType, 0, 3);
}

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  const errorMsg = `Error while creating shader: ${gl.getShaderInfoLog(
    shader
  )}`;
  gl.deleteShader(shader);
  throw new Error(errorMsg);
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  const errorMsg = `Error while creating shader: ${gl.getProgramInfoLog(
    program
  )}`;
  gl.deleteProgram(program);
  throw new Error(errorMsg);
}
