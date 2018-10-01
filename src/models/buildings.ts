// functions of the building
export enum EFunction {
  // 钱
  gold,
  // 声望
  fame,
  // 人口
  pop,
  // 资历减免
  expDiscount,
  // 其他
  others
}

// book requirement
export interface IBookInfo {
  exp: number;
  name: string;
}

export enum ELimitation {
  neighbor,
  unique
}
// limitation of the position of the placeholder
export interface ILimitation {
  type: ELimitation;
  requiredName?: string;
}

// accepted constructor input
export interface IPlaceholder {
  description: string;
  icon?: string;
  name: string;
}
export abstract class Placeholder implements IPlaceholder {
  public readonly description: string;
  public readonly icon: string;
  public readonly name: string;

  constructor(params: IPlaceholder) {
    const { description = '', icon = '', name = '' } = params;
    this.description = description;
    this.icon = icon;
    this.name = name;
  }
}

// export interface ILandScape extends IPlaceholder {
//   rarity: 'n' | 'r' | 'sr';
// }

// export class LandScape extends Placeholder implements ILandScape {
//   public readonly rarity: 'n' | 'r' | 'sr';
// }

export interface IBuilding extends IPlaceholder {
  bookInfo?: IBookInfo;
  functions?: EFunction[];
  limitations?: ILimitation[];
}

export class Building extends Placeholder implements IBuilding {
  public readonly bookInfo: IBookInfo | undefined;
  public readonly functions: EFunction[];
  public readonly limitations: ILimitation[];
  constructor(params: IBuilding) {
    super(params);
    this.bookInfo = params.bookInfo;
    const { functions = [], limitations = [] } = params;
    if (functions.length === 0) { this.functions = [EFunction.others]; }
    else { this.functions = functions; }
    this.limitations = limitations;
  }
}
