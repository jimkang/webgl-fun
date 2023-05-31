import { Pt3 } from '../types';

var m4 = {
  translation: function (tx, ty, tz) {
    // prettier-ignore
    return [
      1,  0,  0,  0,
      //
      0,  1,  0,  0,
      //
      0,  0,  1,  0,
      //
      tx, ty, tz, 1,
    ];
  },

  xRotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    // prettier-ignore
    return [
      1, 0, 0, 0, //
      0, c, s, 0, //
      0, -s, c, 0, //
      0, 0, 0, 1,
    ];
  },

  yRotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    // prettier-ignore
    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1,
    ];
  },

  zRotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    // prettier-ignore
    return [
      c, s, 0, 0, //
      -s, c, 0, 0, //
      0, 0, 1, 0, //
      0, 0, 0, 1,
    ];
  },

  scaling: function (sx, sy, sz) {
    // prettier-ignore
    return [
      sx, 0,  0,  0, //
      0, sy,  0,  0, //
      0,  0, sz,  0, //
      0,  0,  0,  1,
    ];
  },

  projection: function (width, height, depth) {
    // Note: This matrix flips the Y axis so 0 is at the top.
    // prettier-ignore
    return [
      2 / width, 0, 0, 0,
      0, -2 / height, 0, 0,
      0, 0, 2 / depth, 0,
      -1, 1, 0, 1,
    ];
  },

  multiply: function (a, b) {
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];
    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];

    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  },

  translate: function (m, tx, ty, tz) {
    return m4.multiply(m, m4.translation(tx, ty, tz));
  },

  xRotate: function (m, angleInRadians) {
    return m4.multiply(m, m4.xRotation(angleInRadians));
  },

  yRotate: function (m, angleInRadians) {
    return m4.multiply(m, m4.yRotation(angleInRadians));
  },

  zRotate: function (m, angleInRadians) {
    return m4.multiply(m, m4.zRotation(angleInRadians));
  },

  scale: function (m, sx, sy, sz) {
    return m4.multiply(m, m4.scaling(sx, sy, sz));
  },
};

const vertexShaderSource = `#version 300 es
 
// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer.
in vec2 a_texCoord;
in vec4 a_position;
uniform mat4 u_matrix;
out vec2 v_texCoord;
 
// all shaders have a main function
void main() {
  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = a_position * u_matrix;
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

export function renderRotation({
  canvasSel,
  textureImages,
  rotation,
}: {
  canvasSel: string;
  textureImages: TexImageSource[];
  rotation: Pt3;
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

  // Find the uniform variable (sort of a const) in the fragment shader.
  var imageLocation = gl.getUniformLocation(program, 'u_image');
  var matrixLocation = gl.getUniformLocation(program, 'u_matrix');

  var vao = setUpVertices(gl, program);
  setUpTexture(gl, program, textureImages);

  // Drawing starts here.

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Tell the shader to get the texture from texture unit 0
  gl.uniform1i(imageLocation, 0);

  // Compute the matrix
  // prettier-ignore
  var matrix = [
    1,  0,  0,  0,
    //
    0,  1,  0,  0,
    //
    0,  0,  1,  0,
    //
    0, 0, 0, 1,
  ];
  // matrix m4.projection(canvas.width, canvas.height, 400);
  // matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
  matrix = m4.xRotate(matrix, rotation.x);
  matrix = m4.yRotate(matrix, rotation.y);
  matrix = m4.zRotate(matrix, rotation.z);
  // matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

  // Set the matrix.
  gl.uniformMatrix4fv(matrixLocation, false, matrix);

  var primitiveType = gl.TRIANGLES;

  // Bind the attribute/buffer set we want.
  gl.bindVertexArray(vao);
  // Draw the two triangles defined in textureCoords.
  gl.drawArrays(primitiveType, 0, 6);
}

function setUpVertices(gl: WebGL2RenderingContext, program) {
  var positionAttributeLocation = gl.getAttribLocation(program, 'a_position');

  // Create a buffer
  var positionBuffer = gl.createBuffer();

  // Create a vertex array object (attribute state)
  var vao = gl.createVertexArray();

  // and make it the one we're currently working with
  gl.bindVertexArray(vao);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // Set Geometry.
  setRectangle3D(gl);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 3; // 3 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );
  return vao;
}

function setUpTexture(
  gl: WebGL2RenderingContext,
  program,
  textureImages: TexImageSource[]
) {
  // Mapping to the a_texCoord in the vertex shader.
  var texCoordAttributeLocation = gl.getAttribLocation(program, 'a_texCoord');
  var texCoordBuffer = gl.createBuffer();
  // Make a global.
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);

  // var positions: number[] = [0, 0, 0, 0.5, 0.5, 0];
  // Puts positions into positionBuffer.
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  // Set a rectangle the same size as the image.
  // var image = textureImages[0];
  setRectangle(gl); //, 0, 0, image.width, image.height);

  gl.enableVertexAttribArray(texCoordAttributeLocation);

  // The vertexAttribPointer call uses this to say how it should go through the
  // source array to feed the vertex shader script.
  const size = 2; // 2 components per iteration, e.g. use 0, 0, 0 then 0, 0.5, 0 then 0.7, 0, 0.

  // Go pair by pair through positionBuffer.
  const type = gl.FLOAT; // the data is 32bit floats
  const normalize = false; // don't normalize the data
  const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  const offset = 0; // start at the beginning of the buffer

  // Implicitly binds texCoordAttributeLocation to texCoordBuffer.
  gl.vertexAttribPointer(
    texCoordAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  // Now that the triangle positions are in, add the texture coordinates.
  var texture = gl.createTexture();
  // The code after this will affect TEXTURE0.
  gl.activeTexture(gl.TEXTURE0 + 0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Setting these things on texture 0. Not yet sure what they do.
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

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
  gl.generateMipmap(gl.TEXTURE_2D);
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

  // I think that in 2D textures, +y is down?
  gl.bufferData(
    gl.ARRAY_BUFFER,
    // prettier-ignore
    new Float32Array([
      // Triangle 1
      x1, y1,
      x1, y2,
      x2, y1,
      // Triangle 2
      x1, y2, 
      x2, y2,
      x2, y1, 
    ]),
    gl.STATIC_DRAW
  );
}

function setRectangle3D(gl) {
  const x1 = 0;
  const x2 = 1;
  const y1 = 1;
  const y2 = 0;
  // We're in 3D, where +y is up.
  // So things are rotated by pi in relation to the texture coords.
  gl.bufferData(
    gl.ARRAY_BUFFER,
    // prettier-ignore
    new Float32Array([
      // Triangle 1
      x2, y2, 0,
      x2, y1, 0,
      x1, y2, 0,
      // Triangle 2
      x2, y1, 0,
      x1, y1, 0,
      x1, y2, 0,
    ]),
    gl.STATIC_DRAW
  );
}
