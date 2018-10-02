import * as React from 'react';

import bindthis from '@/decorators/bindthis';
import { IGridInfo, VillageMap } from '@/models/village-map';
import './style.less';

interface IProp {
  board: VillageMap;
  // length and width of a cell
  cellSize: number;
  isDragging: boolean;
}

export default class BoardComponent extends React.Component<IProp> {
  public render() {
    const width = this.props.cellSize * this.props.board.columns;
    const height = this.props.cellSize * this.props.board.rows;
    return (
      <table className="build-plan__board">
        <tbody style={{ height, width, display: 'block'}}>
          { this.props.board.grids.vals.map(this.renderRow) }
        </tbody>
      </table>
    );
  }

  @bindthis
  private renderRow(row: IGridInfo[], idx: number): React.ReactNode {
    const heightRatio = `${100 / this.props.board.rows}%`;
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
    let className = `build-plan__board-cell`;
    if (this.props.isDragging) {
      className += ` ${grid.status}`;
      className += ` ${grid.isAllow ? 'allow' : 'forbidden'}`;
    }
    const widthRatio = `${100 / this.props.board.columns}%`;
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
