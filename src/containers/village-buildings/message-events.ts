enum MessageEvents {
  gridSizeChange,
  mapMovingModeChange,
  DOMDraggingStatusChange
}

export interface IGridSizeChangePayload {
  // ratio \in [0, 100]
  ratio: number;
}

export default MessageEvents;