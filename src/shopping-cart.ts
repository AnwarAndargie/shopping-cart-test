import Decimal from "decimal.js";

export class CartItem {
    constructor(
        public readonly name: string,
        public readonly unitPrice: Decimal,
        public quantity: number
    ) {
        if (quantity <= 0) throw new Error("Quantity must be positive");
        if (unitPrice.lte(0)) throw new Error("Unit price must be positive");
    }

    get lineTotal(): Decimal {
        return this.unitPrice.mul(this.quantity);
    }
}

export class ShoppingCart {
    private items: Map<string, CartItem> = new Map();

    addProduct(name: string, unitPrice: number | string, quantity: number): void {
        const existingItem = this.items.get(name);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            const price = new Decimal(unitPrice).toDP(2, Decimal.ROUND_HALF_UP);
            const item = new CartItem(name, price, quantity);
            this.items.set(name, item);
        }
    }

    getTotal(): Decimal {
        const sum = Array.from(this.items.values())
            .reduce((total, item) => total.add(item.lineTotal), new Decimal(0));

        return sum.toDP(2, Decimal.ROUND_HALF_UP);
    }

    getSalesTax(taxRate: number): Decimal {
        const rate = new Decimal(taxRate).div(100);
        return this.getTotal().mul(rate).toDP(2, Decimal.ROUND_HALF_UP);
    }

    getTotalWithTax(taxRate: number): Decimal {
        return this.getTotal().add(this.getSalesTax(taxRate)).toDP(2, Decimal.ROUND_HALF_UP);
    }

    getItems(): CartItem[] {
        return Array.from(this.items.values());
    }
}