/*let quad_data: StaticArray<f32> = [
  //  px     py     u     v
  -0.15,
  -0.2,
  0.0,
  0.0,
  -0.15,
  0.2,
  0.0,
  0.99,
  0.15,
  -0.2,
  0.95,
  0.0,
  0.15,
  0.2,
  0.95,
  0.99,
];*/

let quad_data: StaticArray<f32> = [


  /*-0.5,0.5,0.0,
   -0.5,-0.5,0.0,
   0.5,-0.5,0.0,
   0.5,0.5,0.0*/

   //[3,2,1,3,1,0]


  0.5,0.5,0.0,   1.0,1.0,
  0.5,-0.5,0.0,   1.0,0.0,
  -0.5,-0.5,0.0,   0.0,0.0,
  0.5,0.5,0.0,   1.0,1.0,
  -0.5,-0.5,0.0,   0.0,0.0,
  -0.5,0.5,0.0,   0.0,1.0,
];

export function getQuad():StaticArray<f32>{
  return quad_data
}