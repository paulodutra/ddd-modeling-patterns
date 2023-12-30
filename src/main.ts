//@ts-ignore
import Address from "./domain/entity/Address";
import Customer from "./domain/entity/customer";
import Order from "./domain/entity/order";
import OrderItem from "./domain/entity/orderItem";

//aggregate 1, relation with object
const customer = new Customer('123', 'Paulo');
const address = new Address('rua', 2, '0000000', 'Sao Paulo');
customer.Address = address;
customer.activate();

//aggregate 2, relation using ID to reference de aggregate 1 e object beetween Order and OrderItem
const item1 = new OrderItem('1','Item', 100, "p1", 1);
const item2 = new OrderItem('1','Item 2', 100, "p2", 2);
const order = new Order('1', '123', [item1, item2]);
console.log(order);


