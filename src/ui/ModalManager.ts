export class ModalManager {
    private modals: { [key: string]: HTMLElement } = {};
  
    registerModal(name: string, element: HTMLElement) {
      this.modals[name] = element;
    }
  
    openModal(name: string) {
      if (this.modals[name]) {
        this.modals[name].classList.add("open");
      }
    }
  
    closeModal(name: string) {
      if (this.modals[name]) {
        this.modals[name].classList.remove("open");
      }
    }
  }