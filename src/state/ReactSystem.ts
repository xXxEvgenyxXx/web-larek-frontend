export class ReactiveSystem {
    private state: any = {};
    private listeners: { [key: string]: Function[] } = {};
  
    setState(key: string, value: any) {
      this.state[key] = value;
      if (this.listeners[key]) {
        this.listeners[key].forEach((callback) => callback(value));
      }
    }
  
    getState(key: string): any {
      return this.state[key];
    }
  
    subscribe(key: string, callback: Function) {
      if (!this.listeners[key]) {
        this.listeners[key] = [];
      }
      this.listeners[key].push(callback);
    }
  }