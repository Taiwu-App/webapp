export enum EBookType {
  music,
  confucian,
  medicine,
  // 制木
  woodCarving,
  go,
  buddhism,
  poison,
  // 锻造
  forging,
  literature,
  math,
  cooking,
  // 巧匠
  jadeCarving,
  painting,
  // 鉴赏
  evaluation,
  // 杂学
  mixed,
  clothing
}

export interface IBook {
  name: string;
  level: number;
  type: EBookType;
}

export class Book implements IBook {
  constructor(
    public readonly name: string,
    public readonly level: number,
    public readonly type: EBookType
  ){}
}