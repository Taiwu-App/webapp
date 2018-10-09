import { action, computed, observable } from 'mobx';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import buildings from '@/assets/data/buildings';
import SliderStore, { ISliderStore } from '@/components/slider/store';
import { IBuilding } from '@/models/buildings';
import { ISideBarStore } from '../side-bar';
import Filter, { IFilterStore } from '../side-bar/filters';
import FilterStore from './filter';

export default class SideBarStore implements ISideBarStore {
  @observable public readonly sliderStore: ISliderStore;
  @observable public readonly filterStore: IFilterStore;

  @observable public barHeight: number = 0;
  @computed public get listHeight(): number {
    return this.barHeight - 42;
  }
  @observable public scrollDistance: number = 0;

  @observable public isFilterDisplay: boolean = false;
  private _filterModalContainer: HTMLDivElement;
  private get filterModalContainer() {
    if (this._filterModalContainer === undefined) {
      this._filterModalContainer = document.createElement('div');
      document.getElementsByTagName('body')[0].appendChild(this._filterModalContainer);
    }
    return this._filterModalContainer;
  }
  // buildings and landscapes
  private readonly buildings: IBuilding[] = buildings;
  @computed get filteredBuildings() {
    const { types, usages } = this.filterStore;
    let results = this.buildings.filter(b => types.indexOf(b.discipline) > -1);
    results = results.filter(b => {
      for (const u of b.usages) {
        if (usages.indexOf(u) > -1) { return true; }
      }
      return false;
    });
    return results;
  }
  @computed get filteredPlaceholders() {
    return [...this.filteredBuildings];
  }

  constructor() {
    this.sliderStore = new SliderStore();
    this.filterStore = new FilterStore();
  }

  @computed public get isZoomBarDragging(): boolean {
    return this.sliderStore.isDragging;
  }
  @computed public get zoomRatio(): number {
    return this.sliderStore.ratio;
  }
  @action.bound public setZoomRatio(ratio: number) {
    this.sliderStore.setRatio(ratio);
  }
  @action.bound public offsetRatio(offset: number) {
    this.sliderStore.setRatio(this.zoomRatio + offset);
  }
  @action.bound public handleListScroll({ deltaY }: { deltaY: number }) {
    this.scrollDistance += deltaY;
    const maxDistance = Math.ceil(this.filteredPlaceholders.length / 2) * 80 - this.barHeight + 42;
    if (this.scrollDistance < 0) { this.scrollDistance = 0; }
    if (this.scrollDistance > maxDistance) { this.scrollDistance = maxDistance; }
  }

  @action.bound public toggleFilterDisplay(): void {
    this.isFilterDisplay = !this.isFilterDisplay;
    if (this.isFilterDisplay) {
      const node = React.createElement(Filter, { sidebarStore: this });
      ReactDOM.render(node, this.filterModalContainer);
      setTimeout(() => this.filterModalContainer.children[0].classList.add('animation'));
    } else {
      this.filterModalContainer.children[0].classList.remove('animation');
    }
  }
}