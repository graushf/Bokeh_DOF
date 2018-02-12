var CoCNode, AngleNode;

function initStatistics() {
    var CoCElement = document.getElementById("CoCId");
    var AngleElement = document.getElementById("AngleId");

    CoCNode = document.createTextNode("");
    AngleNode = document.createTextNode("");

    CoCElement.appendChild(CoCNode);
    AngleElement.appendChild(AngleNode);
}

function handleStatistics() {
    var _CoCValue = CoC;
    var _AngleValue = (Angle * 180.0) / Math.PI;

    CoCNode.nodeValue = _CoCValue.toFixed(2);
    AngleNode.nodeValue = _AngleValue.toFixed(2);
}