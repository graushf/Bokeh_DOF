var mMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();
var vMatrix = mat4.create();

function drawEffectPass() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, sceneBuffer);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

    drawScene(shaderProgramPhongLightingPass);

    gl.bindFramebuffer(gl.FRAMEBUFFER, depthColorBuffer);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

    drawScene(shaderProgramDepthPass);

    gl.bindFramebuffer(gl.FRAMEBUFFER, backBuffer);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

    //renderScrFillTexture(textureSceneBuffer);
    renderScenePass();

    gl.bindFramebuffer(gl.FRAMEBUFFER, backBufferHalf);
    gl.viewport(0, 0, gl.viewportWidth/downsampleCoefficient, gl.viewportHeight/downsampleCoefficient);
    renderDownsamplePass();

    gl.bindFramebuffer(gl.FRAMEBUFFER, MRTfbData.f);

    var bufferList = [
        ext3.COLOR_ATTACHMENT0_WEBGL,
        ext3.COLOR_ATTACHMENT1_WEBGL
    ];
    ext3.drawBuffersWEBGL(bufferList);

    drawVerticalAndDiagonalBlurPass();

    gl.bindFramebuffer(gl.FRAMEBUFFER, rhombiBlurBuffer);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

    drawRhombiBlurPassOptimized();

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    //drawScreenTexture();
    //drawScreenFillingGeometry(shaderProgramScrFillTexturePass);
    renderScrFillTexture(textureRhombiBlurBuffer);
}

function drawScene(programToDraw)
{
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if (programToDraw == shaderProgramPhongLightingPass) {
        drawScreenFillingGeometry(shaderProgramBackgroundPass);
    } else if (programToDraw == shaderProgramDepthPass) {
        drawScreenFillingGeometry(shaderProgramDepthPassBackground);
    }
    
    drawSceneObjects(programToDraw);
    drawHexProducingSpheres(programToDraw);
    drawHexProducingSpheres2(programToDraw);
}

function drawSceneObjects(programToDraw) {
    drawPlane(programToDraw);
    drawTeapot(programToDraw, vec3.fromValues(0.0, 0.0, -10.0), vec3.fromValues(0.1, 0.1, 0.1));
    drawTeapot(programToDraw, vec3.fromValues(1.0, 0.0, -20.0), vec3.fromValues(0.1, 0.1, 0.1));
    drawTeapot(programToDraw, vec3.fromValues(-1.0, 0.0, -30.0), vec3.fromValues(0.1, 0.1, 0.1));
    drawTeapot(programToDraw, vec3.fromValues(-0.5, 0.0, -50.0), vec3.fromValues(0.1, 0.1, 0.1));
    drawTeapot(programToDraw, vec3.fromValues(2.0, 0.0, -70.0), vec3.fromValues(0.1, 0.1, 0.1));
    drawTeapot(programToDraw, vec3.fromValues(4.2, 0.0, -100.0), vec3.fromValues(0.1, 0.1, 0.1));
    drawTeapot(programToDraw, vec3.fromValues(0.0, 0.0, -150.0), vec3.fromValues(0.1, 0.1, 0.1));
    drawTeapot(programToDraw, vec3.fromValues(-3.0, 0.0, -200.0), vec3.fromValues(0.1, 0.1, 0.1));
    drawCube(programToDraw, vec3.fromValues(10.0, 0.5, -40.0), vec4.fromValues(1.5, 1.5, 1.5));
    drawCube(programToDraw, vec3.fromValues(-5.0, 0.5, -25.0), vec4.fromValues(1.5, 1.5, 1.5));
    drawCube(programToDraw, vec3.fromValues(9.0, 0.5, -80.0), vec4.fromValues(-1.5, 3.5, 1.5));
}

function drawHexProducingSpheres(programToDraw) {
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(0.0, 2.5, -10.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(120 *181/255, 10 * 134/255, 10 * 144/255));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(4.0, 1.7, -10.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(10 * 214/255, 10 * 211/255, 10 * 218/255));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(-4.0, 1.0, -10.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(10 * 242/255, 10 * 240/255, 10 * 241/255));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(-4.3, 0.7, -10.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(10 * 57/255, 10 * 93/255, 10 * 109/255));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(-3.4, 1.8, -8.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(10 * 62/255, 10 * 101/255, 10 * 54/255));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(0.7, 0.4, -8.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(10 * 197/255, 10 * 197/255, 10 * 197/255));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(-3.0, 2.0, -15.0), vec3.fromValues(0.40, 0.40, 0.40), vec3.fromValues(10 * 142/255, 10 * 90/255, 10 * 92/255));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(6.0, 2.5, -20.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(10 * 83/255, 10 * 79/255, 10 * 114/255));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(-5.0, 7.5, -25.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(10 * 132/255, 10 * 86/255, 10 * 133/255));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(-10.0, 5.5, -30.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(7.5 * 200/255, 2 * 80/255, 3 * 170/255));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(4.0, 6.8, -25.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(10 * 40/255, 10 * 89/255, 10 * 225/255));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(10.0, 6.5, -30.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(4.0 * 130/255, 10.0 * 220/255, 10.0 * 170/255));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(10.0, 3.5, -20.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(10.0 * 210/255, 10.0 * 175/255, 10.0 * 57/255));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(6.0, 2.5, -40.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(10.0 * 195/255, 10.0 * 68/255, 10.0 * 110/255));
}

function drawHexProducingSpheres2(programToDraw) {
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(2.6, 1.69, -50.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(12.15 * 0.51, 24.95 * 0.23, 45.31 * 0.78));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(8.73, 5.53, -70.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(51.9 * 0.76, 7.95 * 0.61, 9.11 * 0.38));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(3.21, 3.93, -60.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(11.8 * 0.1, 32.85 * 0.91, 6.56 * 0.32));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(2.42, 9.89, -100.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(26.4 * 0.31, 10.25 * 0.94, 7.78 * 0.3));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(-1.35, 4.18, -120.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(3.81 * 0.39, 1.64 * 0.03, 43.41 * 0.15));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(-1.56, 2.17, -130.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(10.04 *0.44, 0.1 * 0.72, 12.96 * 0.47));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(-3.0, 0.76, -100.0), vec3.fromValues(0.40, 0.40, 0.40), vec3.fromValues(11.8 * 0.08, 4.41 * 0.55, 13.65 * 0.57));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(4.82, 2.59, -150.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(11.19 * 0.14, 1.46 * 0.77, 7.62 * 0.72));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(2.85, 3.06, -150.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(14.58 * 0.05, 1.22 * 0.58, 14.44 * 0.5));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(2.36, 3.77, -160.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(28.98 * 0.84, 4.35 * 0.73, 10.18 * 0.06));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(-0.55, 5.33, -200.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(9.07 * 0.34, 8.56 * 0.73, 10.51 * 0.96));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(-4.41, 1.51, -80.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(13.75 * 0.15, 6 * 0.39, 16.55 * 0.52));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(-8.7, 4.25, -90.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(12.83 * 0.13, 4.92 * 0.960, 4.17 * 0.57));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(-3.35, 7.72, -50.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(14.78 * 0.02, 5.91 * 0.61, 6.3 * 0.11));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(-5.83, 7.73, -65.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(3.32 * 0.54, 5.64 * 0.64, 19.02 * 0.16));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(-3.95, 5.28, -60.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(11.65 * 0.23, 3.84 * 0.75, 5.5 * 0.29));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(2.09, 2.65, -70.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(5.6 * 0.72, 9.03 * 0.32, 18 * 0.19));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(-3.53, 7.98, -80.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(8.42 * 0.34, 2.82 * 0.96, 13.66 * 0.17));
    drawSphereDiffuseIntense(programToDraw, vec3.fromValues(6.78, 7.45, -95.0), vec3.fromValues(0.25, 0.25, 0.25), vec3.fromValues(5.2 * 0.95, 2.77 * 0.47, 4.84 * 0.69));
}

function drawPlane(programShading)
{
    gl.useProgram(programShading);

    pMatrix = myCamera.GetProjectionMatrix();

    programShading.vertexPositionAttribute = gl.getAttribLocation(programShading, "aVertexPosition");
    gl.enableVertexAttribArray(programShading.vertexPositionAttribute);

    programShading.vertexNormalAttribute = gl.getAttribLocation(programShading, "aVertexNormal");
    gl.enableVertexAttribArray(programShading.vertexNormalAttribute);

    programShading.textureCoordAttribute = gl.getAttribLocation(programShading, "aTextureCoord");
    gl.enableVertexAttribArray(programShading.textureCoordAttribute);

    programShading.pMatrixUniform = gl.getUniformLocation(programShading, "uPMatrix");
    programShading.modelMatrixUniform = gl.getUniformLocation(programShading, "uMMatrix");
    programShading.viewMatrixUniform = gl.getUniformLocation(programShading, "uVMatrix");

    gl.uniform3f(programShading.lightColorUniform, 1.0, 1.0, 1.0);
    gl.uniform3f(programShading.linkPosUniform, lightPos[0], lightPos[1], lightPos[2]);
    gl.uniform3f(programShading.viewPosUniform, myCamera.Position[0], myCamera.Position[1], myCamera.Position[2]);

    programShading.staticColorUniform = gl.getUniformLocation(programShading, "uStaticColor");

    gl.uniform3f(programShading.staticColorUniform, 1.0, 0.0, 0.0);
    gl.uniform1i(gl.getUniformLocation(programShading, "uUseTexture"), 1);
    gl.uniform1i(gl.getUniformLocation(programShading, "uDisableLighting"), 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, checkerGrayTexture);
    gl.uniform1i(gl.getUniformLocation(programShading, "material.diffuse"), 0);
    gl.uniform3f(gl.getUniformLocation(programShading, "material.diffuseColor"), 0.0, 0.0, 1.0);
    gl.uniform1f(gl.getUniformLocation(programShading, "material.shininess"), 64.0);
    gl.uniform1i(gl.getUniformLocation(programShading, "material.hasSpecular"), 1);

    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.direction"), -0.2, -1.0, -0.3);
    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.ambient"), 0.05, 0.05, 0.05);
    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.diffuse"), 0.8, 0.8, 0.8);
    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.specular"), 0.5, 0.5, 0.5);

    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].position"), lightPointPos[0], lightPointPos[1], lightPointPos[2]);
    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].ambient"), 1.0, 0.05, 0.05);
    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].diffuse"), 181/255, 134/255, 144/255);
    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].specular"), 5.0, 5.0, 5.0);
    gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].constant"), 1.0);
    gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].linear"), 0.02);
    gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].quadratic"), 0.010);


    mat4.identity(mMatrix);
    mat4.identity(vMatrix)

    vMatrix = myCamera.GetViewMatrix();

    transformGeometry(vec3.fromValues(0.0, -1.0, -60.0), vec3.fromValues(2000.0, 2000.0, 2000.0));

    gl.uniformMatrix4fv(programShading.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(programShading.modelMatrixUniform, false, mMatrix);
    gl.uniformMatrix4fv(programShading.viewMatrixUniform, false, vMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, planeVertexNormalBuffer);
    gl.vertexAttribPointer(programShading.vertexNormalAttribute, planeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, planeVertexTextureCoordBuffer);
    gl.vertexAttribPointer(programShading.textureCoordAttribute, planeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, planeVertexPositionBuffer);
    gl.vertexAttribPointer(programShading.vertexPositionAttribute, planeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, planeVertexIndexBuffer);
    gl.drawElements(gl.TRIANGLES, planeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function drawTeapot(programShading, translatePos, scalePos) 
{
    if ((teapotVertexNormalBuffer != null && teapotVertexPositionBuffer != null) && (teapotVertexTextureCoordBuffer != null)) {
        gl.useProgram(programShading);

        pMatrix = myCamera.GetProjectionMatrix();

        programShading.vertexPositionAttribute = gl.getAttribLocation(programShading, "aVertexPosition");
        gl.enableVertexAttribArray(programShading.vertexPositionAttribute);

        programShading.vertexNormalAttribute = gl.getAttribLocation(programShading, "aVertexNormal");
        gl.enableVertexAttribArray(programShading.vertexNormalAttribute);

        programShading.textureCoordAttribute = gl.getAttribLocation(programShading, "aTextureCoord");
        gl.enableVertexAttribArray(programShading.textureCoordAttribute);

        programShading.pMatrixUniform = gl.getUniformLocation(programShading, "uPMatrix");
        programShading.modelMatrixUniform = gl.getUniformLocation(programShading, "uMMatrix");
        programShading.viewMatrixUniform = gl.getUniformLocation(programShading, "uVMatrix");

        gl.uniform3f(programShading.lightColorUniform, 1.0, 1.0, 1.0);
        gl.uniform3f(programShading.linkPosUniform, lightPos[0], lightPos[1], lightPos[2]);
        gl.uniform3f(programShading.viewPosUniform, myCamera.Position[0], myCamera.Position[1], myCamera.Position[2]);

        programShading.staticColorUniform = gl.getUniformLocation(programShading, "uStaticColor");

        gl.uniform3f(programShading.staticColorUniform, 0.0, 1.0, 0.0);
        gl.uniform1i(gl.getUniformLocation(programShading, "uUseTexture"), 0);
        gl.uniform1i(gl.getUniformLocation(programShading, "uDisableLighting"), 0);

        gl.uniform3f(gl.getUniformLocation(programShading, "material.diffuseColor"), 0.0, 0.0, 1.0);
        gl.uniform1f(gl.getUniformLocation(programShading, "material.shininess"), 64.0);
        gl.uniform1i(gl.getUniformLocation(programShading, "material.hasSpecular"), 1);

        gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.direction"), -0.2, -1.0, -0.3);
        gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.ambient"), 0.05, 0.05, 0.05);
        gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.diffuse"), 0.8, 0.8, 0.8);
        gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.specular"), 0.5, 0.5, 0.5);

        gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].position"), lightPointPos[0], lightPointPos[1], lightPointPos[2]);
        gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].ambient"), 1.0, 0.05, 0.05);
        gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].diffuse"), 181/255, 134/255, 144/255);
        gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].specular"), 5.0, 5.0, 5.0);
        gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].constant"), 1.0);
        gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].linear"), 0.02);
        gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].quadratic"), 0.010);

        mat4.identity(mMatrix);
        mat4.identity(vMatrix);

        vMatrix = myCamera.GetViewMatrix();

        transformGeometry(translatePos, scalePos);

        gl.uniformMatrix4fv(programShading.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(programShading.modelMatrixUniform, false, mMatrix);
        gl.uniformMatrix4fv(programShading.viewMatrixUniform, false, vMatrix);


        gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexNormalBuffer);
        gl.vertexAttribPointer(programShading.vertexNormalAttribute, teapotVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexTextureCoordBuffer);
        gl.vertexAttribPointer(programShading.textureCoordAttribute, teapotVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexPositionBuffer);
        gl.vertexAttribPointer(programShading.vertexPositionAttribute, teapotVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotVertexIndexBuffer);
        gl.drawElements(gl.TRIANGLES, teapotVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}

function drawSphere(programShading, translatePos, scalePos)
{
    gl.useProgram(programShading);

    pMatrix = myCamera.GetProjectionMatrix();

    programShading.vertexPositionAttribute = gl.getAttribLocation(programShading, "aVertexPosition");
    gl.enableVertexAttribArray(programShading.vertexPositionAttribute);

    programShading.vertexNormalAttribute = gl.getAttribLocation(programShading, "aVertexNormal");
    gl.enableVertexAttribArray(programShading.vertexNormalAttribute);

    programShading.textureCoordAttribute = gl.getAttribLocation(programShading, "aTextureCoord");
    gl.enableVertexAttribArray(programShading.textureCoordAttribute);

    programShading.pMatrixUniform = gl.getUniformLocation(programShading, "uPMatrix");
    programShading.modelMatrixUniform = gl.getUniformLocation(programShading, "uMMatrix");
    programShading.viewMatrixUniform = gl.getUniformLocation(programShading, "uVMatrix");

    gl.uniform3f(programShading.lightColorUniform, 1.0, 1.0, 1.0);
    gl.uniform3f(programShading.linkPosUniform, lightPos[0], lightPos[1], lightPos[2]);
    gl.uniform3f(programShading.viewPosUniform, myCamera.Position[0], myCamera.Position[1], myCamera.Position[2]);

    programShading.staticColorUniform = gl.getUniformLocation(programShading, "uStaticColor");

    gl.uniform3f(programShading.staticColorUniform, 0.0, 1.0, 0.0);
    gl.uniform1i(gl.getUniformLocation(programShading, "uUseTexture"), 0);
    gl.uniform1i(gl.getUniformLocation(programShading, "uDisableLighting"), 0);

    gl.uniform3f(gl.getUniformLocation(programShading, "material.diffuseColor"), 0.0, 0.0, 1.0);
    gl.uniform1f(gl.getUniformLocation(programShading, "material.shininess"), 64.0);
    gl.uniform1i(gl.getUniformLocation(programShading, "material.hasSpecular"), 1);

    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.direction"), -0.2, -1.0, -0.3);
    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.ambient"), 0.05, 0.05, 0.05);
    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.diffuse"), 0.8, 0.8, 0.8);
    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.specular"), 0.5, 0.5, 0.5);

    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].position"), lightPointPos[0], lightPointPos[1], lightPointPos[2]);
    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].ambient"), 1.0, 0.05, 0.05);
    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].diffuse"), 181/255, 134/255, 144/255);
    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].specular"), 5.0, 5.0, 5.0);
    gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].constant"), 1.0);
    gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].linear"), 0.02);
    gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].quadratic"), 0.010);

    gl.uniform3f(programShading.staticColorUniform, 0.0, 0.0, 1.0);

    mat4.identity(mMatrix);
    mat4.identity(vMatrix);

    vMatrix = myCamera.GetViewMatrix();

    transformGeometry(translatePos, scalePos);

    gl.uniformMatrix4fv(programShading.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(programShading.modelMatrixUniform, false, mMatrix);
    gl.uniformMatrix4fv(programShading.viewMatrixUniform, false, vMatrix);


    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
    gl.vertexAttribPointer(programShading.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
    gl.vertexAttribPointer(programShading.textureCoordAttribute, sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
    gl.vertexAttribPointer(programShading.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);
    gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function drawSphereDiffuseIntense(programShading, translatePos, scalePos, colorDiff)
{
    gl.useProgram(programShading);

    pMatrix = myCamera.GetProjectionMatrix();

    programShading.vertexPositionAttribute = gl.getAttribLocation(programShading, "aVertexPosition");
    gl.enableVertexAttribArray(programShading.vertexPositionAttribute);

    programShading.vertexNormalAttribute = gl.getAttribLocation(programShading, "aVertexNormal");
    gl.enableVertexAttribArray(programShading.vertexNormalAttribute);

    programShading.textureCoordAttribute = gl.getAttribLocation(programShading, "aTextureCoord");
    gl.enableVertexAttribArray(programShading.textureCoordAttribute);

    programShading.pMatrixUniform = gl.getUniformLocation(programShading, "uPMatrix");
    programShading.modelMatrixUniform = gl.getUniformLocation(programShading, "uMMatrix");
    programShading.viewMatrixUniform = gl.getUniformLocation(programShading, "uVMatrix");

    gl.uniform3f(programShading.lightColorUniform, 1.0, 1.0, 1.0);
    gl.uniform3f(programShading.linkPosUniform, lightPos[0], lightPos[1], lightPos[2]);
    gl.uniform3f(programShading.viewPosUniform, myCamera.Position[0], myCamera.Position[1], myCamera.Position[2]);

    programShading.staticColorUniform = gl.getUniformLocation(programShading, "uStaticColor");

    //gl.uniform3f(programShading.staticColorUniform, 0.0, 1.0, 0.0);
    gl.uniform1i(gl.getUniformLocation(programShading, "uUseTexture"), 0);
    gl.uniform1i(gl.getUniformLocation(programShading, "uDisableLighting"), 1);

    gl.uniform3f(gl.getUniformLocation(programShading, "material.diffuseColor"), 0.0, 0.0, 1.0);
    gl.uniform1f(gl.getUniformLocation(programShading, "material.shininess"), 64.0);
    gl.uniform1i(gl.getUniformLocation(programShading, "material.hasSpecular"), 1);

    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.direction"), -0.2, -1.0, -0.3);
    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.ambient"), 0.05, 0.05, 0.05);
    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.diffuse"), 0.8, 0.8, 0.8);
    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.specular"), 0.5, 0.5, 0.5);

    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].position"), lightPointPos[0], lightPointPos[1], lightPointPos[2]);
    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].ambient"), 1.0, 0.05, 0.05);
    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].diffuse"), 181/255, 134/255, 144/255);
    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].specular"), 5.0, 5.0, 5.0);
    gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].constant"), 1.0);
    gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].linear"), 0.02);
    gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].quadratic"), 0.010);

    gl.uniform3f(programShading.staticColorUniform, colorDiff[0], colorDiff[1], colorDiff[2]);

    mat4.identity(mMatrix);
    mat4.identity(vMatrix);

    vMatrix = myCamera.GetViewMatrix();

    transformGeometry(translatePos, scalePos);

    gl.uniformMatrix4fv(programShading.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(programShading.modelMatrixUniform, false, mMatrix);
    gl.uniformMatrix4fv(programShading.viewMatrixUniform, false, vMatrix);


    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
    gl.vertexAttribPointer(programShading.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
    gl.vertexAttribPointer(programShading.textureCoordAttribute, sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
    gl.vertexAttribPointer(programShading.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);
    gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function drawCube(programShading, translatePos, scalePos)
{
    gl.useProgram(programShading);

    pMatrix = myCamera.GetProjectionMatrix();

    programShading.vertexPositionAttribute = gl.getAttribLocation(programShading, "aVertexPosition");
    gl.enableVertexAttribArray(programShading.vertexPositionAttribute);

    programShading.vertexNormalAttribute = gl.getAttribLocation(programShading, "aVertexNormal");
    gl.enableVertexAttribArray(programShading.vertexNormalAttribute);

    programShading.textureCoordAttribute = gl.getAttribLocation(programShading, "aTextureCoord");
    gl.enableVertexAttribArray(programShading.textureCoordAttribute);

    programShading.pMatrixUniform = gl.getUniformLocation(programShading, "uPMatrix");
    programShading.modelMatrixUniform = gl.getUniformLocation(programShading, "uMMatrix");
    programShading.viewMatrixUniform = gl.getUniformLocation(programShading, "uVMatrix");

    gl.uniform3f(programShading.lightColorUniform, 1.0, 1.0, 1.0);
    gl.uniform3f(programShading.linkPosUniform, lightPos[0], lightPos[1], lightPos[2]);
    gl.uniform3f(programShading.viewPosUniform, myCamera.Position[0], myCamera.Position[1], myCamera.Position[2]);

    programShading.staticColorUniform = gl.getUniformLocation(programShading, "uStaticColor");

    gl.uniform3f(programShading.staticColorUniform, 0.0, 1.0, 0.0);
    gl.uniform1i(gl.getUniformLocation(programShading, "uUseTexture"), 0);
    gl.uniform1i(gl.getUniformLocation(programShading, "uDisableLighting"), 0);

    gl.uniform3f(gl.getUniformLocation(programShading, "material.diffuseColor"), 0.0, 0.0, 1.0);
    gl.uniform1f(gl.getUniformLocation(programShading, "material.shininess"), 64.0);
    gl.uniform1i(gl.getUniformLocation(programShading, "material.hasSpecular"), 1);

    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.direction"), -0.2, -1.0, -0.3);
    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.ambient"), 0.05, 0.05, 0.05);
    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.diffuse"), 0.8, 0.8, 0.8);
    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.specular"), 0.5, 0.5, 0.5);

    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].position"), lightPointPos[0], lightPointPos[1], lightPointPos[2]);
    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].ambient"), 1.0, 0.05, 0.05);
    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].diffuse"), 181/255, 134/255, 144/255);
    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].specular"), 5.0, 5.0, 5.0);
    gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].constant"), 1.0);
    gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].linear"), 0.02);
    gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].quadratic"), 0.010);

    mat4.identity(mMatrix);
    mat4.identity(vMatrix);

    vMatrix = myCamera.GetViewMatrix();

    transformGeometry(translatePos, scalePos);

    gl.uniformMatrix4fv(programShading.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(programShading.modelMatrixUniform, false, mMatrix);
    gl.uniformMatrix4fv(programShading.viewMatrixUniform, false, vMatrix);


    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
    gl.vertexAttribPointer(programShading.vertexNormalAttribute, cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    gl.vertexAttribPointer(programShading.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.vertexAttribPointer(programShading.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function drawRing(programShading, translatePos, scalePos)
{
    gl.useProgram(programShading);

    pMatrix = myCamera.GetProjectionMatrix();

    programShading.vertexPositionAttribute = gl.getAttribLocation(programShading, "aVertexPosition");
    gl.enableVertexAttribArray(programShading.vertexPositionAttribute);

    programShading.vertexNormalAttribute = gl.getAttribLocation(programShading, "aVertexNormal");
    gl.enableVertexAttribArray(programShading.vertexNormalAttribute);

    programShading.textureCoordAttribute = gl.getAttribLocation(programShading, "aTextureCoord");
    gl.enableVertexAttribArray(programShading.textureCoordAttribute);

    programShading.pMatrixUniform = gl.getUniformLocation(programShading, "uPMatrix");
    programShading.modelMatrixUniform = gl.getUniformLocation(programShading, "uMMatrix");
    programShading.viewMatrixUniform = gl.getUniformLocation(programShading, "uVMatrix");

    gl.uniform3f(programShading.lightColorUniform, 1.0, 1.0, 1.0);
    gl.uniform3f(programShading.linkPosUniform, lightPos[0], lightPos[1], lightPos[2]);
    gl.uniform3f(programShading.viewPosUniform, myCamera.Position[0], myCamera.Position[1], myCamera.Position[2]);

    programShading.staticColorUniform = gl.getUniformLocation(programShading, "uStaticColor");

    gl.uniform3f(programShading.staticColorUniform, 0.0, 1.0, 0.0);
    gl.uniform1i(gl.getUniformLocation(programShading, "uUseTexture"), 0);
    gl.uniform1i(gl.getUniformLocation(programShading, "uDisableLighting"), 0);

    gl.uniform3f(gl.getUniformLocation(programShading, "material.diffuseColor"), 0.0, 0.0, 1.0);
    gl.uniform1f(gl.getUniformLocation(programShading, "material.shininess"), 64.0);
    gl.uniform1i(gl.getUniformLocation(programShading, "material.hasSpecular"), 1);

    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.direction"), -0.2, -1.0, -0.3);
    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.ambient"), 0.05, 0.05, 0.05);
    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.diffuse"), 0.8, 0.8, 0.8);
    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.specular"), 0.5, 0.5, 0.5);

    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].position"), lightPointPos[0], lightPointPos[1], lightPointPos[2]);
    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].ambient"), 1.0, 0.05, 0.05);
    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].diffuse"), 181/255, 134/255, 144/255);
    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].specular"), 5.0, 5.0, 5.0);
    gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].constant"), 1.0);
    gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].linear"), 0.02);
    gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].quadratic"), 0.010);

    mat4.identity(mMatrix);
    mat4.identity(vMatrix);

    vMatrix = myCamera.GetViewMatrix();

    transformGeometry(translatePos, scalePos);

    gl.uniformMatrix4fv(programShading.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(programShading.modelMatrixUniform, false, mMatrix);
    gl.uniformMatrix4fv(programShading.viewMatrixUniform, false, vMatrix);


    gl.bindBuffer(gl.ARRAY_BUFFER, ringVertexNormalBuffer);
    gl.vertexAttribPointer(programShading.vertexNormalAttribute, ringVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, ringVertexTextureCoordBuffer);
    gl.vertexAttribPointer(programShading.textureCoordAttribute, ringVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, ringVertexPositionBuffer);
    gl.vertexAttribPointer(programShading.vertexPositionAttribute, ringVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ringVertexIndexBuffer);
    gl.drawElements(gl.TRIANGLES, ringVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function drawTorus(programShading, translatePos, scalePos)
{
    gl.useProgram(programShading);

    pMatrix = myCamera.GetProjectionMatrix();

    programShading.vertexPositionAttribute = gl.getAttribLocation(programShading, "aVertexPosition");
    gl.enableVertexAttribArray(programShading.vertexPositionAttribute);

    programShading.vertexNormalAttribute = gl.getAttribLocation(programShading, "aVertexNormal");
    gl.enableVertexAttribArray(programShading.vertexNormalAttribute);

    programShading.textureCoordAttribute = gl.getAttribLocation(programShading, "aTextureCoord");
    gl.enableVertexAttribArray(programShading.textureCoordAttribute);

    programShading.pMatrixUniform = gl.getUniformLocation(programShading, "uPMatrix");
    programShading.modelMatrixUniform = gl.getUniformLocation(programShading, "uMMatrix");
    programShading.viewMatrixUniform = gl.getUniformLocation(programShading, "uVMatrix");

    gl.uniform3f(programShading.lightColorUniform, 1.0, 1.0, 1.0);
    gl.uniform3f(programShading.linkPosUniform, lightPos[0], lightPos[1], lightPos[2]);
    gl.uniform3f(programShading.viewPosUniform, myCamera.Position[0], myCamera.Position[1], myCamera.Position[2]);

    programShading.staticColorUniform = gl.getUniformLocation(programShading, "uStaticColor");

    gl.uniform3f(programShading.staticColorUniform, 0.0, 1.0, 0.0);
    gl.uniform1i(gl.getUniformLocation(programShading, "uUseTexture"), 0);
    gl.uniform1i(gl.getUniformLocation(programShading, "uDisableLighting"), 0);

    gl.uniform3f(gl.getUniformLocation(programShading, "material.diffuseColor"), 0.0, 0.0, 1.0);
    gl.uniform1f(gl.getUniformLocation(programShading, "material.shininess"), 64.0);
    gl.uniform1i(gl.getUniformLocation(programShading, "material.hasSpecular"), 1);

    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.direction"), -0.2, -1.0, -0.3);
    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.ambient"), 0.05, 0.05, 0.05);
    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.diffuse"), 0.8, 0.8, 0.8);
    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.specular"), 0.5, 0.5, 0.5);

    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].position"), lightPointPos[0], lightPointPos[1], lightPointPos[2]);
    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].ambient"), 1.0, 0.05, 0.05);
    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].diffuse"), 181/255, 134/255, 144/255);
    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].specular"), 5.0, 5.0, 5.0);
    gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].constant"), 1.0);
    gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].linear"), 0.02);
    gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].quadratic"), 0.010);

    mat4.identity(mMatrix);
    mat4.identity(vMatrix);

    vMatrix = myCamera.GetViewMatrix();

    transformGeometry(translatePos, scalePos);

    gl.uniformMatrix4fv(programShading.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(programShading.modelMatrixUniform, false, mMatrix);
    gl.uniformMatrix4fv(programShading.viewMatrixUniform, false, vMatrix);


    gl.bindBuffer(gl.ARRAY_BUFFER, torusVertexNormalBuffer);
    gl.vertexAttribPointer(programShading.vertexNormalAttribute, torusVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, torusVertexTextureCoordBuffer);
    gl.vertexAttribPointer(programShading.textureCoordAttribute, torusVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, torusVertexPositionBuffer);
    gl.vertexAttribPointer(programShading.vertexPositionAttribute, torusVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, torusVertexIndexBuffer);
    gl.drawElements(gl.TRIANGLES, torusVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function drawCylinder(programShading, translatePos, scalePos)
{
    gl.useProgram(programShading);

    pMatrix = myCamera.GetProjectionMatrix();

    programShading.vertexPositionAttribute = gl.getAttribLocation(programShading, "aVertexPosition");
    gl.enableVertexAttribArray(programShading.vertexPositionAttribute);

    programShading.vertexNormalAttribute = gl.getAttribLocation(programShading, "aVertexNormal");
    gl.enableVertexAttribArray(programShading.vertexNormalAttribute);

    programShading.textureCoordAttribute = gl.getAttribLocation(programShading, "aTextureCoord");
    gl.enableVertexAttribArray(programShading.textureCoordAttribute);

    programShading.pMatrixUniform = gl.getUniformLocation(programShading, "uPMatrix");
    programShading.modelMatrixUniform = gl.getUniformLocation(programShading, "uMMatrix");
    programShading.viewMatrixUniform = gl.getUniformLocation(programShading, "uVMatrix");

    gl.uniform3f(programShading.lightColorUniform, 1.0, 1.0, 1.0);
    gl.uniform3f(programShading.linkPosUniform, lightPos[0], lightPos[1], lightPos[2]);
    gl.uniform3f(programShading.viewPosUniform, myCamera.Position[0], myCamera.Position[1], myCamera.Position[2]);

    programShading.staticColorUniform = gl.getUniformLocation(programShading, "uStaticColor");

    gl.uniform3f(programShading.staticColorUniform, 0.0, 1.0, 0.0);
    gl.uniform1i(gl.getUniformLocation(programShading, "uUseTexture"), 0);
    gl.uniform1i(gl.getUniformLocation(programShading, "uDisableLighting"), 0);

    gl.uniform3f(gl.getUniformLocation(programShading, "material.diffuseColor"), 0.0, 0.0, 1.0);
    gl.uniform1f(gl.getUniformLocation(programShading, "material.shininess"), 64.0);
    gl.uniform1i(gl.getUniformLocation(programShading, "material.hasSpecular"), 1);

    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.direction"), -0.2, -1.0, -0.3);
    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.ambient"), 0.05, 0.05, 0.05);
    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.diffuse"), 0.8, 0.8, 0.8);
    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.specular"), 0.5, 0.5, 0.5);

    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].position"), lightPointPos[0], lightPointPos[1], lightPointPos[2]);
    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].ambient"), 1.0, 0.05, 0.05);
    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].diffuse"), 181/255, 134/255, 144/255);
    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].specular"), 5.0, 5.0, 5.0);
    gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].constant"), 1.0);
    gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].linear"), 0.02);
    gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].quadratic"), 0.010);

    mat4.identity(mMatrix);
    mat4.identity(vMatrix);

    vMatrix = myCamera.GetViewMatrix();

    var aux = mat4.create();
    mat4.identity(aux);

    mat4.translate(mMatrix, mMatrix, [translatePos[0], translatePos[1], translatePos[2]]);
    mat4.rotate(mMatrix, mMatrix, Math.PI/2.0, vec3.fromValues(1.0, 0.0, 0.0));
    mat4.fromScaling(aux, [scalePos[0], scalePos[1], scalePos[2]]);
    mat4.multiply(mMatrix, mMatrix, aux);
    

    gl.uniformMatrix4fv(programShading.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(programShading.modelMatrixUniform, false, mMatrix);
    gl.uniformMatrix4fv(programShading.viewMatrixUniform, false, vMatrix);


    gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexNormalBuffer);
    gl.vertexAttribPointer(programShading.vertexNormalAttribute, cylinderVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexTextureCoordBuffer);
    gl.vertexAttribPointer(programShading.textureCoordAttribute, cylinderVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexPositionBuffer);
    gl.vertexAttribPointer(programShading.vertexPositionAttribute, cylinderVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderVertexIndexBuffer);
    gl.drawElements(gl.TRIANGLES, cylinderVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function drawCone(programShading, translatePos, scalePos)
{
    gl.useProgram(programShading);

    pMatrix = myCamera.GetProjectionMatrix();

    programShading.vertexPositionAttribute = gl.getAttribLocation(programShading, "aVertexPosition");
    gl.enableVertexAttribArray(programShading.vertexPositionAttribute);

    programShading.vertexNormalAttribute = gl.getAttribLocation(programShading, "aVertexNormal");
    gl.enableVertexAttribArray(programShading.vertexNormalAttribute);

    programShading.textureCoordAttribute = gl.getAttribLocation(programShading, "aTextureCoord");
    gl.enableVertexAttribArray(programShading.textureCoordAttribute);

    programShading.pMatrixUniform = gl.getUniformLocation(programShading, "uPMatrix");
    programShading.modelMatrixUniform = gl.getUniformLocation(programShading, "uMMatrix");
    programShading.viewMatrixUniform = gl.getUniformLocation(programShading, "uVMatrix");

    gl.uniform3f(programShading.lightColorUniform, 1.0, 1.0, 1.0);
    gl.uniform3f(programShading.linkPosUniform, lightPos[0], lightPos[1], lightPos[2]);
    gl.uniform3f(programShading.viewPosUniform, myCamera.Position[0], myCamera.Position[1], myCamera.Position[2]);

    programShading.staticColorUniform = gl.getUniformLocation(programShading, "uStaticColor");

    gl.uniform3f(programShading.staticColorUniform, 0.0, 1.0, 0.0);
    gl.uniform1i(gl.getUniformLocation(programShading, "uUseTexture"), 0);
    gl.uniform1i(gl.getUniformLocation(programShading, "uDisableLighting"), 0);

    gl.uniform3f(gl.getUniformLocation(programShading, "material.diffuseColor"), 0.0, 0.0, 1.0);
    gl.uniform1f(gl.getUniformLocation(programShading, "material.shininess"), 64.0);
    gl.uniform1i(gl.getUniformLocation(programShading, "material.hasSpecular"), 1);

    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.direction"), -0.2, -1.0, -0.3);
    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.ambient"), 0.05, 0.05, 0.05);
    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.diffuse"), 0.8, 0.8, 0.8);
    gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.specular"), 0.5, 0.5, 0.5);

    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].position"), lightPointPos[0], lightPointPos[1], lightPointPos[2]);
    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].ambient"), 1.0, 0.05, 0.05);
    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].diffuse"), 181/255, 134/255, 144/255);
    gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].specular"), 5.0, 5.0, 5.0);
    gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].constant"), 1.0);
    gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].linear"), 0.02);
    gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].quadratic"), 0.010);

    mat4.identity(mMatrix);
    mat4.identity(vMatrix);

    vMatrix = myCamera.GetViewMatrix();

    var aux = mat4.create();
    mat4.identity(aux);

    mat4.translate(mMatrix, mMatrix, [translatePos[0], translatePos[1], translatePos[2]]);
    mat4.rotate(mMatrix, mMatrix, -Math.PI/2.0, vec3.fromValues(1.0, 0.0, 0.0));
    mat4.fromScaling(aux, [scalePos[0], scalePos[1], scalePos[2]]);
    mat4.multiply(mMatrix, mMatrix, aux);

    gl.uniformMatrix4fv(programShading.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(programShading.modelMatrixUniform, false, mMatrix);
    gl.uniformMatrix4fv(programShading.viewMatrixUniform, false, vMatrix);


    gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexNormalBuffer);
    gl.vertexAttribPointer(programShading.vertexNormalAttribute, coneVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexTextureCoordBuffer);
    gl.vertexAttribPointer(programShading.textureCoordAttribute, coneVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexPositionBuffer);
    gl.vertexAttribPointer(programShading.vertexPositionAttribute, coneVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, coneVertexIndexBuffer);
    gl.drawElements(gl.TRIANGLES, coneVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function drawRabbit(programShading, translatePos, scalePos)
{
    if (rabbitVertexPositionBuffer != null && rabbitVertexNormalBuffer != null) {
        gl.disableVertexAttribArray(shaderProgramPhongLightingPass.textureCoordAttribute);
        gl.useProgram(programShading);

        pMatrix = myCamera.GetProjectionMatrix();

        programShading.vertexPositionAttribute = gl.getAttribLocation(programShading, "aVertexPosition");
        gl.enableVertexAttribArray(programShading.vertexPositionAttribute);

        programShading.vertexNormalAttribute = gl.getAttribLocation(programShading, "aVertexNormal");
        gl.enableVertexAttribArray(programShading.vertexNormalAttribute);

        //programShading.textureCoordAttribute = gl.getAttribLocation(programShading, "aTextureCoord");
        //gl.enableVertexAttribArray(programShading.textureCoordAttribute);

        programShading.pMatrixUniform = gl.getUniformLocation(programShading, "uPMatrix");
        programShading.modelMatrixUniform = gl.getUniformLocation(programShading, "uMMatrix");
        programShading.viewMatrixUniform = gl.getUniformLocation(programShading, "uVMatrix");

        gl.uniform3f(programShading.lightColorUniform, 1.0, 1.0, 1.0);
        gl.uniform3f(programShading.linkPosUniform, lightPos[0], lightPos[1], lightPos[2]);
        gl.uniform3f(programShading.viewPosUniform, myCamera.Position[0], myCamera.Position[1], myCamera.Position[2]);

        programShading.staticColorUniform = gl.getUniformLocation(programShading, "uStaticColor");

        gl.uniform3f(programShading.staticColorUniform, 0.0, 1.0, 0.0);
        gl.uniform1i(gl.getUniformLocation(programShading, "uUseTexture"), 0);
        gl.uniform1i(gl.getUniformLocation(programShading, "uDisableLighting"), 0);

        gl.uniform3f(gl.getUniformLocation(programShading, "material.diffuseColor"), 0.0, 0.0, 1.0);
        gl.uniform1f(gl.getUniformLocation(programShading, "material.shininess"), 64.0);
        gl.uniform1i(gl.getUniformLocation(programShading, "material.hasSpecular"), 1);

        gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.direction"), -0.2, -1.0, -0.3);
        gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.ambient"), 0.05, 0.05, 0.05);
        gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.diffuse"), 0.8, 0.8, 0.8);
        gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.specular"), 0.5, 0.5, 0.5);

        gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].position"), lightPointPos[0], lightPointPos[1], lightPointPos[2]);
        gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].ambient"), 1.0, 0.05, 0.05);
        gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].diffuse"), 181/255, 134/255, 144/255);
        gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].specular"), 5.0, 5.0, 5.0);
        gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].constant"), 1.0);
        gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].linear"), 0.02);
        gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].quadratic"), 0.010);

        mat4.identity(mMatrix);
        mat4.identity(vMatrix);

        vMatrix = myCamera.GetViewMatrix();

        var aux = mat4.create();
        mat4.identity(aux);

        mat4.translate(mMatrix, mMatrix, [translatePos[0], translatePos[1], translatePos[2]]);
        //mat4.rotate(mMatrix, mMatrix, -Math.PI/2.0, vec3.fromValues(1.0, 0.0, 0.0));
        mat4.fromScaling(aux, [scalePos[0], scalePos[1], scalePos[2]]);
        mat4.multiply(mMatrix, mMatrix, aux);

        gl.uniformMatrix4fv(programShading.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(programShading.modelMatrixUniform, false, mMatrix);
        gl.uniformMatrix4fv(programShading.viewMatrixUniform, false, vMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, rabbitVertexNormalBuffer);
        gl.vertexAttribPointer(programShading.vertexNormalAttribute, rabbitVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, rabbitVertexPositionBuffer);
        gl.vertexAttribPointer(programShading.vertexPositionAttribute, rabbitVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLES, 0, rabbitVertexPositionBuffer.numItems);
    }
}

function drawDragon(programShading, translatePos, scalePos)
{
    if (dragonVertexPositionBuffer != null && dragonVertexNormalBuffer != null) {
        gl.disableVertexAttribArray(shaderProgramPhongLightingPass.textureCoordAttribute);
        gl.useProgram(programShading);

        pMatrix = myCamera.GetProjectionMatrix();

        programShading.vertexPositionAttribute = gl.getAttribLocation(programShading, "aVertexPosition");
        gl.enableVertexAttribArray(programShading.vertexPositionAttribute);

        programShading.vertexNormalAttribute = gl.getAttribLocation(programShading, "aVertexNormal");
        gl.enableVertexAttribArray(programShading.vertexNormalAttribute);

        //programShading.textureCoordAttribute = gl.getAttribLocation(programShading, "aTextureCoord");
        //gl.enableVertexAttribArray(programShading.textureCoordAttribute);

        programShading.pMatrixUniform = gl.getUniformLocation(programShading, "uPMatrix");
        programShading.modelMatrixUniform = gl.getUniformLocation(programShading, "uMMatrix");
        programShading.viewMatrixUniform = gl.getUniformLocation(programShading, "uVMatrix");

        gl.uniform3f(programShading.lightColorUniform, 1.0, 1.0, 1.0);
        gl.uniform3f(programShading.linkPosUniform, lightPos[0], lightPos[1], lightPos[2]);
        gl.uniform3f(programShading.viewPosUniform, myCamera.Position[0], myCamera.Position[1], myCamera.Position[2]);

        programShading.staticColorUniform = gl.getUniformLocation(programShading, "uStaticColor");

        gl.uniform3f(programShading.staticColorUniform, 0.0, 1.0, 0.0);
        gl.uniform1i(gl.getUniformLocation(programShading, "uUseTexture"), 0);
        gl.uniform1i(gl.getUniformLocation(programShading, "uDisableLighting"), 0);

        gl.uniform3f(gl.getUniformLocation(programShading, "material.diffuseColor"), 0.0, 0.0, 1.0);
        gl.uniform1f(gl.getUniformLocation(programShading, "material.shininess"), 64.0);
        gl.uniform1i(gl.getUniformLocation(programShading, "material.hasSpecular"), 1);

        gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.direction"), -0.2, -1.0, -0.3);
        gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.ambient"), 0.05, 0.05, 0.05);
        gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.diffuse"), 0.8, 0.8, 0.8);
        gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.specular"), 0.5, 0.5, 0.5);

        gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].position"), lightPointPos[0], lightPointPos[1], lightPointPos[2]);
        gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].ambient"), 1.0, 0.05, 0.05);
        gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].diffuse"), 181/255, 134/255, 144/255);
        gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].specular"), 5.0, 5.0, 5.0);
        gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].constant"), 1.0);
        gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].linear"), 0.02);
        gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].quadratic"), 0.010);

        mat4.identity(mMatrix);
        mat4.identity(vMatrix);

        vMatrix = myCamera.GetViewMatrix();

        var aux = mat4.create();
        mat4.identity(aux);

        mat4.translate(mMatrix, mMatrix, [translatePos[0], translatePos[1], translatePos[2]]);
        //mat4.rotate(mMatrix, mMatrix, -Math.PI/2.0, vec3.fromValues(1.0, 0.0, 0.0));
        mat4.fromScaling(aux, [scalePos[0], scalePos[1], scalePos[2]]);
        mat4.multiply(mMatrix, mMatrix, aux);

        gl.uniformMatrix4fv(programShading.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(programShading.modelMatrixUniform, false, mMatrix);
        gl.uniformMatrix4fv(programShading.viewMatrixUniform, false, vMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, dragonVertexNormalBuffer);
        gl.vertexAttribPointer(programShading.vertexNormalAttribute, dragonVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, dragonVertexPositionBuffer);
        gl.vertexAttribPointer(programShading.vertexPositionAttribute, dragonVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLES, 0, dragonVertexPositionBuffer.numItems);
    }
}

function drawSuzanne(programShading, translatePos, scalePos)
{
    if (suzanneVertexPositionBuffer != null && suzanneVertexNormalBuffer != null) {
        gl.disableVertexAttribArray(shaderProgramPhongLightingPass.textureCoordAttribute);
        gl.useProgram(programShading);

        pMatrix = myCamera.GetProjectionMatrix();

        programShading.vertexPositionAttribute = gl.getAttribLocation(programShading, "aVertexPosition");
        gl.enableVertexAttribArray(programShading.vertexPositionAttribute);

        programShading.vertexNormalAttribute = gl.getAttribLocation(programShading, "aVertexNormal");
        gl.enableVertexAttribArray(programShading.vertexNormalAttribute);

        //programShading.textureCoordAttribute = gl.getAttribLocation(programShading, "aTextureCoord");
        //gl.enableVertexAttribArray(programShading.textureCoordAttribute);

        programShading.pMatrixUniform = gl.getUniformLocation(programShading, "uPMatrix");
        programShading.modelMatrixUniform = gl.getUniformLocation(programShading, "uMMatrix");
        programShading.viewMatrixUniform = gl.getUniformLocation(programShading, "uVMatrix");

        gl.uniform3f(programShading.lightColorUniform, 1.0, 1.0, 1.0);
        gl.uniform3f(programShading.linkPosUniform, lightPos[0], lightPos[1], lightPos[2]);
        gl.uniform3f(programShading.viewPosUniform, myCamera.Position[0], myCamera.Position[1], myCamera.Position[2]);

        programShading.staticColorUniform = gl.getUniformLocation(programShading, "uStaticColor");

        gl.uniform3f(programShading.staticColorUniform, 0.0, 1.0, 0.0);
        gl.uniform1i(gl.getUniformLocation(programShading, "uUseTexture"), 0);
        gl.uniform1i(gl.getUniformLocation(programShading, "uDisableLighting"), 0);

        gl.uniform3f(gl.getUniformLocation(programShading, "material.diffuseColor"), 0.0, 0.0, 1.0);
        gl.uniform1f(gl.getUniformLocation(programShading, "material.shininess"), 64.0);
        gl.uniform1i(gl.getUniformLocation(programShading, "material.hasSpecular"), 1);

        gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.direction"), -0.2, -1.0, -0.3);
        gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.ambient"), 0.05, 0.05, 0.05);
        gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.diffuse"), 0.8, 0.8, 0.8);
        gl.uniform3f(gl.getUniformLocation(programShading, "dirLight.specular"), 0.5, 0.5, 0.5);

        gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].position"), lightPointPos[0], lightPointPos[1], lightPointPos[2]);
        gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].ambient"), 1.0, 0.05, 0.05);
        gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].diffuse"), 181/255, 134/255, 144/255);
        gl.uniform3f(gl.getUniformLocation(programShading, "pointLights[0].specular"), 5.0, 5.0, 5.0);
        gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].constant"), 1.0);
        gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].linear"), 0.02);
        gl.uniform1f(gl.getUniformLocation(programShading, "pointsLights[0].quadratic"), 0.010);

        mat4.identity(mMatrix);
        mat4.identity(vMatrix);

        vMatrix = myCamera.GetViewMatrix();

        var aux = mat4.create();
        mat4.identity(aux);

        mat4.translate(mMatrix, mMatrix, [translatePos[0], translatePos[1], translatePos[2]]);
        //mat4.rotate(mMatrix, mMatrix, -Math.PI/2.0, vec3.fromValues(1.0, 0.0, 0.0));
        mat4.fromScaling(aux, [scalePos[0], scalePos[1], scalePos[2]]);
        mat4.multiply(mMatrix, mMatrix, aux);

        gl.uniformMatrix4fv(programShading.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(programShading.modelMatrixUniform, false, mMatrix);
        gl.uniformMatrix4fv(programShading.viewMatrixUniform, false, vMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, suzanneVertexNormalBuffer);
        gl.vertexAttribPointer(programShading.vertexNormalAttribute, suzanneVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, suzanneVertexPositionBuffer);
        gl.vertexAttribPointer(programShading.vertexPositionAttribute, suzanneVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLES, 0, suzanneVertexPositionBuffer.numItems);
    }
}

function drawScreenFillingGeometry(programShading) {
    gl.disable(gl.DEPTH_TEST);
    //gl.disableVertexAttribArray(shaderProgramPhongLightingPass.vertexPositionAttribute);
    //gl.disableVertexAttribArray(shaderProgramPhongLightingPass.textureCoordAttribute);
    //gl.disableVertexAttribArray(shaderProgramPhongLightingPass.vertexNormalAttribute);
    gl.useProgram(programShading);

    programShading.vertexPositionAttribute = gl.getAttribLocation(programShading, "aVertexPosition");
    gl.enableVertexAttribArray(programShading.vertexPositionAttribute);

    programShading.textureCoordAttribute = gl.getAttribLocation(programShading, "aTextureCoord");
    gl.enableVertexAttribArray(programShading.textureCoordAttribute);

    programShading.staticColorUniform = gl.getUniformLocation(programShading, "uStaticColor");

    if (programShading == shaderProgramBackgroundPass) {
        programShading.cameraToWorldMatrixUniform = gl.getUniformLocation(programShading, "uCameraToWorldMatrix")
        programShading.invProjectionMatrixUniform = gl.getUniformLocation(programShading, "uInvProjectionMatrix");
        programShading.resolutionUniform = gl.getUniformLocation(programShading, "uResolution");

        programShading.lightUniform = gl.getUniformLocation(programShading, "uLight");

        gl.uniform3f(programShading.staticColorUniform, 1.0, 1.0, 0.0);
        var invViewMatrix = mat4.create();
        invViewMatrix = myCamera.GetViewMatrix();
        mat4.invert(invViewMatrix, invViewMatrix);
        gl.uniformMatrix4fv(programShading.cameraToWorldMatrixUniform, false, invViewMatrix);
        var invPMatrix = mat4.create();
        invPMatrix = myCamera.GetProjectionMatrix();
        mat4.invert(invPMatrix, invPMatrix);
        gl.uniformMatrix4fv(programShading.invProjectionMatrixUniform, false, invPMatrix);
        gl.uniform2f(programShading.resolutionUniform, gl.viewportWidth, gl.viewportHeight);
        
        var lightPos = vec3.fromValues(1.0, 0.5, 0.2);
        vec3.normalize(lightPos, lightPos);
        gl.uniform3f(programShading.lightUniform, lightPos[0], lightPos[1], lightPos[2]);
    }

    if (programShading == shaderProgramScrFillTexturePass) {
        gl.uniform3f(programShading.staticColorUniform, 0.0, 1.0, 0.0);

        programShading.uSamplerUniform = gl.getUniformLocation(programShading, "uSampler");

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textureBackBuffer);
        gl.uniform1i(programShading.uSamplerUniform, 0);
    }
    

    gl.bindBuffer(gl.ARRAY_BUFFER, screenFillingVertexPositionBuffer);
    gl.vertexAttribPointer(programShading.vertexPositionAttribute, screenFillingVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, screenFillingTextureCoordBuffer);
    gl.vertexAttribPointer(programShading.textureCoordAttribute, screenFillingTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, screenFillingIndexBuffer);
    gl.drawElements(gl.TRIANGLES, screenFillingIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    gl.enable(gl.DEPTH_TEST);
}

function renderScrFillTexture(texture) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(shaderProgramScrFillTexturePass);

    shaderProgramScrFillTexturePass.vertexPositionAttribute = gl.getAttribLocation(shaderProgramScrFillTexturePass, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgramScrFillTexturePass.vertexPositionAttribute);

    shaderProgramScrFillTexturePass.textureCoordAttribute = gl.getAttribLocation(shaderProgramScrFillTexturePass, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgramScrFillTexturePass.textureCoordAttribute);

    shaderProgramScrFillTexturePass.samplerUniform = gl.getUniformLocation(shaderProgramScrFillTexturePass, "uSampler");

    gl.bindBuffer(gl.ARRAY_BUFFER, screenFillingVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgramScrFillTexturePass.vertexPositionAttribute, screenFillingVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, screenFillingTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgramScrFillTexturePass.textureCoordAttribute, screenFillingTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(shaderProgramScrFillTexturePass.samplerUniform, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, screenFillingIndexBuffer);
    gl.drawElements(gl.TRIANGLES, screenFillingIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function renderScenePass() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(shaderProgramScenePass);

    shaderProgramScenePass.vertexPositionAttribute = gl.getAttribLocation(shaderProgramScenePass, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgramScenePass.vertexPositionAttribute);

    shaderProgramScenePass.textureCoordAttribute = gl.getAttribLocation(shaderProgramScenePass, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgramScenePass.textureCoordAttribute);

    shaderProgramScenePass.samplerSceneColorUniform = gl.getUniformLocation(shaderProgramScenePass, "uSamplerColor");
    shaderProgramScenePass.samplerSceneDepthUniform = gl.getUniformLocation(shaderProgramScenePass, "uSamplerDepth")

    shaderProgramScenePass.cocUniform = gl.getUniformLocation(shaderProgramScenePass, "uCoc");

    shaderProgramScenePass.apertureUniform = gl.getUniformLocation(shaderProgramScenePass, "uAperture");
    shaderProgramScenePass.focalplaneUniform = gl.getUniformLocation(shaderProgramScenePass, "uFocallength");
    shaderProgramScenePass.focallengthUniform = gl.getUniformLocation(shaderProgramScenePass, "uFocalplane");
    shaderProgramScenePass.znearUniform = gl.getUniformLocation(shaderProgramScenePass, "uZNear");
    shaderProgramScenePass.zfarUniform = gl.getUniformLocation(shaderProgramScenePass, "uZFar");

    gl.bindBuffer(gl.ARRAY_BUFFER, screenFillingVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgramScenePass.vertexPositionAttribute, screenFillingVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, screenFillingTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgramScenePass.textureCoordAttribute, screenFillingTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.uniform1f(shaderProgramScenePass.cocUniform, CoC);
    gl.uniform1f(shaderProgramScenePass.apertureUniform, aperture);
    gl.uniform1f(shaderProgramScenePass.focalplaneUniform, focalplane);
    gl.uniform1f(shaderProgramScenePass.focallengthUniform, focallength);
    gl.uniform1f(shaderProgramScenePass.znearUniform, myCamera.GetNearValue());
    gl.uniform1f(shaderProgramScenePass.zfarUniform, myCamera.GetFarValue());

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureSceneBuffer);
    gl.uniform1i(shaderProgramScenePass.samplerSceneColorUniform, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textureDepthColorBuffer);
    gl.uniform1i(shaderProgramScenePass.samplerSceneDepthUniform, 1);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, screenFillingIndexBuffer);
    gl.drawElements(gl.TRIANGLES, screenFillingIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function renderDownsamplePass() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(shaderProgramDownsamplePass);

    shaderProgramDownsamplePass.vertexPositionAttribute = gl.getAttribLocation(shaderProgramDownsamplePass, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgramDownsamplePass.vertexPositionAttribute);

    shaderProgramDownsamplePass.textureCoordAttribute = gl.getAttribLocation(shaderProgramDownsamplePass, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgramDownsamplePass.textureCoordAttribute);

    shaderProgramDownsamplePass.samplerUniform = gl.getUniformLocation(shaderProgramDownsamplePass, "uSampler");

    shaderProgramDownsamplePass.invViewCoordinatesUniform = gl.getUniformLocation(shaderProgramDownsamplePass, "uInvViewDimensions");

    gl.bindBuffer(gl.ARRAY_BUFFER, screenFillingVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgramDownsamplePass.vertexPositionAttribute, screenFillingVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, screenFillingTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgramDownsamplePass.textureCoordAttribute, screenFillingTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    //var invViewDimensions_x = 1.0 / 789.0;
    //var invViewDimensions_y = 1.0 / 643.0;

    gl.uniform2f(shaderProgramDownsamplePass.invViewCoordinatesUniform, invViewDimensions_x, invViewDimensions_y);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureBackBuffer);
    gl.uniform1i(shaderProgramDownsamplePass.samplerUniform, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, screenFillingIndexBuffer);
    gl.drawElements(gl.TRIANGLES, screenFillingIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function drawVerticalAndDiagonalBlurPass() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(shaderProgramVerAndDiagBlurPass);

    shaderProgramVerAndDiagBlurPass.vertexPositionAtribute = gl.getAttribLocation(shaderProgramVerAndDiagBlurPass, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgramVerAndDiagBlurPass.vertexPositionPass);

    shaderProgramVerAndDiagBlurPass.textureCoordAttribute = gl.getAttribLocation(shaderProgramVerAndDiagBlurPass, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgramVerAndDiagBlurPass.textureCoordAttribute);

    shaderProgramVerAndDiagBlurPass.samplerUniform = gl.getUniformLocation(shaderProgramVerAndDiagBlurPass, "uSampler");

    shaderProgramVerAndDiagBlurPass.invViewCoordinatesUniform = gl.getUniformLocation(shaderProgramVerAndDiagBlurPass, "uInvViewDimensions");

    shaderProgramVerAndDiagBlurPass.angleUniform = gl.getUniformLocation(shaderProgramVerAndDiagBlurPass, "uAngle");

    gl.bindBuffer(gl.ARRAY_BUFFER, screenFillingVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgramVerAndDiagBlurPass.vertexPositionAttribute, screenFillingVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, screenFillingTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgramVerAndDiagBlurPass.textureCoordAttribute, screenFillingTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.uniform2f(shaderProgramVerAndDiagBlurPass.invViewCoordinatesUniform, invViewDimensions_x, invViewDimensions_y);
    gl.uniform1f(shaderProgramVerAndDiagBlurPass.angleUniform, Angle);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureBackBufferHalf);
    gl.uniform1i(shaderProgramVerAndDiagBlurPass.samplerUniform, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, screenFillingIndexBuffer);
    gl.drawElements(gl.TRIANGLES, screenFillingIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function drawRhombiBlurPassOptimized() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
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

    gl.uniform2f(shaderProgramRhombiBlurPass.invViewCoordinatesUniform, invViewDimensions_x, invViewDimensions_y);
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

function transformGeometry( transformVec, scaleVec) 
{
    var aux = mat4.create();
    mat4.identity(aux);

    mat4.translate(mMatrix, mMatrix, [transformVec[0], transformVec[1], transformVec[2]]);
    mat4.fromScaling(aux, [scaleVec[0], scaleVec[1], scaleVec[2]]);
    mat4.multiply(mMatrix, mMatrix, aux);
}