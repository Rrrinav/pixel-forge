export const loadShader = async (path: string): Promise<string> => {
  const response = await fetch(path);
  return response.text();
};

export function compileShader(gl: WebGL2RenderingContext, shaderSource: string, shaderType: number): WebGLShader {
  const shader = gl.createShader(shaderType);
  if (!shader) throw new Error('Failed to create shader');

  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error('Shader compilation failed: ' + gl.getShaderInfoLog(shader));
  }

  return shader;
}

export function createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
  const program = gl.createProgram();
  if (!program) throw new Error('Failed to create program');

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error('Program linking failed: ' + gl.getProgramInfoLog(program));
  }

  return program;
}

export function createQuad(gl: WebGL2RenderingContext): WebGLBuffer {
  const vertices = new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    1, 1
  ]);

  const buffer = gl.createBuffer();
  if (!buffer) throw new Error('Failed to create buffer');

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  return buffer;
}


export async function loadTexture(gl: WebGL2RenderingContext, imagePath: string): Promise<WebGLTexture> {
  const image = new Image();
  image.src = imagePath;

  await new Promise(resolve => (image.onload = resolve));

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);

  return texture!;
}
