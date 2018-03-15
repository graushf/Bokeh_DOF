var currentlyPressedKeys = {};

function handleKeyDown(event) {
    console.log(event.keyCode);
    currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
    if (event.keyCode == 16) {
        myCamera.MovementSpeed = 3.0;
    }
}

function handleKeys() {
    // FORWARD
    if (currentlyPressedKeys[87]) {
        myCamera.ProcessKeyboard(0, deltaTime);
    }
    // BACKWARD
    if (currentlyPressedKeys[83]) {
        myCamera.ProcessKeyboard(1, deltaTime);
    }
    // RIGHT
    if (currentlyPressedKeys[68]) {
        myCamera.ProcessKeyboard(3, deltaTime);
    }
    // LEFT
    if (currentlyPressedKeys[65]) {
        myCamera.ProcessKeyboard(2, deltaTime); 
    }
    if (currentlyPressedKeys[27]) {
        enableMouse = !enableMouse;
    }
    if (currentlyPressedKeys[82]) {
		//if (cocScaler < 1.0) {
			cocScaler += 0.01;
		//}
	}
	if (currentlyPressedKeys[70]) {
		if (cocScaler > 0.01) {
			cocScaler -= 0.01;
		}
	}

	if (currentlyPressedKeys[84]) {
		if (Angle < 6.2800) {
			Angle += 0.05;
		}
	}
	if (currentlyPressedKeys[71]) {
		if (Angle > 0.05) {
			Angle -= 0.05;
		}
    }

    if (currentlyPressedKeys[85]) {
		if (aperture < 5000) {
			aperture += 0.5;
		}
	}
	if (currentlyPressedKeys[74]) {
		if (aperture > 0.05) {
			aperture -= 0.5;
		}
    }
    
    if (currentlyPressedKeys[73]) {
		if (focalplane < myCamera.GetFarValue()) {
			focalplane += 0.1;
		}
	}
	if (currentlyPressedKeys[75]) {
		if (focalplane > 0.1) {
			focalplane -= 0.1;
		}
    }
    
    if (currentlyPressedKeys[79]) {
		if (focallength < 5.0) {
			focallength += 0.0001;
		}
	}
	if (currentlyPressedKeys[76]) {
		if (focallength > 0.001) {
			focallength -= 0.0001;
		}
    }

    if (currentlyPressedKeys[16]) {
        myCamera.MovementSpeed = 0.03;
    }    

    if (currentlyPressedKeys[50]) {
        if (DepthDebug < myCamera.GetFarValue()) {
            DepthDebug += 0.1;
        }
    }

    if (currentlyPressedKeys[49]) {
        if (DepthDebug > 0.1) {
            DepthDebug -= 0.1;
        }
    }

    if (currentlyPressedKeys[67]) {
        debugCamera();
    }
}

var xoffset;
var yoffset;
var xpos;
var ypos;

function handleMouseMove(event) {
    xpos = event.clientX;
    ypos = event.clientY;

    if (enableMouse && mouseDown)  {

        if (firstMouse) {
            lastX = xpos;
            lastY = ypos;
            firstMouse = false;
        }

        xoffset = xpos - lastX;
        yoffset = lastY - ypos; // Reversed since y-coordinates go from bottom to left

        lastX = xpos;
        lastY = ypos;

        myCamera.ProcessMouseMovement(xoffset, yoffset, true);
    }
}

function handleMouseDown(event) {
    mouseDown = true;

    lastX = xpos;
    lastY = ypos;
}

function handleMouseUp(event) {
    mouseDown = false;
}
