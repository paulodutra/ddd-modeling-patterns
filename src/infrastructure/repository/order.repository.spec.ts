import { Sequelize } from 'sequelize-typescript';
import CustomerModel from '../db/sequelize/model/customer.model';
import Customer from '../../domain/entity/customer';
import CustomerRepository from './customer.repository';
import Address from '../../domain/entity/address';
import OrderModel from '../db/sequelize/model/order.model';
import OrderItemModel from '../db/sequelize/model/order-item.model';
import ProductModel from '../db/sequelize/model/product.model';
import ProductRepository from './product.repository';
import Product from '../../domain/entity/product';
import Order from '../../domain/entity/order';
import OrderItem from '../../domain/entity/orderItem';
import OrderRepository from './order.repository';
describe('Order repository test',() => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });
    
        await sequelize.addModels([
            CustomerModel, 
            OrderModel, 
            OrderItemModel, 
            ProductModel
        ]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a new order",  async() => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Jonh");
        const address = new Address("Street", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const orderRepository = new OrderRepository();
        const order = new Order("123", "123", [orderItem]);
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: [{model: OrderItemModel}],
        });
    
        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: "123",
                    product_id: "123",
                }
            ],
        });
    });

    it("should find a specific order",  async() => {
        const customerRepository = new CustomerRepository();
        const customerId = "123";
        const customer = new Customer(customerId, "Jonh");
        const address = new Address("Street", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 2);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );
        
        const orderRepository = new OrderRepository();
        const orderId = "122";
        const orderEntity = new Order(orderId, customerId, [orderItem]);
        await orderRepository.create(orderEntity);
   
        const order = await orderRepository.find(orderId);
        expect(order).toStrictEqual(orderEntity);
    });

    it("should findAll orders",  async() => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Jonh");
        const address = new Address("Street", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product1 = new Product("1", "Product 1", 2);
        const product2 = new Product("2", "Product 2", 2);
        await productRepository.create(product1);
        await productRepository.create(product2);

        const orderItem1 = new OrderItem(
            "1",
            product1.name,
            product1.price,
            product1.id,
            2
        );
        const orderItem2 = new OrderItem(
            "2",
            product2.name,
            product2.price,
            product2.id,
            1
        );

        const orderRepository = new OrderRepository();
        const order1 = new Order("122", "123", [orderItem1]);
        await orderRepository.create(order1);
        const order2 = new Order("123", "123", [orderItem2]);
        await orderRepository.create(order2);

        const orders = await orderRepository.findAll();
        expect(orders).toHaveLength(2);
        expect(orders).toStrictEqual([order1, order2]);
    });


    it("should update a specific a order",  async() => {
        const customerRepository = new CustomerRepository();
        const customerId = "123";
        const customer = new Customer(customerId, "Jonh");
        const address = new Address("Street", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 2);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );
        
        const orderRepository = new OrderRepository();
        const orderId = "122";
        const orderEntity = new Order(orderId, customerId, [orderItem]);
        await orderRepository.create(orderEntity);

        const newOrderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            1
        );

        const newOrderEntity = new Order(orderId, customerId, [newOrderItem]);
        await orderRepository.update(newOrderEntity)
        const order = await orderRepository.find(orderId);
        expect(order).toStrictEqual(newOrderEntity);
    });

});
