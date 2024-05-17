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

import { getQuad } from './quad';
import { getQuad as getD } from './worzala';

export declare function test(): void;

export class Mesh{
    public gl: WebGLRenderingContext
    public data: StaticArray<f32>
    public shader: Shader
    public image_id: ImageData
    public image_ready: bool
    public texture: WebGLTexture
    public sampler: WebGLUniformLocation
    public projectionSampler: WebGLUniformLocation
    public cameraSampler: WebGLUniformLocation
    //public projection_matrix: StaticArray<f32>
    public buffer: WebGLBuffer
    public bufferReady: bool
    public position_al: GLint
    public normal_al: GLint
    public tex_coord_al: GLint
    constructor(gl: WebGLRenderingContext, shader: Shader){
        this.gl = gl
        this.data = getQuad()
        this.shader = shader
        this.image_id = gl.createImage('kaijunicorn.png');
        this.image_ready = false;
        this.texture = gl.createTexture();
        this.sampler = gl.getUniformLocation(shader.program, 'sampler');
        this.projectionSampler = gl.getUniformLocation(shader.program, 'projection');
        this.cameraSampler = gl.getUniformLocation(shader.program, 'camera');
        //this.projection_matrix = [1.3737387097273113,0.0,0.0,0.0,0.0,1.3737387097273113,0.0,0.0,0.0,0.0,-1.02020202020202,-1.0,0.0,0.0,-2.0202020202020203,0.0]
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        this.bufferReady = false
        this.position_al = gl.getAttribLocation(shader.program, 'position');
        gl.enableVertexAttribArray(this.position_al);
        this.normal_al = gl.getAttribLocation(shader.program, 'normal');
        gl.enableVertexAttribArray(this.normal_al);
        this.tex_coord_al = gl.getAttribLocation(shader.program, 'tex_coord');
        gl.enableVertexAttribArray(this.tex_coord_al);
    }
    render(projection_matrix: StaticArray<f32>, camera_matrix: StaticArray<f32>):void{
        let gl:WebGLRenderingContext = this.gl
        if (this.image_ready == false) {
            if (this.gl.imageReady(this.image_id) == false) {
              return;
            }
        
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, +true);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.image_id);
        
            gl.uniform1i(this.sampler, 0);
            this.image_ready = true;
        }

        gl.uniformMatrix4fv(this.projectionSampler, false, projection_matrix)
        gl.uniformMatrix4fv(this.cameraSampler, false, camera_matrix)

        if(!this.bufferReady){
            gl.bufferData<f32>(gl.ARRAY_BUFFER, this.data, gl.STATIC_DRAW);
            this.bufferReady=true
        }

        //vertexAttribPointer     attribute |  dimensions | data type | normalize | stride bytes | offset bytes
        gl.vertexAttribPointer(this.position_al, 3, gl.FLOAT, +false, 32, 0);
        gl.vertexAttribPointer(this.normal_al, 3, gl.FLOAT, +false, 32, 12);
        gl.vertexAttribPointer(this.tex_coord_al, 2, gl.FLOAT, +false, 32, 24);

        gl.drawArrays(gl.TRIANGLES, 0, this.data.length / 8);
    }
}

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