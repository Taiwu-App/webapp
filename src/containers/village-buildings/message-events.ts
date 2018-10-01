enum MessageEvents {
  gridSizeChange,
  mapMovingModeChange,
  DOMDraggingStatusChange
}

export interface IGridSizeChangePayload {
  mode: 'in' | 'out';
}

export default MessageEvents;