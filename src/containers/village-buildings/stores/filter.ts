import { computed, observable } from 'mobx';

import { EBookType } from '@/models/book';
import { EUsages } from '@/models/buildings';
import { IFilterStore } from '../side-bar/filters';

export const usageDicts: {[key: number]: string} = {
  [EUsages.gold]: '金钱',
  [EUsages.fame]: '威望',
  [EUsages.pop]: '人',
  [EUsages.study]: '学习',
  [EUsages.practice]: '降低修习消耗',
  [EUsages.breakthrough]: '降低突破消耗',
  [EUsages.tool]: '器具',
  [EUsages.attainments]: '降低造诣',
  [EUsages.materials]: '材料',
  [EUsages.others]: '其他'
};

export const typesStr = Object.keys(EBookType).map(k => EBookType[k]);
export const usagesStr = Object.keys(usageDicts).map(k => usageDicts[k]);
export default class FilterStore implements IFilterStore {
  @observable public usages: EUsages[] = typesStr;
  @computed public get allUsagesCheck(): boolean | 'intermediate' {
    return this.allCheckboxStatus(this.usages, typesStr.length);
  }
  @observable public types: EBookType[] = usagesStr;
  @computed public get allTypesCheck(): boolean | 'intermediate' {
    return this.allCheckboxStatus(this.types, usagesStr.length);
  }
  @observable public name: string = '';
  @observable public isArtificial: 'yes' | 'no' | 'all' = 'all';

  private allCheckboxStatus<T>(variable: T[], reference: number): boolean | 'intermediate' {
    if (variable.length === 0) { return false; }
    else if (variable.length === reference) { return true; }
    else { return 'intermediate'; }
  }
}