// Size Enum
enum Size {
  Tall = 'Tall',     // Small
  Grande = 'Grande', // Medium
  Venti = 'Venti',   // Large
}

// Base Beverage Component
abstract class Beverage {
  protected description = 'Unknown Beverage';
  private size: Size = Size.Tall;

  getDescription(): string {
    return this.description;
  }

  setSize(size: Size): void {
    this.size = size;
  }

  getSize(): Size {
    return this.size;
  }

  abstract cost(): number;
}

// Concrete Beverages
class Espresso extends Beverage {
  constructor() {
    super();
    this.description = 'Espresso';
  }

  cost(): number {
    return 1.99;
  }
}

class HouseBlend extends Beverage {
  constructor() {
    super();
    this.description = 'House Blend Coffee';
  }

  cost(): number {
    return 0.89;
  }
}

class DarkRoast extends Beverage {
  constructor() {
    super();
    this.description = 'Dark Roast Coffee';
  }

  cost(): number {
    return 0.99;
  }
}

class Decaf extends Beverage {
  constructor() {
    super();
    this.description = 'Decaf Coffee';
  }

  cost(): number {
    return 1.05;
  }
}

// Base Decorator
abstract class CondimentDecorator extends Beverage {
  abstract beverage: Beverage;

  getSize(): Size {
    return this.beverage.getSize();
  }

  setSize(size: Size): void {
    this.beverage.setSize(size);
  }

  abstract getDescription(): string;
}

// Concrete Decorators
class Milk extends CondimentDecorator {
  constructor(public beverage: Beverage) {
    super();
  }

  getDescription(): string {
    return this.beverage.getDescription() + ', Milk';
  }

  cost(): number {
    const baseCost = this.beverage.cost();
    const size = this.getSize();
    const extra = size === Size.Tall ? 0.10 : size === Size.Grande ? 0.15 : 0.20;
    return baseCost + extra;
  }
}

class Mocha extends CondimentDecorator {
  constructor(public beverage: Beverage) {
    super();
  }

  getDescription(): string {
    return this.beverage.getDescription() + ', Mocha';
  }

  cost(): number {
    const baseCost = this.beverage.cost();
    const size = this.getSize();
    const extra = size === Size.Tall ? 0.20 : size === Size.Grande ? 0.25 : 0.30;
    return baseCost + extra;
  }
}

class Soy extends CondimentDecorator {
  constructor(public beverage: Beverage) {
    super();
  }

  getDescription(): string {
    return this.beverage.getDescription() + ', Soy';
  }

  cost(): number {
    const baseCost = this.beverage.cost();
    const size = this.getSize();
    const extra = size === Size.Tall ? 0.10 : size === Size.Grande ? 0.15 : 0.20;
    return baseCost + extra;
  }
}

class Whip extends CondimentDecorator {
  constructor(public beverage: Beverage) {
    super();
  }

  getDescription(): string {
    return this.beverage.getDescription() + ', Whip';
  }

  cost(): number {
    const baseCost = this.beverage.cost();
    const size = this.getSize();
    const extra = size === Size.Tall ? 0.10 : size === Size.Grande ? 0.15 : 0.20;
    return baseCost + extra;
  }
}

// Factory to build decorated beverages
class BeverageDecoratorFactory {
  private readonly condimentMap: Record<string, (b: Beverage) => Beverage> = {
    Milk: (b) => new Milk(b),
    Mocha: (b) => new Mocha(b),
    Soy: (b) => new Soy(b),
    Whip: (b) => new Whip(b),
  };

  decorate(base: Beverage, condiments: string[]): Beverage {
    return condiments.reduce((bev, name) => {
      const decorator = this.condimentMap[name];
      if (!decorator) throw new Error(`Unknown condiment: ${name}`);
      return decorator(bev);
    }, base);
  }
}

// Example Usage
const base = new DarkRoast();
base.setSize(Size.Venti);

const selected = ['Mocha', 'Mocha', 'Whip'];

const decorated = new BeverageDecoratorFactory().decorate(base, selected);

console.log(decorated.getDescription()); // Dark Roast Coffee, Mocha, Mocha, Whip
console.log(`Size: ${decorated.getSize()}`);
console.log(`Total: $${decorated.cost().toFixed(2)}`);
