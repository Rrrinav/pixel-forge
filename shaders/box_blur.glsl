#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform sampler2D u_image;
uniform float u_strength;
// ^ Blur strength

void main() {
  vec4 blur = vec4(0.0);

  for (float x = -2.0; x <= 2.0; x++) {
    for (float y = -2.0; y <= 2.0; y++) {
      vec2 uv = v_uv + vec2(x, y) * u_strength;
      blur += texture(u_image, uv);
    }
  }

  blur /= 25.0;
  fragColor = blur;
}
