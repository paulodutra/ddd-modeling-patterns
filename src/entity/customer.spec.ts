import Address from "./Address";
import Customer from "./customer";

describe("Customer unit tests", () => {
    it("should  throw error when id is empty", () => {
        expect(() => {
            new Customer("", "Paul");
        }).toThrowError("Id is required");
    });

    it("should  throw error when name is empty", () => {
        expect(() => {
            new Customer("123", "");
        }).toThrowError("Name is required");
    });

    it("should  change name", () => {
        //Arrange
        const customer = new Customer("123", "Paul");
        //Act
        customer.changeName("Jonh");
        //Assert
        expect(customer.name).toEqual("Jonh");
    });

    it("should  activate customer", () => {
        const customer = new Customer("123", "Paul");
        const address = new Address("street", 1, "00000-000", "Rio de Janeiro");
        customer.Address = address;
        customer.activate();
        expect(customer.isActive()).toBe(true);
    });

    it("should  deactivate customer", () => {
        const customer = new Customer("123", "Paul");
        customer.deactivate();
        expect(customer.isActive()).toBe(false);
    });

    it("should  throw error when address is undefined when you activate a customer", () => {
        expect(() => {
            const customer = new Customer("123", "Paul");
            customer.activate();
        }).toThrowError("Address is mandatory to activate a customer")
    });
});
