var gl;

// Camera
var myCamera;
var lastX;
var lastY;
var firstMouse = true;
var enableMouse = true;
var mouseDown = false;

// DeltaTime
var deltaTime = 0.0;    // Time between current frame and last frame
var lastFrame = 0.0;    // Time of last frame

// Lighting 
var lightPos = vec3.fromValues(10.0, 0.0, 0.0);
var lightPointPos = vec3.fromValues(10.0, 10.0, 15.0);

// Downsampling for Bokeh effect
var downsampleCoefficient = 2.0
var invViewDimensions_x;
var invViewDimensions_y;

// Framebuffers
var backBuffer;
var textureBackBuffer;
var sceneBuffer;
var textureSceneBuffer;
var backBufferHalf;
var textureBackBufferHalf;
var rhombiBlurBuffer;
var textureRhombiBlurBuffer;
var depthColorBuffer;
var textureDepthColorBuffer;
var depthHalfColorBuffer;
var textureDepthHalfColorBuffer;

// MRT render targets optimization
var MRTfbData;

// CoC
var CoC = 1.0;
var Angle = 0.0;
var aperture = 300.0; // 0.1
var focalplane = 9.75; // 5.0
focalplane = 3.95;
var focallength = 0.020;
var CoCScale;
var CoCBias;

var cocScaler = 1.0;

// Debug CoC
var DepthDebug = 1.0;

function initGL(canvas) 
{
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;

        invViewDimensions_x = (1.0/gl.viewportWidth)*1.0;
        invViewDimensions_y = (1.0/gl.viewportHeight)*1.0;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

function computeDeltaTime() {
    var currentFrame = new Date().getTime();
    deltaTime = (currentFrame - lastFrame)/100;
    lastFrame = currentFrame;
}


function tick() 
{
    requestAnimFrame(tick);
    //gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //drawScene(shaderProgramBasic);
    drawEffectPass();

    handleKeys();
    handleStatistics();
    computeDeltaTime();
}

function setupScene() {
    setupPlaneGeometry();
    setupTeapotGeometry();
    setupSphereGeometry();
    setupCubeGeometry();
    setupRingGeometry();
    setupTorusGeometry();
    setupCylinderGeometry();
    setupConeGeometry();
    setupRabbitGeometry();
    setupDragonGeometry();
    setupSuzanneGeometry();
    setupScreenFillingGeometry();
}

function webGLStart() 
{
    var canvas = document.getElementById("WebGLCanvas");
    initGL(canvas);
    createFramebuffers();
    setupMRT();

    initCamera();
    setupScene();
    setupShadersScene();
    initTextures();

    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    document.onmousemove = handleMouseMove;
    document.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    
    initStatistics();
    tick();
}