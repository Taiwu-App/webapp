import bindthis from '@/decorators/bindthis';

type CallBackType = (payload: any) => any;

export default class MessageChannel {
  private events: {
    [eventName: string]: CallBackType[];
  } = {};

  @bindthis
  public subscribe(eventName: string, handler: CallBackType): void {
    if (!this.isListenerExists(eventName)) { this.events[eventName] = []; }
    this.events[eventName].push(handler);
  }

  @bindthis
  public unsubscribe(eventName: string, handler: CallBackType): void {
    if (!this.isListenerExists(eventName)) { return; }
    this.events[eventName] = this.events[eventName].filter(cb => cb !== handler);
  }

  @bindthis
  public publish(eventName: string, payload: any): void {
    if (!this.isListenerExists(eventName)) { return; }
    this.events[eventName].forEach(cb => cb(payload));
  }

  @bindthis
  private isListenerExists(eventName: string): boolean {
    return this.events[eventName] !== undefined && this.events[eventName].length > 0;
  }
}