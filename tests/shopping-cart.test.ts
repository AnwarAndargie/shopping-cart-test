
import { describe, it, expect } from 'vitest';
import { ShoppingCart } from '../src/shopping-cart';
import Decimal from 'decimal.js';

describe('ShoppingCart', () => {
    it('should verify Step 1 requirements: Add products to the shopping cart', () => {
        // Given: An empty shopping cart
        const cart = new ShoppingCart();

        // And a product, Dove Soap with a unit price of 39.99
        // When: The user adds 5 Dove Soaps to the shopping cart
        cart.addProduct("Dove Soap", 39.99, 5);

        // Then: The shopping cart should contain 5 Dove Soaps each with a unit price of 39.99
        const items = cart.getItems();
        expect(items).toHaveLength(1);
        expect(items[0].name).toBe("Dove Soap");
        expect(items[0].quantity).toBe(5);
        expect(items[0].unitPrice.equals(new Decimal("39.99"))).toBe(true);

        // And the shopping cart’s total price should equal 199.95
        const total = cart.getTotal();
        expect(total.equals(new Decimal("199.95"))).toBe(true);
    });

    it('should handle rounding correctly based on user examples', () => {
        const cart = new ShoppingCart();
        // Example 1: 0.565 should result in 0.57
        // We can simulate this by adding an item with price 0.565 (if allowed) or result of calculation
        // The code rounds unit price on add: `new Decimal(unitPrice).toDP(2, Decimal.ROUND_HALF_UP)`

        cart.addProduct("Test Item 1", 0.565, 1);
        let items = cart.getItems();
        expect(items[0].unitPrice.toString()).toBe("0.57");
        expect(cart.getTotal().toString()).toBe("0.57");

        // Example 2: 0.5649 should result in 0.56
        const cart2 = new ShoppingCart();
        cart2.addProduct("Test Item 2", 0.5649, 1);
        items = cart2.getItems();
        expect(items[0].unitPrice.toString()).toBe("0.56");
        expect(cart2.getTotal().toString()).toBe("0.56");
    });

    it('should throw error for invalid quantity', () => {
        const cart = new ShoppingCart();
        expect(() => cart.addProduct("Bad Item", 10, 0)).toThrow("Quantity must be positive");
        expect(() => cart.addProduct("Bad Item", 10, -1)).toThrow("Quantity must be positive");
    });

    it('should throw error for invalid price', () => {
        const cart = new ShoppingCart();
        expect(() => cart.addProduct("Bad Price", -10, 1)).toThrow("Unit price must be positive");
        expect(() => cart.addProduct("Bad Price", 0, 1)).toThrow("Unit price must be positive");
    });

    it('should verify Step 2 requirements: Add additional products of the same type', () => {
        // Given: An empty shopping cart
        const cart = new ShoppingCart();

        // And a product, Dove Soap with a unit price of 39.99
        // When: The user adds 5 Dove Soaps to the shopping cart
        cart.addProduct("Dove Soap", 39.99, 5);

        // And then adds another 3 Dove Soaps to the shopping cart
        cart.addProduct("Dove Soap", 39.99, 3);

        // Then: The shopping cart should contain 8 Dove Soaps each with a unit price of 39.99
        const items = cart.getItems();
        expect(items).toHaveLength(1);
        expect(items[0].name).toBe("Dove Soap");
        expect(items[0].quantity).toBe(8);
        expect(items[0].unitPrice.equals(new Decimal("39.99"))).toBe(true);

        // And the shopping cart’s total price should equal 319.92
        expect(cart.getTotal().equals(new Decimal("319.92"))).toBe(true);
    });
});
