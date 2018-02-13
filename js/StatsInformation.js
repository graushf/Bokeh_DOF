var CoCNode, AngleNode;
var ApertureNode, focalplaneNode, focallengthNode;

function initStatistics() {
    var CoCElement = document.getElementById("CoCId");
    var AngleElement = document.getElementById("AngleId");

    var ApertureElement = document.getElementById("ApertureId");
    var focalplaneElement = document.getElementById("FocalplaneId");
    var focallengthElement = document.getElementById("FocallengthId");

    CoCNode = document.createTextNode("");
    AngleNode = document.createTextNode("");

    ApertureNode = document.createTextNode("");
    focalplaneNode = document.createTextNode("");
    focallengthNode = document.createTextNode("");

    CoCElement.appendChild(CoCNode);
    AngleElement.appendChild(AngleNode);

    ApertureElement.appendChild(ApertureNode);
    focalplaneElement.appendChild(focalplaneNode);
    focallengthElement.appendChild(focallengthNode);
}

function handleStatistics() {
    var _CoCValue = CoC;
    var _AngleValue = (Angle * 180.0) / Math.PI;

    var _ApertureValue = aperture;
    var _focalplaneValue = focalplane;
    var _focallengthValue = focallength;

    CoCNode.nodeValue = _CoCValue.toFixed(2);
    AngleNode.nodeValue = _AngleValue.toFixed(2);

    ApertureNode.nodeValue = _ApertureValue.toFixed(2);
    focalplaneNode.nodeValue = _focalplaneValue.toFixed(2) + "m";
    focallengthNode.nodeValue = _focallengthValue.toFixed(2) +"m";
}