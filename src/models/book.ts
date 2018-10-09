export enum EBookType {
  music = '音律',
  confucian = '道学',
  medicine = '医术',
  woodCarving = '制木',
  go = '弈棋',
  buddhism = '佛学',
  poison = '毒术',
  forging = '锻造',
  literature = '文学',
  math = '数术',
  cooking = '厨艺',
  jadeCarving = '巧匠',
  painting = '绘画',
  evaluation = '品鉴',
  mixed = '杂学',
  clothing = '刺绣',
  kongfu = '武功',
  others = '其他'
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