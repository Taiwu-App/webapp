import * as React from 'react';

import bindthis from '@/decorators/bindthis';
import { VillageMap } from '@/models/village-map';
import MessageChannel from '@/utils/message-channel';
import MessageEvents, { IGridSizeChangePayload } from '../message-events';
import BoardComponent from './component';

export interface IBoardProp {
  channel: MessageChannel;
}

export interface IBoardState {
  board: VillageMap;
  isDragging: boolean;
  cellSize: number;
}

const size: number[] = [13, 13];

export default class Board extends React.Component<IBoardProp,IBoardState> {
  // cell size limits for zooming
  private minCellSize: number = 16;
  private maxCellSize: number = 128;

  constructor(props: any) {
    super(props);
    this.state = {
      board: new VillageMap(size[0], size[1]),
      cellSize: 32,
      isDragging: false
    };
    this.props.channel.subscribe(MessageEvents.gridSizeChange.toString(), this.gridSizeChange);
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

  @bindthis
  private gridSizeChange(payloads: IGridSizeChangePayload) {
    const { ratio } = payloads;
    const cellSize = (this.maxCellSize - this.minCellSize) * ratio / 100 + this.minCellSize;
    // difference is too small to update the rendering
    if (Math.abs(cellSize - this.state.cellSize) < 1 ) { return; }
    this.setState({
      ...this.state,
      cellSize
    });
  }
}