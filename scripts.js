// START FUNCTION
function init() {
  const cv1 = $id("canvas1");
  const cv2 = $id("canvas2");

  if (!cv1 || !cv2) {
    console.log("Failed to retrieved some <canvas> element");
  }

  //// CANVAS 1
  const ctx1 = cv1.getContext("2d");

  // draw a blue rentagle
  ctx1.fillStyle = "rgba(0, 0, 255, 1.0)"; // Set color to blue
  ctx1.fillRect(120, 10, 150, 150); // Fill the rectangle with the color
  //---------------------------------------------------

  //// CANVAS 2
  // Vertex Shader
  const VSHADER_SOURCE = [
    "void main() {",
    " gl_Position =  vec4(0.0, 0.0, 0.0, 1.0);",
    " gl_PointSize = 10.0;",
    "}",
  ].join("\n");
  // Fragment shader program
  const FSHADER_SOURCE = [
    "void main() {",
    " gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);",
    "}",
  ].join("\n");

  const gl2 = getWebglContext(cv2);
  if (!gl2) {
    console.log("Failed to get the rendering context fo WebGL");
    return;
  }

  // Initialize shaders
  if (!initShaders(gl2, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to initialize shaders.");
    return;
  }
  // Set the color for clearing <canvas>
  gl2.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear <canvas>
  gl2.clear(gl2.COLOR_BUFFER_BIT);
  // Draw a point
  gl2.drawArrays(gl2.POINTS, 0, 1);
  //---------------------------------------------------
}

// HELPERS

// jQuery local
const $id = (el) => document.getElementById(el);

// Get WebGL Context
function getWebglContext(canvas) {
  var context;
  context = canvas.getContext("webgl");
  if (!context) {
    console.log("No WebGL context could be found.");
  }
  return context;
}

// Initialize SHADERS
function initShaders(gl, vshaderSource, fshaderSource) {
  // Create shader object
  var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshaderSource);
  var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshaderSource);
  if (!vertexShader || !fragmentShader) {
    return false;
  }

  // Create a program object
  var program = gl.createProgram();
  if (!program) {
    return false;
  }

  // Attach the shader objects
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // Link the program
  gl.linkProgram(program);

  // Check the result of linking
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    var error = gl.getProgramInfoLog(program);
    console.log("Failed to link program: " + error);
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return false;
  }

  gl.useProgram(program);
  gl.program = program;

  return true;
}

function loadShader(gl, type, source) {
  // Create shader object
  var shader = gl.createShader(type);
  if (shader == null) {
    console.log("Unable to create shader");
    return null;
  }

  // Set the shader source code
  gl.shaderSource(shader, source);

  // Compile the shader
  gl.compileShader(shader);

  // Check the compilation result
  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    var error = gl.getShaderInfoLog(shader);
    console.log("Failed to compile shader: " + error);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
