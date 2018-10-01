export default class Coordinate {
  constructor(private _x: number, private _y: number) {}
  get x(){ return this._x; }
  get y(){ return this._y; }
}