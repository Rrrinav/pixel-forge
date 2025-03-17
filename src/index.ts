import { loadShader, compileShader, createProgram, createQuad, loadTexture } from './glUtils.js';

async function main() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const gl = canvas.getContext('webgl2');

  if (!gl) {
    console.error('WebGL2 not supported');
    return;
  }

  canvas.width = 500;
  canvas.height = 500;
  gl.viewport(0, 0, canvas.width, canvas.height);

  gl.clearColor(0.1, 0.1, 0.1, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Flip image vertically
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Load shaders
  const vertexShaderSrc = await loadShader('../shaders/vert.glsl');
  const fragmentShaderSrc = await loadShader('../shaders/guass_blur.glsl');

  const vertexShader = compileShader(gl, vertexShaderSrc, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(gl, fragmentShaderSrc, gl.FRAGMENT_SHADER);

  const program = createProgram(gl, vertexShader, fragmentShader);

  // Load texture
  const texture = await loadTexture(gl, '../assets/images.jpeg');

  // Get attribute and uniform locations
  const positionAttribute = gl.getAttribLocation(program, 'position');
  const resolutionUniform = gl.getUniformLocation(program, 'u_resolution');
  const imageUniform = gl.getUniformLocation(program, 'u_image');
  const strengthUniform = gl.getUniformLocation(program, 'u_strength'); // New uniform

  // Create quad
  const quad = createQuad(gl);

  // Use program
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);

  // Enable vertex attribute
  gl.enableVertexAttribArray(positionAttribute);
  gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);

  // Set uniforms
  gl.uniform2f(resolutionUniform, canvas.width, canvas.height);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(imageUniform, 0);

  let strength = 1000.0 / 500.0; // Default blur strength

  const update = () => {
    gl.uniform1f(strengthUniform, strength); // Pass strength to shader
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  // Update blur strength dynamically with arrow keys
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') strength += 0.001;
    if (e.key === 'ArrowDown') strength -= 0.001;
    strength = Math.max(0.0, strength);
    update();
  });

  update(); // Initial draw
}

main();

