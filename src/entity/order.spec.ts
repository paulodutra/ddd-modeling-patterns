import Order from "./order";
import OrderItem from "./orderItem";

describe("Order unit tests", () => {

    it("should throw error when id is empty", () => {
       expect(() => {
            new Order("", "123", []);
       }).toThrowError('Id is required');
    });

    it("should throw error when customerId is empty", () => {
        expect(() => {
             new Order("123", "", []);
        }).toThrowError('customerId is required');
     });

     it("should throw error when items equals to zero", () => {
        expect(() => {
             new Order("123", "123", []);
        }).toThrowError('items quantity must be greater than 0');
     });

     it("should calculate total", () => {
        const item = new OrderItem("1", "Item", 100);
        const item2 = new OrderItem("2", "Item2", 200);
        const order = new Order("1", "customer1", [item]);
        let total = order.total();
        expect(total).toBe(100);
        const order2 = new Order("2","customer2", [item, item2]);
        total = order2.total();
        expect(total).toBe(300);

     });

});
