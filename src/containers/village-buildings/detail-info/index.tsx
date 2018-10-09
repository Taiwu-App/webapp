import { observer } from 'mobx-react';
import * as React from 'react';

import { Book, EBookType } from '@/models/book';
import { IBuilding, IPlaceholder } from '@/models/buildings';
import { usageDicts } from '../stores/filter';
import './style.less';

interface IProps {
  info: IPlaceholder | null;
}

@observer
export default class DetailInfo extends React.Component<IProps> {
  public static defaultProps: IProps = {
    info: null
  };

  private get type(): string {
    if (this.props.info === null) { return '未知'; }
    else if (this.props.info.isArtificial) { return '建筑'; }
    else { return '资源'; }
  }
  private get discipline(): string {
    const discipline = (this.props.info as IBuilding).discipline as any;
    if (discipline === undefined) { return '无'; }
    return EBookType[discipline];
  }
  private get bookInfo(): string {
    let book = (this.props.info as IBuilding).book;
    if (book === undefined) { book = {} as Book; }
    const { name = '无' } = book;
    if (name === '无') { return name; }
    return `${name} (${book.level}品)`;
  }
  private get usages(): string {
    if (this.props.info === null) { return '未知'; }
    else if (!this.props.info.isArtificial) { return '收集资源'; }
    return (this.props.info as IBuilding).usages
    .map(u => usageDicts[u]).join(', ');
  }
  public render() {
    if (this.props.info === null) { return null; }
    return (
      <article className="build-plan-detail__container">
        <h2 className="build-plan-detail__name">
          {this.props.info.name}
        </h2>
        <section className="build-plan-detail__section build-plan-detail__section--types">
          <span className="build-plan-detail__text">种类: <strong>{this.type}</strong></span>
          <span className="build-plan-detail__text">所属: <strong>{this.discipline}</strong></span>
          <span className="build-plan-detail__text">要求书籍: <strong>{this.bookInfo}</strong></span>
        </section>
        <section className="build-plan-detail__section build-plan-detail__section--usage">
          <span className="build-plan-detail__text">用途: <strong>{this.usages}</strong></span>
        </section>
      </article>
    );
  }
}