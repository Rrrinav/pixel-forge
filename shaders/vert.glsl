#version 300 es
precision highp float;

in vec2 position;

out vec2 v_uv;

void main() {
  v_uv = (position + 1.0) * 0.5; // Convert from clip space (-1 to 1) to UV space (0 to 1)
  gl_Position = vec4(position, 0.0, 1.0);
}

