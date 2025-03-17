#version 300 es

precision highp float;

uniform sampler2D u_image;
uniform vec2 u_resolution;
uniform float u_strength;

in vec2 v_uv;
out vec4 outColor;

void main() {
  vec2 texelSize = 1.0 / u_resolution;
  float weight[5] = float[](0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216);

  vec3 result = texture(u_image, v_uv).rgb * weight[0];

  for (int i = 1; i < 5; i++) {
    result += texture(u_image, v_uv + vec2(texelSize.x * float(i) * u_strength, 0.0)).rgb * weight[i];
    result += texture(u_image, v_uv - vec2(texelSize.x * float(i) * u_strength, 0.0)).rgb * weight[i];
    result += texture(u_image, v_uv + vec2(0.0, texelSize.y * float(i) * u_strength)).rgb * weight[i];
    result += texture(u_image, v_uv - vec2(0.0, texelSize.y * float(i) * u_strength)).rgb * weight[i];
  }

  outColor = vec4(result / 2.0 , 1.0);
}

