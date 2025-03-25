export class AppState {
    loading: boolean = false;
    error: string | null = null;
    modalOpen: boolean = false;
  
    setLoading(state: boolean) {
      this.loading = state;
    }
  
    setError(message: string | null) {
      this.error = message;
    }
  
    setModal(state: boolean) {
      this.modalOpen = state;
    }
  }