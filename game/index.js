import { fragmentShaderSource } from "./shaders/fragment/basic";
import { vertexShaderSource } from "./shaders/vertex/basic";
import { compileShader } from "./utils/compileShader";
import { create2DTransformationMatrix } from "./utils/create2DTransform";
import { createProgram } from "./utils/createProgram";
import { vertices } from "./vertices/square";

const canvas = document.getElementById("gameCanvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  alert("WebGL not supported");
}

let shaderProgram;

const setup = () => {
    // Set up shaders & program
    const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    const _shaderProgram = createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(_shaderProgram);
    shaderProgram = _shaderProgram;

    // Create vertex buffer
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Get & activate attribute location
    const aPositionLocation = gl.getAttribLocation(shaderProgram, "a_position");
    gl.enableVertexAttribArray(aPositionLocation);

    // Point attribute to our buffer data
    gl.vertexAttribPointer(
      aPositionLocation,
      2,           // size = 2 floats per vertex
      gl.FLOAT,    // type = float
      false,       // normalize = false
      0,           // stride = 0 (tightly packed)
      0            // offset = 0
    );
}

let i = 0;
const render = () => {
  i += 0.01;

  // Apply transforms
  const uMatrixLocation = gl.getUniformLocation(shaderProgram, "u_matrix");

  // Let's define some parameters for our transform
  let translateX = 0;
  let translateY = 0;
  let rotation = Math.PI / i; // 45 degrees
  let scaleX = 1.0;
  let scaleY = 1.0;

  // Build the matrix
  const transformMatrix = create2DTransformationMatrix(
    translateX,
    translateY,
    rotation,
    scaleX,
    scaleY
  );

  // Send it to the GPU
  gl.uniformMatrix4fv(uMatrixLocation, false, transformMatrix);

  // Clear screen
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.2, 0.3, 0.3, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw triangle
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  requestAnimationFrame(render)
}

setup();
requestAnimationFrame(render)