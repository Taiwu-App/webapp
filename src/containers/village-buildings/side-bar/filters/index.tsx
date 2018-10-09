import { observer } from 'mobx-react';
import * as React from 'react';

import BaseCheckbox from '@/components/check-box/base';
import FullHeightModal from '@/components/modals/full-height-modal';
import { EBookType } from '@/models/book';
import { EUsages } from '@/models/buildings';
import { checkboxStatus, EType, filterKeys, usageDicts } from '../../stores/filter';
import { ISideBarStore } from '../index';
import './style.less';

export interface IFilterStore {
  usages: EUsages[];
  disciplines: EBookType[];
  name: string;
  types: EType[];
  allUsagesCheck: checkboxStatus;
  allTypesCheck: checkboxStatus;
  allDisciplinesCheck: checkboxStatus;

  handleCheckBoxChange: (key: string, section: filterKeys, currentVal: boolean) => any;
  handleCheckAllChange: (section: filterKeys) => any;
}

interface IProp {
  sidebarStore: ISideBarStore;
}

@observer
export default class FilterModal extends React.Component<IProp> {
  public render() {
    const { toggleFilterDisplay, filterStore} = this.props.sidebarStore;
    const { allUsagesCheck, allDisciplinesCheck, allTypesCheck, handleCheckAllChange, handleCheckBoxChange, types } = filterStore;
    return (
      <FullHeightModal className="filter-modal__container">
        <header className="filter-modal__header-wrapper">
          <h4 className="filter-modal__header-text">建筑/资源筛选器</h4>
          <i
            className="filter-modal__header-icon--close clickable"
            onClick={toggleFilterDisplay}
          />
        </header>
        <main className="filter-modal__body">
          {/* usage-section start */}
          <section className="filter-modal__section">
            <div className="filter-modal__section-header">
              <BaseCheckbox                
                className="filter-modal__checkbox--all"
                value={allUsagesCheck}
                onClick={handleCheckAllChange.bind(filterStore, 'usages')}
              >
                <h6 className="filter-modal__section-title">用途</h6>
              </BaseCheckbox>
            </div>
            <div className="filter-modal__section-content">
              {this.renderUsages()}
            </div>
          </section>
          {/* usage-section end */}
          {/* disciplines-section start */}
          <section className="filter-modal__section">
            <div className="filter-modal__section-header">
              <BaseCheckbox                
                className="filter-modal__checkbox--all"
                value={allDisciplinesCheck}
                onClick={handleCheckAllChange.bind(filterStore, 'disciplines')}
              >
                <h6 className="filter-modal__section-title">学科</h6>
              </BaseCheckbox>
            </div>
            <div className="filter-modal__section-content">
              {this.renderDisciplines()}
            </div>
          </section>
          {/* disciplines-section end */}
          {/* types-section start */}
          <section className="filter-modal__section">
            <div className="filter-modal__section-header">
              <BaseCheckbox                
                className="filter-modal__checkbox--all"
                value={allTypesCheck}
                onClick={handleCheckAllChange.bind(filterStore, 'types')}
              >
                <h6 className="filter-modal__section-title">种类</h6>
              </BaseCheckbox>
            </div>
            <div className="filter-modal__section-content">
              <BaseCheckbox
                className="filter-modal__checkbox"
                value={types.length !==0 && types.indexOf(EType.buildings) > -1}
                onClick={handleCheckBoxChange.bind(filterStore, EType.buildings, 'types')}
              >
                建筑
              </BaseCheckbox>
              <BaseCheckbox
                className="filter-modal__checkbox"
                value={types.length !==0 && types.indexOf(EType.landscapes) > -1}
                onClick={handleCheckBoxChange.bind(filterStore, EType.landscapes, 'types')}
              >
                自然资源
              </BaseCheckbox>
            </div>
          </section>
          {/* types-section end */}
        </main>
      </FullHeightModal>
    );
  }

  private renderUsages() {
    const { filterStore } = this.props.sidebarStore;
    const { handleCheckBoxChange, usages } = filterStore;
    const keys = Object.keys(usageDicts);
    return keys.map(k => {
      const value = usages.indexOf(parseInt(k, 10)) > -1;
      return (
        <BaseCheckbox
          className="filter-modal__checkbox"
          key={k}
          value={value}
          onClick={handleCheckBoxChange.bind(filterStore, k, 'usages')}
        >
          {usageDicts[k]}
        </BaseCheckbox>
      );
    });
  }

  public renderDisciplines() {
    const { filterStore } = this.props.sidebarStore;
    const { handleCheckBoxChange, disciplines } = filterStore;
    const keys = Object.keys(EBookType);
    return keys.map(k => {
      const value = disciplines.indexOf(k as EBookType) > -1;
      return (
        <BaseCheckbox
          className="filter-modal__checkbox"
          key={k}
          value={value}
          onClick={handleCheckBoxChange.bind(filterStore, k, 'disciplines')}
        >
          {EBookType[k]}
        </BaseCheckbox>
      );
    });
  }
}