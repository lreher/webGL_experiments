export const fragmentShaderSource = `#version 300 es
    precision mediump float;
    out vec4 outColor;

    void main() {
        outColor = vec4(1.0, 1.0, 1.0, 1.0); // solid white
    }
`;