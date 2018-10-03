import {observer} from 'mobx-react';
import * as React from 'react';

import bindthis from '@/decorators/bindthis';
import { IGridInfo } from '@/models/village-map';

export interface IBoardStore {
  boardHeight: number;
  boardWidth: number;
  grids: IGridInfo[][];
  numberRows: number;
  numberColumns: number;
}

export interface IBoardProps {
  store: IBoardStore;
}

@observer
export default class Board extends React.Component<IBoardProps> {
  public render() {
    const { boardWidth: width, boardHeight: height, grids } = this.props.store;
    return (
      <table className="build-plan__board">
        <tbody style={{ height, width, display: 'block'}}>
          { grids.map(this.renderRow) }
        </tbody>
      </table>
    );
  }

  @bindthis
  private renderRow(row: IGridInfo[], idx: number): React.ReactNode {
    const heightRatio = `${100 / this.props.store.numberRows}%`;
    return (
      <tr
        key={idx}
        className="build-plan__board-row"
        style={{ height: heightRatio }}
      >
        { row.map(this.renderCell) }
      </tr>
    );
  }

  @bindthis
  private renderCell(grid: IGridInfo, idx: number): React.ReactNode {
    const placeholder = grid.placeholder;
    const text = placeholder === null ? '' : placeholder.name;
    const className = `build-plan__board-cell`;
    // if (this.props.isDragging) {
    //   className += ` ${grid.status}`;
    //   className += ` ${grid.isAllow ? 'allow' : 'forbidden'}`;
    // }
    const widthRatio = `${100 / this.props.store.numberColumns}%`;
    return (
      <td
        key={idx}
        className={className}
        style={{ width: widthRatio}}
      >
        {text}
      </td>
    );
  }
}