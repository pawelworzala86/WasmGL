import {
    WebGLRenderingContext,
    WebGLShader,
    ImageData,
    WebGLUniformLocation,
    WebGLBuffer,
    GLint,
    WebGLProgram,
    WebGLTexture,
  } from './WebGL';

const VERTEX_SHADER_CODE: string = `#version 300 es
precision highp float;

in vec3 position;
in vec3 normal;
in vec2 tex_coord;

mat4 model = mat4(1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0);

uniform mat4 projection;
uniform mat4 camera;

out vec2 tc;

void main() {
  gl_Position = projection*camera*model*vec4(position,1.0);
  tc = tex_coord;
}
`;
// THIS IS THE FRAGMENT SHADER
const FRAGMENT_SHADER_CODE: string = `#version 300 es
precision highp float;

in vec2 tc;

uniform sampler2D sampler;

out vec4 color;

void main() {
  color = texture( sampler, tc );
}
`;

export class Shader{
    public gl: WebGLRenderingContext
    public vertex_shader: WebGLShader
    public fragment_shader: WebGLShader
    public program: WebGLProgram
    constructor(gl: WebGLRenderingContext){
        this.gl = gl

        this.vertex_shader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(this.vertex_shader, VERTEX_SHADER_CODE);
        gl.compileShader(this.vertex_shader);

        this.fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(this.fragment_shader, FRAGMENT_SHADER_CODE);
        gl.compileShader(this.fragment_shader);

        this.program = gl.createProgram();

        gl.attachShader(this.program, this.vertex_shader);
        gl.attachShader(this.program, this.fragment_shader);

        gl.linkProgram(this.program);

        gl.useProgram(this.program);
    }
}