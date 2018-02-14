function PlotCoC(aperture, focallength, focalplane, znear, zfar)
    cocscale = (aperture * focallength * focalplane * (zfar - znear)) / ((focalplane - focallength) * znear * zfar);
    cocbias = (aperture * focallength * (znear - focalplane)) / ((focalplane - focallength) * znear);
    
    cocscale
    cocbias
    
    f = figure;
    
    p = uipanel('Parent', f, 'BorderType', 'none');
    %p.Title = 'Focalplane: ' + focalplane;
    p.Title = sprintf('Focalplane: %.2f', focalplane);
    p.TitlePosition = 'centertop';
    p.FontSize = 12;
    p.FontWeight = 'bold';
    
    z = 0:0.1:zfar;
    zBuffer = (z - znear) / (zfar - znear);
    
    subplot(2, 2, 1, 'Parent', p);
    plot(z, zBuffer);
    title('zBuffer');
    xlabel('z world space');
    ylabel('zbuffer value');
    
    zBufferNonLinear = ((1./z - 1/znear)) ./ ((1/zfar) - (1/znear));
    
    subplot(2, 2, 2, 'Parent', p);
    plot(z, zBufferNonLinear);
    title('zBuffer Non Linear');
    xlabel('z world space');
    ylabel('zbuffer value');
    
    coc = abs(zBuffer * cocscale + cocbias);
    
    subplot(2, 2, 3, 'Parent', p);
    plot(z, coc);
    title('CoC Linear Depth Buffer');
    xlabel('z world space');
    ylabel('CoC quantity value');
    
    coc = abs(zBufferNonLinear * cocscale + cocbias);
    
    subplot(2, 2, 4, 'Parent', p);
    plot(z, coc);
    title('CoC Non Linear Depth Buffer');
    xlabel('z world space');
    ylabel('CoC quantity value');
    
    %x = 0:pi/100:2*pi;
    %y = sin(x);
    %plot(x,y);
end