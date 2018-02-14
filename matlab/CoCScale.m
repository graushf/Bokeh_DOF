function cocscale = CoCScale(A, focallength, focalplane, znear, zfar) 
    cocscale = (A * focallength .* focalplane * (zfar - znear)) / ((focalplane - focallength) * znear * zfar);
end