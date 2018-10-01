import * as React from 'react';

import { VillageMap } from '@/models/village-map';
import BoardComponent from './component';


export interface IBoardState {
  board: VillageMap;
  isDragging: boolean;
  cellSize: number;
}

const size: number[] = [13, 13];

export default class Board extends React.Component<{},IBoardState> {
  constructor(props: any) {
    super(props);
    this.state = {
      board: new VillageMap(size[0], size[1]),
      cellSize: 64,
      isDragging: false
    };
  }

  public render() {
    return (
      <BoardComponent
        board={ this.state.board }
        cellSize={ this.state.cellSize }
        isDragging={ this.state.isDragging }
      />
    );
  }
}