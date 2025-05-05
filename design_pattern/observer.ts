interface Observer<T> {
  update(data: T): void;
}

interface Order {
  orderId: number;
  customerName: string;
  isVIP: boolean;
  items: { productId: string; quantity: number }[];
}

class InventoryManager implements Observer<Order> {
  update(order: Order): void {
    console.log(`[Inventory] Updating stock for order #${order.orderId}...`);
    order.items.forEach(item => {
      console.log(`- Product: ${item.productId}, Quantity: ${item.quantity}`);
    });
  }
}

class ShippingService implements Observer<Order> {
  update(order: Order): void {
    console.log(`[Shipping] Preparing order #${order.orderId} for ${order.customerName} to ship.`);
  }
}

class VIPNotifier implements Observer<Order> {
  update(order: Order): void {
    if (order.isVIP) {
      console.log(`[VIP Notifier] Special notification sent to VIP customer: ${order.customerName}.`);
    }
  }
}

class OrderSystem {
  private observers: Observer<Order>[] = [];

  attach(observer: Observer<Order>) {
    this.observers.push(observer);
  }

  detach(observer: Observer<Order>) {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(order: Order) {
    this.observers.forEach(observer => observer.update(order));
  }

  receiveNewOrder(order: Order) {
    console.log(`📦 New order received: #${order.orderId}`);
    this.notify(order);
  }
}

// Example usage
const system = new OrderSystem();

system.attach(new InventoryManager());
system.attach(new ShippingService());
system.attach(new VIPNotifier());

system.receiveNewOrder({
  orderId: 101,
  customerName: "John Smith",
  isVIP: false,
  items: [
    { productId: "apple", quantity: 3 },
    { productId: "pear", quantity: 2 }
  ]
});

system.receiveNewOrder({
  orderId: 102,
  customerName: "Sarah Johnson",
  isVIP: true,
  items: [
    { productId: "banana", quantity: 5 }
  ]
});
