import {observer} from 'mobx-react';
import * as React from 'react';

import { VillageMap } from '@/models/village-map';
import MessageChannel from '@/utils/message-channel';
import moduleStore from '../module-store';
import BoardComponent from './component';

export interface IBoardProp {
  channel: MessageChannel;
}

export interface IBoardState {
  board: VillageMap;
  isDragging: boolean;
}

const size: number[] = [13, 13];

@observer
export default class Board extends React.Component<IBoardProp,IBoardState> {
  constructor(props: any) {
    super(props);
    this.state = {
      board: new VillageMap(size[0], size[1]),
      isDragging: false
    };
  }

  public render() {
    return (
      <BoardComponent
        board={ this.state.board }
        cellSize={ moduleStore.cellSize }
        isDragging={ this.state.isDragging }
      />
    );
  }
}