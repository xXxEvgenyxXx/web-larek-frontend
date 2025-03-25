export class NotificationManager {
    showMessage(message: string, type: "success" | "error" = "success") {
      alert(`[${type.toUpperCase()}] ${message}`);
    }
  }