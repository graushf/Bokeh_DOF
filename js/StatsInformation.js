var CoCNode, AngleNode;
var ApertureNode, focalplaneNode, focallengthNode;
var CoCScaleNode, CoCBiasNode;
var DepthDebugNode;

function initStatistics() {
    var CoCElement = document.getElementById("CoCId");
    var AngleElement = document.getElementById("AngleId");

    var ApertureElement = document.getElementById("ApertureId");
    var focalplaneElement = document.getElementById("FocalplaneId");
    var focallengthElement = document.getElementById("FocallengthId");

    var CoCScaleElement = document.getElementById("CoCScaleId");
    var CoCBiasElement = document.getElementById("CoCBiasId");

    var DepthDebugElement = document.getElementById("DepthDebugId");

    CoCNode = document.createTextNode("");
    AngleNode = document.createTextNode("");

    ApertureNode = document.createTextNode("");
    focalplaneNode = document.createTextNode("");
    focallengthNode = document.createTextNode("");

    CoCScaleNode = document.createTextNode("");
    CoCBiasNode = document.createTextNode("");

    DepthDebugNode = document.createTextNode("");

    CoCElement.appendChild(CoCNode);
    AngleElement.appendChild(AngleNode);

    ApertureElement.appendChild(ApertureNode);
    focalplaneElement.appendChild(focalplaneNode);
    focallengthElement.appendChild(focallengthNode);

    CoCScaleElement.appendChild(CoCScaleNode);
    CoCBiasElement.appendChild(CoCBiasNode);

    DepthDebugElement.appendChild(DepthDebugNode);
}

function handleStatistics() {
    var _CoCValue = CoC;
    var _AngleValue = (Angle * 180.0) / Math.PI;

    var _ApertureValue = aperture;
    var _focalplaneValue = focalplane;
    var _focallengthValue = focallength;

    var _CoCScaleValue = CoCScale;
    var _CoCBiasValue = CoCBias;

    var _DepthDebug = DepthDebug;

    CoCNode.nodeValue = _CoCValue.toFixed(2);
    AngleNode.nodeValue = _AngleValue.toFixed(2);

    ApertureNode.nodeValue = _ApertureValue.toFixed(2);
    focalplaneNode.nodeValue = _focalplaneValue.toFixed(3) + " world units";
    focallengthNode.nodeValue = _focallengthValue.toFixed(5) +"meters";

    CoCScaleNode.nodeValue = _CoCScaleValue.toFixed(4);
    CoCBiasNode.nodeValue = _CoCBiasValue.toFixed(4);

    DepthDebugNode.nodeValue = _DepthDebug.toFixed(3);
}