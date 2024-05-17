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

export declare function test(): void;

export class Mesh{
    public gl: WebGLRenderingContext
    public data: StaticArray<f32>
    public program: WebGLProgram
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
    public tex_coord_al: GLint
    constructor(gl: WebGLRenderingContext, program: WebGLProgram){
        this.gl = gl
        this.data = getQuad()
        this.program = program
        this.image_id = gl.createImage('kaijunicorn.png');
        this.image_ready = false;
        this.texture = gl.createTexture();
        this.sampler = gl.getUniformLocation(program, 'sampler');
        this.projectionSampler = gl.getUniformLocation(program, 'projection');
        this.cameraSampler = gl.getUniformLocation(program, 'camera');
        //this.projection_matrix = [1.3737387097273113,0.0,0.0,0.0,0.0,1.3737387097273113,0.0,0.0,0.0,0.0,-1.02020202020202,-1.0,0.0,0.0,-2.0202020202020203,0.0]
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        this.bufferReady = false
        this.position_al = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(this.position_al);
        this.tex_coord_al = gl.getAttribLocation(program, 'tex_coord');
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
        gl.vertexAttribPointer(this.position_al, 3, gl.FLOAT, +false, 20, 0);
        gl.vertexAttribPointer(this.tex_coord_al, 2, gl.FLOAT, +false, 20, 12);

        gl.drawArrays(gl.TRIANGLES, 0, this.data.length / 5);
    }
}
