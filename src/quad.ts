let quad_data: StaticArray<f32> = [
  //  x     y     u     v
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
];

export function getQuad():StaticArray<f32>{
  return quad_data
}