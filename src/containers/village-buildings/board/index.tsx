import * as React from 'react';

import bindthis from '@/decorators/bindthis';
import draggable from '@/decorators/draggable';
import { IDraggableStore } from '@/decorators/draggable/store';
import { IPlaceholder } from '@/models/buildings';
import { IGridInfo } from '@/models/village-map';
import { createDraggablePlaceholder } from '../placeholder';
import './style.less';

export interface IBoardStore {
  boardHeight: number;
  boardWidth: number;
  cellSize: number;
  grids: IGridInfo[][];
  numberRows: number;
  numberColumns: number;
  tableRef: React.RefObject<HTMLTableElement>;

  offsetRatio: (offset: number) => void;
}

export interface IModuleStore {
  boardStore: IBoardStore;

  handleDragStart: (props: IPlaceholder, store: IDraggableStore, rowIdx?: number, columnIdx?: number) => any;
  placeholderDragEnd: (ev: MouseEvent, store: IDraggableStore) => void;
}

export interface IBoardProps {
  store: IModuleStore;
}

@draggable()
export default class Board extends React.Component<IBoardProps> {
  private readonly tableRef: React.RefObject<HTMLTableElement> = React.createRef();
  private readonly localStore: IBoardStore;

  constructor(props: IBoardProps) {
    super(props);
    this.localStore = this.props.store.boardStore;
  }

  public componentDidMount() {
    this.localStore.tableRef = this.tableRef;
  }
  public render() {
    const { boardWidth: width, boardHeight: height, grids } = this.localStore;
    return (
      <table
        className="build-plan__board"
        onWheel={this.handleWheelZoom}
        ref={this.tableRef}
      >
        <tbody style={{ height, width, display: 'block'}}>
          { grids.map(this.renderRow) }
        </tbody>
      </table>
    );
  }

  @bindthis
  private renderRow(row: IGridInfo[], rowIdx: number): React.ReactNode {
    const heightRatio = `${100 / this.localStore.numberRows}%`;
    return (
      <tr
        key={rowIdx}
        className="build-plan__board-row"
        style={{ height: heightRatio }}
      >
        { row.map((r, columnIdx) => this.renderCell(r, rowIdx, columnIdx)) }
      </tr>
    );
  }

  @bindthis
  private renderCell(grid: IGridInfo, rowIdx: number, columnIdx: number): React.ReactNode {
    const className = `build-plan__board-cell`;
    // if (this.props.isDragging) {
    //   className += ` ${grid.status}`;
    //   className += ` ${grid.isAllow ? 'allow' : 'forbidden'}`;
    // }
    const widthRatio = `${100 / this.localStore.numberColumns}%`;
    return (
      <td
        key={columnIdx}
        className={className}
        style={{ width: widthRatio}}
      >
        {this.renderPlaceholder(grid.placeholder, rowIdx, columnIdx)}
      </td>
    );
  }

  @bindthis
  private renderPlaceholder(props: IPlaceholder | null, rowIdx: number, columnIdx: number) {
    if (props === null) { return null; }
    const node = createDraggablePlaceholder({
      info: props,
      size: this.localStore.cellSize
    }, {
      onDragEnd: this.props.store.placeholderDragEnd,
      onDragStart: (ev, store) => {
        this.props.store.handleDragStart(props, store, rowIdx, columnIdx);
      }
    });
    return node;
  }
  
  @bindthis
  private handleWheelZoom(ev: React.WheelEvent<HTMLTableElement>) {
    ev.preventDefault();
    const offset = ev.deltaY > 0 ? -10 : 10;
    this.localStore.offsetRatio(offset);
  }
}