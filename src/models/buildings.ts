import { Book } from './book';

// functions of the building
export enum EUsages {
  // 钱
  gold,
  // 声望
  fame,
  // 人
  pop,
  // 学习
  study,
  // 修习
  practice,
  // 突破
  breakthrough,
  // 工具
  tool,
  // 造诣
  attainments,
  // 材料
  materials,
  // 其他
  others
}

export enum EPlaceholderType {
  building,
  landscape
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

export interface IPlaceholderStyle {
  color: string;
  backgroundColor: string;
  borderColor: string;
}
// accepted constructor input, only [a-zA-Z] is allowed in uniqueTag
export interface IPlaceholder {
  description: string;
  icon: string;
  isArtificial: boolean;
  name: string;
  style: IPlaceholderStyle;
  rarity: number;
  uniqueTag: string;

  rowIdx?: number;
  columnIdx?: number;
}

export abstract class Placeholder implements IPlaceholder {
  public readonly description: string;
  public readonly rarity: number;
  public readonly style: IPlaceholderStyle;
  protected type: EPlaceholderType;

  public get isArtificial() { return this.type === EPlaceholderType.building; }

  constructor(public readonly icon: string, public readonly name: string, public readonly uniqueTag: string, other: any = {}) {
    const { description = '', rarity = 9, style = {} } = other;
    this.description = description;
    this.rarity = rarity;
    const { color = 'black', backgroundColor = 'white', borderColor = 'black' } = style;
    this.style = { color, backgroundColor, borderColor };
  }
}

export interface ILandscape extends IPlaceholder {
  something?: any;
}

export class Landscape extends Placeholder implements ILandscape {
  constructor(icon: string, name: string, tag: string, other: any) {
    super(icon, name, tag, other);
    this.type = EPlaceholderType.landscape;
  }
}

export interface IBuilding extends IPlaceholder {
  book?: Book;
  usages: EUsages[];
  limitations: ILimitation[];
}

export class Building extends Placeholder implements IBuilding {
  public readonly book: Book | undefined;
  public readonly usages: EUsages[];
  public readonly limitations: ILimitation[];
  constructor(icon: string, name: string, tag: string, other: any) {
    super(icon, name, tag, other);
    this.type = EPlaceholderType.building;
    const { usages = [], limitations = [], book } = other;
    this.book = book;
    this.usages = usages;
    this.limitations = limitations;
  }
}
