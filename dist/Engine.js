export function initEngine(importObject) {
    if (importObject.Engine == null) {
        importObject.Engine = {};
    }
    importObject.Engine.test = function(){
        return [0.5,0.5,0.0,   0.0, 0.0, 0.0, 1.0,1.0,
            0.5,-0.5,0.0,  0.0, 0.0, 0.0,  1.0,0.0,
            -0.5,-0.5,0.0, 0.0, 0.0, 0.0,   0.0,0.0,
            0.5,0.5,0.0,  0.0, 0.0, 0.0,  1.0,1.0,
            -0.5,-0.5,0.0, 0.0, 0.0, 0.0,   0.0,0.0,
            -0.5,0.5,0.0, 0.0, 0.0, 0.0,   0.0,1.0,]
    }
}