/**
 * @author Rick Battagline / https://embed.com
 */

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

import { test as testA } from './Engine';

//testA()

const VERTEX_SHADER_CODE: string = `#version 300 es
  precision highp float;

  in vec3 position;
  in vec2 tex_coord;

mat4 camera = mat4(1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,-1.100090086,1.0);
mat4 model = mat4(1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0);

  uniform mat4 projection;

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

// initialize webgl
var gl: WebGLRenderingContext = new WebGLRenderingContext('cnvs', 'webgl2');

//  ImageData, createImage, imageReady,
var image_id: ImageData = gl.createImage('kaijunicorn.png');
var image_ready: bool = false;

let vertex_shader: WebGLShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertex_shader, VERTEX_SHADER_CODE);
gl.compileShader(vertex_shader);

let fragment_shader: WebGLShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragment_shader, FRAGMENT_SHADER_CODE);
gl.compileShader(fragment_shader);

let program: WebGLProgram = gl.createProgram();

gl.attachShader(program, vertex_shader);
gl.attachShader(program, fragment_shader);

gl.linkProgram(program);

gl.useProgram(program);

let buffer: WebGLBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

let position_al: GLint = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(position_al);

let tex_coord_al: GLint = gl.getAttribLocation(program, 'tex_coord');
gl.enableVertexAttribArray(tex_coord_al);

gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

let quad_data: StaticArray<f32> = getQuad()

let texture: WebGLTexture = gl.createTexture();
let sampler: WebGLUniformLocation = gl.getUniformLocation(program, 'sampler');
let projectionSampler: WebGLUniformLocation = gl.getUniformLocation(program, 'projection');

var projection_matrix: StaticArray<f32> = [1.3737387097273113,0.0,0.0,0.0,0.0,1.3737387097273113,0.0,0.0,0.0,0.0,-1.02020202020202,-1.0,0.0,0.0,-2.0202020202020203,0.0]

export function displayLoop(): void {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  if (image_ready == false) {
    if (gl.imageReady(image_id) == false) {
      return;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, +true);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image_id);

    gl.uniform1i(sampler, 0);
    image_ready = true;
  }


  
  gl.uniformMatrix4fv(projectionSampler, false, projection_matrix)


  gl.bufferData<f32>(gl.ARRAY_BUFFER, quad_data, gl.STATIC_DRAW);

  //vertexAttribPointer     attribute |  dimensions | data type | normalize | stride bytes | offset bytes
  gl.vertexAttribPointer(position_al, 3, gl.FLOAT, +false, 20, 0);
  gl.vertexAttribPointer(tex_coord_al, 2, gl.FLOAT, +false, 20, 12);

  gl.drawArrays(gl.TRIANGLES, 0, quad_data.length / 5);
}
