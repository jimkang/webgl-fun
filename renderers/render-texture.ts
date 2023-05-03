const vertexShaderSource = `#version 300 es
 
// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec2 a_texCoord;
in vec4 a_position;
out vec2 v_texCoord;
 
// all shaders have a main function
void main() {
 
  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = a_position;
  // Pass the texCoord out to the fragment shader. If you don't use it, it gets
  // optimized out, BTW.
  v_texCoord = a_texCoord;
}
`;

const fragmentShaderSource = `#version 300 es
 
// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;

// our texture
uniform sampler2D u_image;

// Passed from the vertex shader.
in vec2 v_texCoord;
 
// we need to declare an output for the fragment shader
out vec4 outColor;
 
void main() {
  // Just set the output to a constant reddish-purple
  // outColor = vec4(1, 0, 0.5, 1);
  // Look up a color from the texture.
  outColor = texture(u_image, v_texCoord);
}
`;

export function renderTexture({
  canvasSel,
  textureImages,
}: {
  canvasSel: string;
  textureImages: TexImageSource[];
}) {
  var canvas = document.querySelector(canvasSel) as HTMLCanvasElement;
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
  // Mapping to the a_texCoord in the vertex shader.
  var texCoordAttributeLocation = gl.getAttribLocation(program, 'a_texCoord');

  // Find the uniform variable (sort of a const) in the fragment shader.
  var imageLocation = gl.getUniformLocation(program, 'u_image');

  var positionBuffer = gl.createBuffer();
  // Make a global.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // var positions: number[] = [0, 0, 0, 0.5, 0.5, 0];
  // Puts positions into positionBuffer.
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  // Set a rectangle the same size as the image.
  var image = textureImages[0];
  setRectangle(gl, 0, 0, image.width, image.height);

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

  // Now that the triangle positions are in, add the texture coordinates.
  var texCoordBuffer = gl.createBuffer();
  var textureCoords = [
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
  ];
  // So we're bound to a new buffer now, leaving the position one behind.
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  // textureCoords gets bound/loaded into texCoordBuffer,not positionBuffer.
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(textureCoords),
    gl.STATIC_DRAW
  );
  // Say that the above buffer should feed values to a_texCoord in the vertex shader script.
  gl.enableVertexAttribArray(texCoordAttributeLocation);
  // Mostly the same params as the call for the position attribute.
  gl.vertexAttribPointer(
    texCoordAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  var texture = gl.createTexture();
  // The code after this will affect TEXTURE0.
  gl.activeTexture(gl.TEXTURE0 + 0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Setting these things on texture 0. Not yet sure what they do.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  var mipLevel = 0; // the largest mip
  var internalFormat = gl.RGBA; // format we want in the texture
  var srcFormat = gl.RGBA; // format of data we are supplying
  var srcType = gl.UNSIGNED_BYTE; // type of data we are supplying
  gl.texImage2D(
    gl.TEXTURE_2D,
    mipLevel,
    internalFormat,
    srcFormat,
    srcType,
    textureImages[0]
  );

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Tell the shader to get the texture from texture unit 0
  gl.uniform1i(imageLocation, 0);

  // Bind the attribute/buffer set we want.
  gl.bindVertexArray(vao);

  var primitiveType = gl.TRIANGLES;

  // Starting at 0 in the array, draw three times.
  // gl.drawArrays(primitiveType, 0, 3);

  // Draw the two triangles defined in textureCoords.
  gl.drawArrays(primitiveType, 0, 6);
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

function setRectangle(gl) {
  //}, x, y, width, height) {
  // We're not doing the pixel to clip space translation for now.
  // var x1 = x;
  // var x2 = x + width;
  // var y1 = y;
  // var y2 = y + height;
  var x1 = 0;
  var x2 = 1;
  var y1 = 1;
  var y2 = 0;
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW
  );
}
