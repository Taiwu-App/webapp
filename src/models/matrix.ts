export default class Matrix<T> {
  public readonly vals: T[][];

  constructor(public readonly rows: number, public readonly columns: number,
    initialValue: any | ((i: number, j: number) => any) = null) {
      this.vals = [];
      for (let i = 0; i < rows; i++) {
        this.vals.push([]);
        for (let j = 0; j < columns; j++) {
          if (this.isFunction(initialValue)) {
            this.vals[i].push(initialValue(i, j));
          } else {
            this.vals[i].push(initialValue);
          }
        }
      }
  }

  private isFunction(functionToCheck: any): boolean {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
  }
}