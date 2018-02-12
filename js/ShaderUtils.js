var shaderProgramBasic;
var shaderProgramPhongLightingPass;
var shaderProgramBackgroundPass;
var shaderProgramScreenFillPass2;

function getShader(gl, id) 
{
	var shaderScript = document.getElementById(id);
	if (!shaderScript) {
		return null;
	}

	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			str += k.textContent;
		}
		k = k.nextSibling;
	}

	var shader;
	if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type = "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}

	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

function setupShadersScene() 
{
	initShaderBasic();
	initShaderPhongLightingPass();
	initShaderScreenFillPass();
	shaderProgramScreenFillPass2();
}

function initShaderBasic() 
{
    var fragmentShader = getShader(gl, "basic-shader-fs");
    var vertexShader = getShader(gl, "basic-shader-vs");

    shaderProgramBasic = gl.createProgram();
    gl.attachShader(shaderProgramBasic, vertexShader);
    gl.attachShader(shaderProgramBasic, fragmentShader);
    gl.linkProgram(shaderProgramBasic);

    if (!gl.getProgramParameter(shaderProgramBasic, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
}

function initShaderPhongLightingPass()
{
	var fragmentShader = getShader(gl, "phongLightingPass-fs");
	var vertexShader = getShader(gl, "phongLightingPass-vs");

	shaderProgramPhongLightingPass = gl.createProgram();
	gl.attachShader(shaderProgramPhongLightingPass, vertexShader);
	gl.attachShader(shaderProgramPhongLightingPass, fragmentShader);
	gl.linkProgram(shaderProgramPhongLightingPass);

	if (!gl.getProgramParameter(shaderProgramPhongLightingPass, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}
}

function initShaderScreenFillPass()
{
	var fragmentShader = getShader(gl, "drawBackgroundPass-fs");
	var vertexShader = getShader(gl, "drawBackgroundPass-vs");

	shaderProgramBackgroundPass = gl.createProgram();
	gl.attachShader(shaderProgramBackgroundPass, vertexShader);
	gl.attachShader(shaderProgramBackgroundPass, fragmentShader);
	gl.linkProgram(shaderProgramBackgroundPass);

	if (!gl.getProgramParameter(shaderProgramBackgroundPass, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}
}

function shaderProgramScreenFillPass2()
{
	var fragmentShader = getShader(gl, "screenFillPass2-fs");
	var vertexShader = getShader(gl, "screenFillPass2-vs");

	shaderProgramScreenFillPass2 = gl.createProgram();
	gl.attachShader(shaderProgramScreenFillPass2, vertexShader);
	gl.attachShader(shaderProgramScreenFillPass2, fragmentShader);
	gl.linkProgram(shaderProgramScreenFillPass2);

	if (!gl.getProgramParameter(shaderProgramScreenFillPass2, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}
}