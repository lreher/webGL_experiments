export const create2DTransformationMatrix = (translateX, translateY, rotationRad, scaleX, scaleY) => {
    // Start with an identity matrix
    let matrix = mat4.create();
  
    mat4.translate(matrix, matrix, [translateX, translateY, 0]);
    mat4.rotateZ(matrix, matrix, rotationRad);
    mat4.scale(matrix, matrix, [scaleX, scaleY, 1]);
  
    return matrix;
}
