'use strict';

const _ = require('lodash');
const utm = require('utm');

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(p) {
        return new Point(this.x + p.x, this.y + p.y);
    }

    subtract(p) {
        return new Point(this.x - p.x, this.y - p.y);
    }

    scale(d) {
        return new Point(this.x * d, this.y * d);
    }

    rotate(alpha) {
        return new Point(this.x * Math.cos(alpha) - this.y * Math.sin(alpha), this.x * Math.sin(alpha) + this.y * Math.cos(alpha));
    }

    rotate(alpha, center) {
        return this.subtract(center).rotate(alpha).add(center);
    }

    distance(p) {
        const dx = this.x - p.x;
        const dy = this.y - p.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    cross(p) {
        return this.x * p.y - this.y * p.x;
    }
}

class Segment {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }

    /**
     * Find a point Q that divides the segment into ratio a/b
     */
    divider(a, b) {
        return this.p1.scale(b).add(this.p2.scale(a)).scale(1 / (a + b));
    }

    midpoint() {
        return this.divider(1, 1);
    }
}

class Line {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }

    intersection(s2) {
        const x1 = this.p1.x - this.p2.x;
        const x2 = s2.p1.x - s2.p2.x;
        const y1 = this.p1.y - this.p2.y;
        const y2 = s2.p1.y - s2.p2.y;
        const cross1 = this.p1.cross(this.p2);
        const cross2 = s2.p1.cross(s2.p2);
        const det = x1 * y2 - x2 * y1;
        return new Point(
            (cross1 * x2 - cross2 * x1) / det,
            (cross1 * y2 - cross2 * y1) / det
        );
    }
}

class Circle {
    constructor(center, r) {
        this.center = center;
        this.r = r;
    }
}

const midpointOfIntersection = (c1, c2) => {
    const segment = new Segment(c1.center, c2.center);
    return segment.divider(c1.r, c2.r);
};

const circumcenter = (p, q, r) => {
    console.log(`P: ${JSON.stringify(p)}`);
    console.log(`Q: ${JSON.stringify(p)}`);
    console.log(`R: ${JSON.stringify(p)}`);
    const pq = (new Segment(p, q)).midpoint();
    const qr = (new Segment(q, r)).midpoint();
    console.log(`PQ: ${JSON.stringify(pq)}`);
    console.log(`QR: ${JSON.stringify(qr)}`);
    const lineBisectorPQ = new Line(p.rotate(Math.PI / 2, pq), q.rotate(Math.PI / 2, pq));
    const lineBisectorQR = new Line(q.rotate(Math.PI / 2, qr), r.rotate(Math.PI / 2, qr));
    return lineBisectorPQ.intersection(lineBisectorQR);
};

const triangleArea = (p, q, r) => {
    return 0.5 * Math.abs(p.x * q.y + q.x * r.y + r.x * p.y - p.y * q.x - q.y * r.x - r.y * p.x);
};

const circumradius = (p, q, r) => {
    return p.distance(q) * q.distance(r) * r.distance(p) / (4 * triangleArea(p, q, r));
};

const circumcircle = (p, q, r) => {
    return new Circle(circumcenter(p, q, r), circumradius(p, q, r));
};

const dilaterationCartesian = (c1, c2) => {
    const p = midpointOfIntersection(c1, c2);
    const d = c1.center.distance(c2.center);
    let r = Math.abs(c1.r + c2.r - d) / 2;
    if (c1.r + d < c2.r) {
        r = c1.r;
    }
    if (c2.r + d < c1.r) {
        r = c2.r;
    }
    console.log(`r1 = ${c1.r}, r2 = ${c2.r}, d = ${d} => r = ${r}`);
    return new Circle(p, r);
};

const multilaterationCartesian = (circles) => {
    const n = circles.length;
    let c = circles[0], i;
    for (i = 1; i < n; ++i) {
        c = dilaterationCartesian(c, circles[i]);
    }
    console.log(`multilaterate: ${JSON.stringify(c)}`);
    return c;
};

const trilaterationCartesian = (c1, c2, c3) => {
    console.log(`C1: ${JSON.stringify(c1)}`);
    console.log(`C2: ${JSON.stringify(c2)}`);
    console.log(`C3: ${JSON.stringify(c3)}`);
    // find midpoint of intersections of each pair of circles
    const p = midpointOfIntersection(c1, c2);
    const q = midpointOfIntersection(c2, c3);
    const r = midpointOfIntersection(c3, c1);
    const g = p.add(q).add(r).scale(1/3);

    return circumcircle(p, q, r);
};

const utmToPoint = (utm) => {
    return new Point(utm.easting, utm.northing);
};

const multilateration = (coords) => {
    const utms = _.map(coords, (coord) => utm.fromLatLon(coord.latitude, coord.longitude));
    const cs = _.map(utms, (utm, i) => new Circle(utmToPoint(utm), coords[i].accuracy));
    const c = multilaterationCartesian(cs);
    console.log(`utms: ${JSON.stringify(utms)}`);
    const latlon = utm.toLatLon(c.center.x, c.center.y, utms[0].zoneNum, utms[0].zoneLetter);
    return {
        latitude: latlon.latitude,
        longitude: latlon.longitude,
        accuracy: c.r
    };
};

const trilateration = (coord1, coord2, coord3) => {
    console.log(`COORD1: ${JSON.stringify(coord1)}`);
    console.log(`COORD2: ${JSON.stringify(coord2)}`);
    console.log(`COORD3: ${JSON.stringify(coord3)}`);
    const utm1 = utm.fromLatLon(coord1.latitude, coord1.longitude);
    const utm2 = utm.fromLatLon(coord2.latitude, coord2.longitude);
    const utm3 = utm.fromLatLon(coord3.latitude, coord3.longitude);

    console.log(`UTM1: ${JSON.stringify(utm1)}`);
    console.log(`UTM2: ${JSON.stringify(utm2)}`);
    console.log(`UTM3: ${JSON.stringify(utm3)}`);

    const c1 = new Circle(utmToPoint(utm1), coord1.accuracy);
    const c2 = new Circle(utmToPoint(utm2), coord2.accuracy);
    const c3 = new Circle(utmToPoint(utm3), coord3.accuracy);

    const c = trilaterationCartesian(c1, c2, c3);

    const latlon = utm.toLatLon(c.center.x / 1000, c.center.y / 1000, utm1.zoneNum, utm1.zoneLetter);
    return {
        latitude: latlon.latitude,
        longitude: latlon.longitude,
        accuracy: c.r
    };
};

module.exports = {
    Point,
    Segment,
    Line,
    Circle,
    trilaterationCartesian,
    trilateration,
    multilaterationCartesian,
    multilateration
};
