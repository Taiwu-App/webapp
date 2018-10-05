export default class Coordinate2D {
  constructor(private _x: number = 0, private _y: number = 0) {}
  get x(){ return this._x; }
  get y(){ return this._y; }

  public distanceTo(pt: Coordinate2D) {
    const squaredDistance = (pt.x - this.x) ** 2 + (pt.y - this.y) ** 2;
    return Math.sqrt(squaredDistance);
  }

  public minus(pt: Coordinate2D): Coordinate2D {
    return new Coordinate2D(this.x - pt.x, this.y - pt.y);
  }

  public plus(pt: Coordinate2D): Coordinate2D {
    return new Coordinate2D(this.x + pt.x, this.y + pt.y);
  }

  public offset(dx: number, dy: number): void {
    this._x += dx;
    this._y += dy;
  }

  public clone(): Coordinate2D {
    return new Coordinate2D(this.x, this.y);
  }
}