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

import { Shader } from './Shader'
import { Mesh } from './Engine';


var gl: WebGLRenderingContext = new WebGLRenderingContext('cnvs', 'webgl2');




let shader = new Shader(gl)

gl.useProgram(shader.program)



gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);


let mesh:Mesh = new Mesh(gl, shader);






let projection_matrix: StaticArray<f32> = [1.3737387097273113,0.0,0.0,0.0,0.0,1.3737387097273113,0.0,0.0,0.0,0.0,-1.02020202020202,-1.0,0.0,0.0,-2.0202020202020203,0.0]
let camera_matrix: StaticArray<f32> = [1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,-10.100090086,1.0]





export function displayLoop(): void {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

 
  mesh.render(projection_matrix, camera_matrix)
}
