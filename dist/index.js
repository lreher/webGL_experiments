(() => {
  // game/shaders/fragment/basic.js
  var fragmentShaderSource = `#version 300 es
    precision mediump float;

    // WebGL2 requires using out instead of gl_FragColor
    out vec4 outColor;

    void main() {
        outColor = vec4(1.0, 1.0, 1.0, 1.0); // solid white
    }
`;

  // game/shaders/vertex/basic.js
  var vertexShaderSource = `#version 300 es
    attribute vec2 a_position;

    // Per-vertex data
    layout(location = 0) in vec2 a_position;

    // Per-instance data
    layout(location = 1) in vec2 a_offset;

    void main() {
        vec2 pos = a_position + a_offset;
        
        gl_Position = vec4(pos, 0.0, 1.0);
    }
`;

  // game/utils/compileShader.js
  var compileShader = (gl2, source, type) => {
    const shader = gl2.createShader(type);
    gl2.shaderSource(shader, source);
    gl2.compileShader(shader);
    const success = gl2.getShaderParameter(shader, gl2.COMPILE_STATUS);
    if (!success) {
      const infoLog = gl2.getShaderInfoLog(shader);
      gl2.deleteShader(shader);
      throw new Error(`Could not compile shader:
${infoLog}`);
    }
    return shader;
  };

  // game/utils/create2DTransform.js
  var create2DTransformationMatrix = (translateX, translateY, rotationRad, scaleX, scaleY) => {
    let matrix = mat4.create();
    mat4.translate(matrix, matrix, [translateX, translateY, 0]);
    mat4.rotateZ(matrix, matrix, rotationRad);
    mat4.scale(matrix, matrix, [scaleX, scaleY, 1]);
    return matrix;
  };

  // game/utils/createProgram.js
  var createProgram = (gl2, vertexShader, fragmentShader) => {
    const program = gl2.createProgram();
    gl2.attachShader(program, vertexShader);
    gl2.attachShader(program, fragmentShader);
    gl2.linkProgram(program);
    const success = gl2.getProgramParameter(program, gl2.LINK_STATUS);
    if (!success) {
      const infoLog = gl2.getProgramInfoLog(program);
      gl2.deleteProgram(program);
      throw new Error(`Could not link program:
${infoLog}`);
    }
    return program;
  };

  // game/vertices/square.js
  var vertices = new Float32Array([
    // Triangle 1
    -0.5,
    -0.5,
    0.5,
    -0.5,
    -0.5,
    0.5,
    // Triangle 2
    -0.5,
    0.5,
    0.5,
    -0.5,
    0.5,
    0.5
  ]);

  // game/index.js
  var canvas = document.getElementById("gameCanvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    alert("WebGL not supported");
  }
  var shaderProgram;
  var setup = () => {
    const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    const _shaderProgram = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(_shaderProgram);
    shaderProgram = _shaderProgram;
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const aPositionLocation = gl.getAttribLocation(shaderProgram, "a_position");
    gl.enableVertexAttribArray(aPositionLocation);
    gl.vertexAttribPointer(
      aPositionLocation,
      2,
      // size = 2 floats per vertex
      gl.FLOAT,
      // type = float
      false,
      // normalize = false
      0,
      // stride = 0 (tightly packed)
      0
      // offset = 0
    );
  };
  var i = 0;
  var render = () => {
    i += 0.01;
    const uMatrixLocation = gl.getUniformLocation(shaderProgram, "u_matrix");
    let translateX = 0;
    let translateY = 0;
    let rotation = Math.PI / i;
    let scaleX = 1;
    let scaleY = 1;
    const transformMatrix = create2DTransformationMatrix(
      translateX,
      translateY,
      rotation,
      scaleX,
      scaleY
    );
    gl.uniformMatrix4fv(uMatrixLocation, false, transformMatrix);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.2, 0.3, 0.3, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  };
  setup();
  requestAnimationFrame(render);
})();
