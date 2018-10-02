export default class Coordinate2D {
  constructor(private _x: number = 0, private _y: number = 0) {}
  get x(){ return this._x; }
  get y(){ return this._y; }

  public distanceTo(pt: Coordinate2D) {
    const squaredDistance = (pt.x - this.x) ** 2 + (pt.y - this.y) ** 2;
    return Math.sqrt(squaredDistance);
  }
}