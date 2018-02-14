function cocbias = CoCBias(aperture, focallength, focalplane, znear)
    cocbias = (aperture * focallength * (znear - focalplane)) / ((focalplane - focallength) * znear);
end