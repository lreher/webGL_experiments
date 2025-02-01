export const vertexShaderSource = `#version 300 es
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
