export class LoadingManager {
    private static instance: LoadingManager;
    private loadingState: boolean = false;
  
    private constructor() {}
  
    static getInstance(): LoadingManager {
      if (!LoadingManager.instance) {
        LoadingManager.instance = new LoadingManager();
      }
      return LoadingManager.instance;
    }
  
    setLoading(state: boolean) {
      this.loadingState = state;
      document.body.classList.toggle("loading", state);
    }
  
    isLoading(): boolean {
      return this.loadingState;
    }
  }