import * as React from 'react';

import bindthis from '@/decorators/bindthis';
import { IGridInfo, VillageMap } from '@/models/village-map';
import './style.less';

interface IProp {
  board: VillageMap;
  cellSize: number;
  isDragging: boolean;
}

export default class BoardComponent extends React.Component<IProp> {
  public render() {
    return (
      <table className="build-plan__board">
        { this.props.board.grids.vals.map(this.renderRow) }
      </table>
    );
  }

  @bindthis
  private renderRow(row: IGridInfo[], idx: number): React.ReactNode {
    return (
      <tr key={idx} className="build-plan__board-row">
        { row.map(this.renderCell) }
      </tr>
    );
  }

  @bindthis
  private renderCell(grid: IGridInfo, idx: number): React.ReactNode {
    const placeholder = grid.placeholder;
    const text = placeholder === null ? '' : placeholder.name;
    let className = `build-plan__board-cell`;
    if (this.props.isDragging) {
      className += ` ${grid.status}`;
      className += ` ${grid.isAllow ? 'allow' : 'forbidden'}`;
    }
    return (
      <td
        key={idx}
        className={className}
        style={{ height: this.props.cellSize, width: this.props.cellSize}}
      >
        {text}
      </td>
    );
  }
}
