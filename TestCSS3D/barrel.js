var DRUM_TEXTURE = "http://keithclark.co.uk/labs/css-fps/drum2.png";
var faces = [];
// Assembiles are for grouping faces and other assembiles
function createAssembly() {
    var assembly = document.createElement("div");
    assembly.className = "threedee assembly";
    return assembly;
}

function createFace(w, h, x, y, z, rx, ry, rz, tsrc, tx, ty) {
    var face = document.createElement("div");
    faces.push({
        element: face,
        translate: {
            x: x,
            y: y,
            z: z
        },
        rx: rx,
        ry: ry,
        rz: rz
    });
    face.className = "threedee face";
    face.style.cssText = "background: url(" + tsrc + ") -" + tx.toFixed(2) + "px " + ty.toFixed(2) + "px;" +
        "width:" + w.toFixed(2) + "px;" +
        "height:" + h.toFixed(2) + "px;" +
        "margin-top: -" + (h / 2).toFixed(2) + "px;" +
        "margin-left: -" + (w / 2).toFixed(2) + "px;" +
        "transform: translate3d(" + x.toFixed(2) + "px," + y.toFixed(2) + "px," + z.toFixed(2) + "px)" +
        "rotateX(" + rx.toFixed(2) + "rad) rotateY(" + ry.toFixed(2) + "rad) rotateZ(" + rz.toFixed(2) + "rad);";
    return face;
}

function createSVGFace(w, h, x, y, z, rx, ry, rz, tsrc, tx, ty, odd, id) {
    var faceWrapper,
        face,
        def,
        linear,
        stop,
        xmlns = "http://www.w3.org/2000/svg",
        xmlnsxLink = "http://www.w3.org/1999/xlink";

    faceWrapper = document.createElementNS(xmlns, "svg");

    faceWrapper.setAttributeNS(null, "width", w);
    faceWrapper.setAttributeNS(null, "height", h);
    if (odd) {
        faceWrapper.setAttributeNS(null, "class", "odd threedee face");
    } else {
        faceWrapper.setAttributeNS(null, "class", "even threedee face");
    }

    def = faceWrapper.appendChild(document.createElementNS(xmlns, "defs"));

    linear = def.appendChild(document.createElementNS(xmlns, "pattern"));

    linear.setAttributeNS(null, "id", "img" + id);
    linear.setAttributeNS(null, "patternUnits", "userSpaceOnUse");
    linear.setAttributeNS(null, "width", 312);
    linear.setAttributeNS(null, "height", 298);

    stop = linear.appendChild(document.createElementNS(xmlns, "image"));

    stop.setAttributeNS(xmlnsxLink, "href", "drum2.png");

    stop.setAttributeNS(null, "x", -tx.toFixed(2));
    stop.setAttributeNS(null, "y", -ty.toFixed(2));
    stop.setAttributeNS(null, "width", 312);
    stop.setAttributeNS(null, "height", 298);

    face = faceWrapper.appendChild(document.createElementNS(xmlns, "polygon"));
    

    var points;
    
    if(odd){
        points = '0, 0  0, ' + h + ' ' + w + ', ' + h;
    } else {
        points = '-1, 0  ' + w + ' 0 ' + w + ', ' + h + ' ' + w + ', ' + h;
    }

    face.setAttributeNS(null, "points", points);
    face.setAttributeNS(null, "fill", "url(#img" + id + ")");


    faceWrapper.className = "threedee face";
    faceWrapper.style.cssText =        "width:" + w.toFixed(2) + "px;" +
        "height:" + h.toFixed(2) + "px;" +
        "margin-top: -" + (h / 2).toFixed(2) + "px;" +
        "margin-left: -" + (w / 2).toFixed(2) + "px;" +
        "transform: translate3d(" + x.toFixed(2) + "px," + y.toFixed(2) + "px," + z.toFixed(2) + "px)" +
        "rotateX(" + rx.toFixed(2) + "rad) rotateY(" + ry.toFixed(2) + "rad) rotateZ(" + rz.toFixed(2) + "rad);";

    return faceWrapper;

    //var face = document.createElement("div");
    //faces.push({
    //    element: face,
    //    translate: {
    //        x: x,
    //        y: y,
    //        z: z
    //    },
    //    rx: rx,
    //    ry: ry,
    //    rz: rz
    //});
    //face.className = "threedee face";
    //face.style.cssText = "background: url(" + tsrc + ") -" + tx.toFixed(2) + "px " + ty.toFixed(2) + "px;" +
    //    "width:" + w.toFixed(2) + "px;" +
    //    "height:" + h.toFixed(2) + "px;" +
    //    "margin-top: -" + (h / 2).toFixed(2) + "px;" +
    //    "margin-left: -" + (w / 2).toFixed(2) + "px;" +
    //    "transform: translate3d(" + x.toFixed(2) + "px," + y.toFixed(2) + "px," + z.toFixed(2) + "px)" +
    //    "rotateX(" + rx.toFixed(2) + "rad) rotateY(" + ry.toFixed(2) + "rad) rotateZ(" + rz.toFixed(2) + "rad);";
    //return face;
}

function createTube(dia, height, sides, texture) {
    var tube = createAssembly();
    var sideAngle = (Math.PI / sides) * 2;
    var sideLen = dia * Math.tan(Math.PI / sides);
    var idCount = 0;
    for (var c = 0; c < sides; c++) {
        var x = Math.sin(sideAngle * c) * dia / 2;
        var z = Math.cos(sideAngle * c) * dia / 2;
        var ry = Math.atan2(x, z);
        tube.appendChild(createSVGFace(sideLen + 1, height, x, 0, z, 0, ry, 0, texture, sideLen * c, 0, true, idCount++));
        tube.appendChild(createSVGFace(sideLen + 1, height, x, 0, z, 0, ry, 0, texture, sideLen * c, 0, false, idCount++));
    }
    return tube;
}

function createBarrel() {
    var barrel = createTube(100, 196, 30, DRUM_TEXTURE);
    barrel.appendChild(createFace(100, 100, 0, -98, 0, Math.PI / 2, 0, 0, DRUM_TEXTURE, 0, 100));
    barrel.appendChild(createFace(100, 100, 0, 98, 0, -Math.PI / 2, 0, 0, DRUM_TEXTURE, 0, 100));
    return barrel;
}

var barrel = document.body.appendChild(createBarrel());

var rotY = 0;

function updateItems() {
    faces.forEach(function (item) {
        item.ry = rotY;
        var rotateMatrix = createFromYawPitchRoll(item.ry, item.rx, item.rz);
        var translation = createTranslation([item.translate.x, item.translate.y, item.translate.z]);
        var matrix = multiply(rotateMatrix, translation);

        var m = "matrix3d(" + matrix[0] + ", " + matrix[1] + ", " + matrix[2] + ", " + matrix[3] + ", " +
                              matrix[4] + ", " + matrix[5] + ", " + matrix[6] + ", " + matrix[7] + ", " +
                              matrix[8] + ", " + matrix[9] + ", " + matrix[10] + ", " + matrix[11] + ", " +
                              matrix[12] + ", " + matrix[13] + ", " + matrix[14] + ", " + matrix[15] + ")";

        item.element.style.transform = m;
    });
}

function render() {
    requestAnimationFrame(render);

    rotY += 0.005;

    //updateFaces();
}

//render();

function createFromYawPitchRoll(yaw, pitch, roll) {
    var quaternion = [],
        num9 = roll * 0.5,
        num6 = Math.sin(num9),
        num5 = Math.cos(num9),
        num8 = pitch * 0.5,
        num4 = Math.sin(num8),
        num3 = Math.cos(num8),
        num7 = yaw * 0.5,
        num2 = Math.sin(num7),
        num = Math.cos(num7);
    quaternion[0] = ((num * num4) * num5) + ((num2 * num3) * num6);
    quaternion[1] = ((num2 * num3) * num5) - ((num * num4) * num6);
    quaternion[2] = ((num * num3) * num6) - ((num2 * num4) * num5);
    quaternion[3] = ((num * num3) * num5) + ((num2 * num4) * num6);

    num9 = quaternion[0] * quaternion[0];
    num8 = quaternion[1] * quaternion[1];
    num7 = quaternion[2] * quaternion[2];
    num6 = quaternion[0] * quaternion[1];
    num5 = quaternion[2] * quaternion[3];
    num4 = quaternion[2] * quaternion[0];
    num3 = quaternion[1] * quaternion[3];
    num2 = quaternion[1] * quaternion[2];
    num = quaternion[0] * quaternion[3];

    var matrix = [];
    matrix[0] = 1 - (2 * (num8 + num7));
    matrix[1] = 2 * (num6 + num5);
    matrix[2] = 2 * (num4 - num3);
    matrix[3] = 0;
    matrix[4] = 2 * (num6 - num5);
    matrix[5] = 1 - (2 * (num7 + num9));
    matrix[6] = 2 * (num2 + num);
    matrix[7] = 0;
    matrix[8] = 2 * (num4 + num3);
    matrix[9] = 2 * (num2 - num);
    matrix[10] = 1 - (2 * (num8 + num9));
    matrix[11] = 0;
    matrix[12] = 0;
    matrix[13] = 0;
    matrix[14] = 0;
    matrix[15] = 1;
    return matrix;
}

function createTranslation(vector3) {
    var matrix = [];
    matrix[0] = 1;
    matrix[1] = 0;
    matrix[2] = 0;
    matrix[3] = 0;
    matrix[4] = 0;
    matrix[5] = 1;
    matrix[6] = 0;
    matrix[7] = 0;
    matrix[8] = 0;
    matrix[9] = 0;
    matrix[10] = 1;
    matrix[11] = 0;
    matrix[12] = vector3[0];
    matrix[13] = vector3[1];
    matrix[14] = vector3[2];
    matrix[15] = 1;
    return matrix;
}

function multiply(matrix1, matrix2) {
    var matrix = [];
    matrix[0] = (((matrix1[0] * matrix2[0]) + (matrix1[1] * matrix2[4])) + (matrix1[2] * matrix2[8])) + (matrix1[3] * matrix2[12]);
    matrix[1] = (((matrix1[0] * matrix2[1]) + (matrix1[1] * matrix2[5])) + (matrix1[2] * matrix2[9])) + (matrix1[3] * matrix2[13]);
    matrix[2] = (((matrix1[0] * matrix2[2]) + (matrix1[1] * matrix2[6])) + (matrix1[2] * matrix2[10])) + (matrix1[3] * matrix2[14]);
    matrix[3] = (((matrix1[0] * matrix2[3]) + (matrix1[1] * matrix2[7])) + (matrix1[2] * matrix2[11])) + (matrix1[3] * matrix2[15]);
    matrix[4] = (((matrix1[4] * matrix2[0]) + (matrix1[5] * matrix2[4])) + (matrix1[6] * matrix2[8])) + (matrix1[7] * matrix2[12]);
    matrix[5] = (((matrix1[4] * matrix2[1]) + (matrix1[5] * matrix2[5])) + (matrix1[6] * matrix2[9])) + (matrix1[7] * matrix2[13]);
    matrix[6] = (((matrix1[4] * matrix2[2]) + (matrix1[5] * matrix2[6])) + (matrix1[6] * matrix2[10])) + (matrix1[7] * matrix2[14]);
    matrix[7] = (((matrix1[4] * matrix2[3]) + (matrix1[5] * matrix2[7])) + (matrix1[6] * matrix2[11])) + (matrix1[7] * matrix2[15]);
    matrix[8] = (((matrix1[8] * matrix2[0]) + (matrix1[9] * matrix2[4])) + (matrix1[10] * matrix2[8])) + (matrix1[11] * matrix2[12]);
    matrix[9] = (((matrix1[8] * matrix2[1]) + (matrix1[9] * matrix2[5])) + (matrix1[10] * matrix2[9])) + (matrix1[11] * matrix2[13]);
    matrix[10] = (((matrix1[8] * matrix2[2]) + (matrix1[9] * matrix2[6])) + (matrix1[10] * matrix2[10])) + (matrix1[11] * matrix2[14]);
    matrix[11] = (((matrix1[8] * matrix2[3]) + (matrix1[9] * matrix2[7])) + (matrix1[10] * matrix2[11])) + (matrix1[11] * matrix2[15]);
    matrix[12] = (((matrix1[12] * matrix2[0]) + (matrix1[13] * matrix2[4])) + (matrix1[14] * matrix2[8])) + (matrix1[15] * matrix2[12]);
    matrix[13] = (((matrix1[12] * matrix2[1]) + (matrix1[13] * matrix2[5])) + (matrix1[14] * matrix2[9])) + (matrix1[15] * matrix2[13]);
    matrix[14] = (((matrix1[12] * matrix2[2]) + (matrix1[13] * matrix2[6])) + (matrix1[14] * matrix2[10])) + (matrix1[15] * matrix2[14]);
    matrix[15] = (((matrix1[12] * matrix2[3]) + (matrix1[13] * matrix2[7])) + (matrix1[14] * matrix2[11])) + (matrix1[15] * matrix2[15]);
    return matrix;
}