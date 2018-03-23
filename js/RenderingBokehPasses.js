// TODO CLEANUP CODE
function renderSceneWithCoCPass(enableDebugCoC) {
    //gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(shaderProgramScenePass);

    shaderProgramScenePass.vertexPositionAttribute = gl.getAttribLocation(shaderProgramScenePass, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgramScenePass.vertexPositionAttribute);

    shaderProgramScenePass.textureCoordAttribute = gl.getAttribLocation(shaderProgramScenePass, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgramScenePass.textureCoordAttribute);

    shaderProgramScenePass.samplerSceneColorUniform = gl.getUniformLocation(shaderProgramScenePass, "uSamplerColor");
    shaderProgramScenePass.samplerSceneDepthUniform = gl.getUniformLocation(shaderProgramScenePass, "uSamplerDepth")

    shaderProgramScenePass.cocUniform = gl.getUniformLocation(shaderProgramScenePass, "uCoc");

    shaderProgramScenePass.cocScaleUniform = gl.getUniformLocation(shaderProgramScenePass, "uCoCScale");
    shaderProgramScenePass.cocBiasUniform = gl.getUniformLocation(shaderProgramScenePass, "uCoCBias");

    shaderProgramScenePass.apertureUniform = gl.getUniformLocation(shaderProgramScenePass, "uAperture");
    shaderProgramScenePass.focalplaneUniform = gl.getUniformLocation(shaderProgramScenePass, "uFocallength");
    shaderProgramScenePass.focallengthUniform = gl.getUniformLocation(shaderProgramScenePass, "uFocalplane");
    shaderProgramScenePass.znearUniform = gl.getUniformLocation(shaderProgramScenePass, "uZNear");
    shaderProgramScenePass.zfarUniform = gl.getUniformLocation(shaderProgramScenePass, "uZFar");

    shaderProgramScenePass.uDebugCoCUniform = gl.getUniformLocation(shaderProgramScenePass, "uDebugCoC");

    shaderProgramScenePass.uDepthDebugUniform = gl.getUniformLocation(shaderProgramScenePass, "uDebugDepth");

    shaderProgramScenePass.COCScalerUniform = gl.getUniformLocation(shaderProgramScenePass, "uCoCScaler");

    gl.bindBuffer(gl.ARRAY_BUFFER, screenFillingVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgramScenePass.vertexPositionAttribute, screenFillingVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, screenFillingTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgramScenePass.textureCoordAttribute, screenFillingTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    var zfar = myCamera.GetFarValue();
    var znear = myCamera.GetNearValue(); 
    
    CoCScale = (aperture * focallength * focalplane * (zfar -znear)) / ((focalplane - focallength) * znear * zfar);
    CoCBias = (aperture * focallength * (znear - focalplane)) / ((focalplane - focallength) * znear);

    gl.uniform1f(shaderProgramScenePass.cocScaleUniform, CoCScale);

    gl.uniform1f(shaderProgramScenePass.cocBiasUniform, CoCBias);

    gl.uniform1f(shaderProgramScenePass.cocUniform, CoC);
    gl.uniform1f(shaderProgramScenePass.apertureUniform, aperture);
    gl.uniform1f(shaderProgramScenePass.focalplaneUniform, focalplane);
    gl.uniform1f(shaderProgramScenePass.focallengthUniform, focallength);
    gl.uniform1f(shaderProgramScenePass.znearUniform, myCamera.GetNearValue());
    gl.uniform1f(shaderProgramScenePass.zfarUniform, myCamera.GetFarValue());

    gl.uniform1i(shaderProgramScenePass.uDebugCoCUniform, enableDebugCoC);

    gl.uniform1f(shaderProgramScenePass.uDepthDebugUniform, DepthDebug);


    gl.uniform1f(shaderProgramScenePass.COCScalerUniform, cocScaler);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureSceneBuffer);
    gl.uniform1i(shaderProgramScenePass.samplerSceneColorUniform, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textureDepthColorBuffer);
    gl.uniform1i(shaderProgramScenePass.samplerSceneDepthUniform, 1);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, screenFillingIndexBuffer);
    gl.drawElements(gl.TRIANGLES, screenFillingIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

// TODO CLEANUP
function renderDownsamplePass(enableDebugCoC) {
    gl.viewport(0, 0, gl.viewportWidth/downsampleCoefficient, gl.viewportHeight/downsampleCoefficient);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(shaderProgramDownsamplePass);

    shaderProgramDownsamplePass.vertexPositionAttribute = gl.getAttribLocation(shaderProgramDownsamplePass, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgramDownsamplePass.vertexPositionAttribute);

    shaderProgramDownsamplePass.textureCoordAttribute = gl.getAttribLocation(shaderProgramDownsamplePass, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgramDownsamplePass.textureCoordAttribute);

    shaderProgramDownsamplePass.samplerUniform = gl.getUniformLocation(shaderProgramDownsamplePass, "uSampler");

    shaderProgramDownsamplePass.invViewCoordinatesUniform = gl.getUniformLocation(shaderProgramDownsamplePass, "uInvViewDimensions");

    shaderProgramDownsamplePass.uDebugCoCUniform = gl.getUniformLocation(shaderProgramDownsamplePass, "uDebugCoC");

    shaderProgramDownsamplePass.COCScalerUniform = gl.getUniformLocation(shaderProgramDownsamplePass, "uCoCScaler");

    gl.bindBuffer(gl.ARRAY_BUFFER, screenFillingVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgramDownsamplePass.vertexPositionAttribute, screenFillingVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, screenFillingTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgramDownsamplePass.textureCoordAttribute, screenFillingTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Sampling from full size scene texture so stepsize needs to be on full resolution
    var invViewDimensionsDownsampleFixed_x = 1.0 / (gl.viewportWidth);
    var invViewDimensionsDownsampleFixed_y = 1.0 / (gl.viewportHeight);

    gl.uniform2f(shaderProgramDownsamplePass.invViewCoordinatesUniform, invViewDimensionsDownsampleFixed_x, invViewDimensionsDownsampleFixed_y);

    gl.uniform1i(shaderProgramDownsamplePass.uDebugCoCUniform, enableDebugCoC);

    gl.uniform1f(shaderProgramDownsamplePass.COCScalerUniform, cocScaler);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureBackBuffer);
    gl.uniform1i(shaderProgramDownsamplePass.samplerUniform, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, screenFillingIndexBuffer);
    gl.drawElements(gl.TRIANGLES, screenFillingIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

// TODO CLEANUP
function drawVerticalAndDiagonalBlurPass(debugCoC) {

    gl.bindFramebuffer(gl.FRAMEBUFFER, MRTfbData.f);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(shaderProgramVerAndDiagBlurPass);

    shaderProgramVerAndDiagBlurPass.vertexPositionAtribute = gl.getAttribLocation(shaderProgramVerAndDiagBlurPass, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgramVerAndDiagBlurPass.vertexPositionPass);

    shaderProgramVerAndDiagBlurPass.textureCoordAttribute = gl.getAttribLocation(shaderProgramVerAndDiagBlurPass, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgramVerAndDiagBlurPass.textureCoordAttribute);

    shaderProgramVerAndDiagBlurPass.samplerUniform = gl.getUniformLocation(shaderProgramVerAndDiagBlurPass, "uSampler");
    shaderProgramVerAndDiagBlurPass.samplerUniformDepth = gl.getUniformLocation(shaderProgramVerAndDiagBlurPass, "uSamplerDepth");

    shaderProgramVerAndDiagBlurPass.invViewCoordinatesUniform = gl.getUniformLocation(shaderProgramVerAndDiagBlurPass, "uInvViewDimensions");

    shaderProgramVerAndDiagBlurPass.angleUniform = gl.getUniformLocation(shaderProgramVerAndDiagBlurPass, "uAngle");

    shaderProgramVerAndDiagBlurPass.focalPlaneUniform = gl.getUniformLocation(shaderProgramVerAndDiagBlurPass, "uFocalPlane");

    shaderProgramVerAndDiagBlurPass.debugCoCAfterPass = gl.getUniformLocation(shaderProgramVerAndDiagBlurPass, "uDebugCoC");

    shaderProgramVerAndDiagBlurPass.cocScalerUniform = gl.getUniformLocation(shaderProgramVerAndDiagBlurPass, "uCoCScaler");

    gl.bindBuffer(gl.ARRAY_BUFFER, screenFillingVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgramVerAndDiagBlurPass.vertexPositionAttribute, screenFillingVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, screenFillingTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgramVerAndDiagBlurPass.textureCoordAttribute, screenFillingTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    var _downsampleCoefficient = 2.0;

    var invViewDimensionsDownsampleFixed_x = 1.0 / (gl.viewportWidth / _downsampleCoefficient);
    var invViewDimensionsDownsampleFixed_y = 1.0 / (gl.viewportHeight / _downsampleCoefficient);

    gl.uniform2f(shaderProgramVerAndDiagBlurPass.invViewCoordinatesUniform, invViewDimensionsDownsampleFixed_x, invViewDimensionsDownsampleFixed_y);
    gl.uniform1f(shaderProgramVerAndDiagBlurPass.angleUniform, Angle);

    gl.uniform1f(shaderProgramVerAndDiagBlurPass.focalPlaneUniform, focalplane);

    gl.uniform1f(shaderProgramVerAndDiagBlurPass.debugCoCAfterPass, debugCoC);

    gl.uniform1f(shaderProgramVerAndDiagBlurPass.cocScalerUniform, cocScaler);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureBackBufferHalf);
    //gl.bindTexture(gl.TEXTURE_2D, textureBackBuffer);
    gl.uniform1i(shaderProgramVerAndDiagBlurPass.samplerUniform, 0);

    gl.activeTexture(gl.TEXTURE1);
    //gl.bindTexture(gl.TEXTURE_2D, textureDepthHalfColorBuffer);
    gl.bindTexture(gl.TEXTURE_2D, textureDepthColorBuffer);
    gl.uniform1i(shaderProgramVerAndDiagBlurPass.samplerUniformDepth, 1);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, screenFillingIndexBuffer);
    gl.drawElements(gl.TRIANGLES, screenFillingIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function drawRhombiBlurPassOptimized() {
    gl.viewport(0, 0, gl.viewportWidth/downsampleCoefficient, gl.viewportHeight/downsampleCoefficient);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(shaderProgramRhombiBlurPass);

    shaderProgramRhombiBlurPass.vertexPositionAttribute = gl.getAttribLocation(shaderProgramRhombiBlurPass, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgramRhombiBlurPass.vertexPositionAttribute);

    shaderProgramRhombiBlurPass.textureCoordAttribute = gl.getAttribLocation(shaderProgramRhombiBlurPass, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgramRhombiBlurPass.textureCoordAttribute);

    shaderProgramRhombiBlurPass.samplerVerticalBlurUniform = gl.getUniformLocation(shaderProgramRhombiBlurPass, "uVerticalBlurTexture");
    shaderProgramRhombiBlurPass.samplerDiagonalBlurUniform = gl.getUniformLocation(shaderProgramRhombiBlurPass, "uDiagonalBlurTexture");
    shaderProgramRhombiBlurPass.invViewCoordinatesUniform = gl.getUniformLocation(shaderProgramRhombiBlurPass, "uInvViewDimensions");
    shaderProgramRhombiBlurPass.angleUniform = gl.getUniformLocation(shaderProgramRhombiBlurPass, "uAngle");

    gl.bindBuffer(gl.ARRAY_BUFFER, screenFillingVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgramRhombiBlurPass.vertexPositionAttribute, screenFillingVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, screenFillingTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgramRhombiBlurPass.textureCoordAttribute, screenFillingTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    //var invViewDimensions_x = 1.0 / 789.0;
    //var invViewDimensions_y = 1.0 / 643.0;

    var invViewDimensionsDownsampleFixed_x = 1.0 / (gl.viewportWidth / 2.0);
    var invViewDimensionsDownsampleFixed_y = 1.0 / (gl.viewportHeight / 2.0);

    gl.uniform2f(shaderProgramRhombiBlurPass.invViewCoordinatesUniform, invViewDimensionsDownsampleFixed_x, invViewDimensionsDownsampleFixed_y);
    gl.uniform1f(shaderProgramRhombiBlurPass.angleUniform, Angle);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, MRTfbData.t[0]);
    gl.uniform1i(shaderProgramRhombiBlurPass.samplerVerticalBlurUniform, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, MRTfbData.t[1]);
    gl.uniform1i(shaderProgramRhombiBlurPass.samplerDiagonalBlurUniform, 1);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, screenFillingIndexBuffer);
    gl.drawElements(gl.TRIANGLES, screenFillingIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}
