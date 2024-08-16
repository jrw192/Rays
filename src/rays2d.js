var wallPaths = [];
for (var i = 0; i < 5; i++) {
    var start = new Point(Math.floor(Math.random() * 1000),
    Math.floor(Math.random() * 1000));
    var end = new Point(Math.floor(Math.random() * 1000),
    Math.floor(Math.random() * 1000));
    var path = new Path(start, end);
    path.strokeColor = 'blue';
    path.strokeWidth = 3;
    wallPaths.push(path);
}

var numLines = 48;
var deg = 360 / numLines;


var centerPoint = new Point(view.center);
var intersectionPaths = [];
var rayPath = new Path();
rayPath.strokeColor = 'black';
rayPath.strokeWidth = 0.5;

rayPath = createRays(centerPoint);
   
view.onMouseMove = (e) => {
    resetPaths();
    var centerPoint = new Point(e.point.x, e.point.y);
    rayPath = createRays(centerPoint, rayPath);
}

function createRays(centerPoint) {
    var paths = new Path();
    paths.strokeColor='black';
    paths.strokeWidth=0.5;
    for (var i = 0; i < numLines; i++) {
        var vector = buildVector(centerPoint, i);
        var ray = new Path(centerPoint, centerPoint+vector);
        paths.add(centerPoint, centerPoint+vector);
    }
    return paths;
}

function buildVector(centerPoint, i) {
    var vector = new Point(centerPoint);
    vector.length = 1000;
    vector.angle += deg * i;
   
    //trim vector
    var testPath = new Path(centerPoint, centerPoint+vector);
    testPath.visible = false;
    var intersections = [];
    for (var wall of wallPaths) {
        intersections.push(...wall.getIntersections(testPath));
    }
   
    if (intersections.length > 0) {
        // get the closest point
        var lengths = intersections.map((inter) => {
            var pt = inter.point;
            var len = (pt - centerPoint).length;
            return len;
        });
        var minLength = Math.min(...lengths);
        vector.length = minLength;
        intersectionPaths.push(new Path.Circle({
            center: vector+centerPoint,
            radius: 3,
            fillColor: 'red',
        }));
    }
    return vector;
}

function resetPaths() {
    rayPath.remove();
    for (var int of intersectionPaths) {
        int.remove();
    }
    intersectionPaths = [];
}