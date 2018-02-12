function setupMRT() {
    ext3 = gl.getExtension('WEBGL_draw_buffers');
    if (!ext3) {
        alert("WEBGL_draw_buffers not supported");
    } else {
        console.log("MAX_COLOR_ATTACHMENTS_WEBGL: " +gl.getParameter(ext3.MAX_COLOR_ATTACHMENTS_WEBGL));
        console.log("MAX_DRAW_BUFFERS_WEBGL: " + gl.getParameter(ext3.MAX_DRAW_BUFFERS_WEBGL));

        MRTfbData = create_framebuffer_MRT(gl.viewportWidth/downsampleCoefficient, gl.viewportHeight/downsampleCoefficient);
    }
}

function create_framebuffer_MRT(width, height) {
    var ext = gl.getExtension('OES_texture_float');
    var ext2 = gl.getExtension('OES_texture_float_linear');

    var frameBuffer = gl.createFramebuffer();

    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

    var fTexture = [];

    for (var i = 0; i < 2; ++i) {
        fTexture[i] = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, fTexture[i]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, null);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, ext3.COLOR_ATTACHMENT0_WEBGL + i, gl.TEXTURE_2D, fTexture[i], 0);
    }

    var depthRenderBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    return {
        f: frameBuffer,
        d: depthRenderBuffer,
        t: fTexture
    };
}