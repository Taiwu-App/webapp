declare module '@/assets/data/books.csv' {
  export interface IRawBookData {
    level: string;
    name: string;
    type: string;
  }
  const _a: IRawBookData[];
  export default _a;
}

declare module '@/assets/data/landscapes.csv' {
  export interface IRawLandscape {
    tag: string;
    icon: string;
    name: string;
    rarity: string;
  }
  const _a: IRawLandscape[];
  export default _a;
}

declare module '@/assets/data/buildings.csv' {
  export interface IRawBuilding {
    tag: string;
    icon: string;
    name: string;
    usages: string;
    type: string;
    limits: string;
    book: string;
    brief: string;
    limitsInfo: string;
    usagesInfo: string;
  }
  const _a: IRawBuilding[];
  export default _a;
}

declare module '*.json' {
  const _a: any;
  export default _a;
}