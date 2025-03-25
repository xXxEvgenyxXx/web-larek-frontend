export class PaymentManager {
    private paymentMethod: "online" | "cash" = "online";
  
    setPaymentMethod(method: "online" | "cash") {
      this.paymentMethod = method;
    }
  
    getPaymentMethod(): "online" | "cash" {
      return this.paymentMethod;
    }
  }