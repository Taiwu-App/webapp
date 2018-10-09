import { action, computed, observable } from 'mobx';

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
  [EUsages.production]: '提升制品质量',
  [EUsages.attainments]: '降低造诣要求',
  [EUsages.materials]: '材料',
  [EUsages.others]: '其他'
};

export type filterKeys = 'types' | 'usages' | 'disciplines';
export type checkboxStatus = boolean | 'intermediate';
export enum EType { buildings, landscapes }
const allUsages: EUsages[] = Object.keys(EUsages).map(s => parseInt(s, 10)).filter(n => !isNaN(n));
const allDisciplines = Object.keys(EBookType) as EBookType[];

export default class FilterStore implements IFilterStore {
  @observable public usages: EUsages[] = allUsages;
  @computed public get allUsagesCheck(): checkboxStatus {
    return this.allCheckboxStatus(this.usages, allUsages.length);
  }
  @observable public disciplines: EBookType[] = allDisciplines;
  @computed public get allDisciplinesCheck(): checkboxStatus {
    return this.allCheckboxStatus(this.disciplines, allDisciplines.length);
  }
  @observable public name: string = '';
  @observable public types: EType[] = [EType.buildings, EType.landscapes];
  @computed public get allTypesCheck(): checkboxStatus {
    return this.allCheckboxStatus(this.types, 2);
  }

  private allCheckboxStatus<T>(variable: T[], total: number): checkboxStatus {
    if (variable.length === 0) { return false; }
    else if (variable.length === total) { return true; }
    else { return 'intermediate'; }
  }
  @action.bound public handleCheckBoxChange(key: any, section: filterKeys, currentVal: boolean) {
    const array = this[section] as any;
    if (section === 'usages') { key = parseInt(key, 10); }
    if (currentVal === true) {
      array.remove(key);
    } else if (currentVal === false) {
      array.push(key);
    }
  }
  @action.bound public handleCheckAllChange(section: filterKeys) {
    const array = this[section] as any;
    const currentVal = this[`all${section.charAt(0).toUpperCase()}${section.slice(1)}Check`] as checkboxStatus;
    if (currentVal === true) {
      array.clear();
    } else {
      // false or intermediate
      let initialValue: any[];
      if (section === 'usages') { initialValue = allUsages; }
      else if (section === 'disciplines') { initialValue = allDisciplines; }
      else { initialValue = [EType.buildings, EType.landscapes]; }
      array.replace(initialValue);
    }
  }
}