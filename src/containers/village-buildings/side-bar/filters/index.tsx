import { observer } from 'mobx-react';
import * as React from 'react';

import FullHeightModal from '@/components/modals/full-height-modal';
import { EBookType } from '@/models/book';
import { EUsages } from '@/models/buildings';
import { ISideBarStore } from '../index';
import './style.less';

export interface IFilterStore {
  usages: EUsages[];
  types: EBookType[];
  name: string;
  isArtificial: 'yes' | 'no' | 'all';
}

interface IProp {
  sidebarStore: ISideBarStore;
}

@observer
export default class FilterModal extends React.Component<IProp> {
  public render() {
    const { toggleFilterDisplay } = this.props.sidebarStore;
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
          <section className="filter-modal__section filter-modal__section--usage">
            <h6>用途</h6>
            
          </section>
        </main>
      </FullHeightModal>
    );
  }
}