import Order from '../../domain/entity/order';
import OrderModel from '../db/sequelize/model/order.model';
import OrderItemModel from '../db/sequelize/model/order-item.model';
import OrderRepositoryInterface from '../../domain/repository/order-repository.interface';
import OrderItem from '../../domain/entity/orderItem';

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    try {
      await OrderModel.create(
        {
          id: entity.id,
          customer_id: entity.customerId,
          total: entity.total(),
          items: entity.items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            product_id: item.productId,
            quantity: item.quantity,
          })),
        },
        {
          include: [{ model: OrderItemModel }],
        }
      );
    } catch(error) {
      console.error('it was impossible to create', error);
    }
   
  }

  async find(id: string): Promise<Order> {
    let orderModel;
    try {
      orderModel = await OrderModel.findOne({
        where: {
          id,
        },
        include: [{ model: OrderItemModel }],
        rejectOnEmpty: true,
      });
    } catch (error) {
      throw new Error("Order not found");
    }
    let orderItems = orderModel.items.map((item) => (
      new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
    ));
    const order = new Order(orderModel.id, orderModel.customer_id, orderItems);
    return order;
  }

  async findAll(): Promise<Order[]> {
    const ordersModel = await OrderModel.findAll({
      include: [
        {
          model: OrderItemModel 
        }
      ]
    });
    const orders = ordersModel.map((orderModel) => {
      let orderItems = orderModel.items.map((item) => (
        new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
      ));
      const order =  new Order(
        orderModel.id, 
        orderModel.customer_id, 
        orderItems
      );
      order.total();
      return order;
    });
    return orders;
  }

  async update(entity: Order): Promise<void> {
    try {
      await OrderModel.update({
        customer_id: entity.customerId,
        total: entity.total(),
      },
        {
          where: {
            id: entity.id,
          },
        }
      );
      await Promise.all(
        entity.items.map(async (item) => {
          await OrderItemModel.update(
            {
              name: item.name,
              price: item.price,
              product_id: item.productId,
              quantity: item.quantity,
            },
            {
              where: {
                id: item.id,
              },
             
            }
          );
        })
      );
     
    } catch(error) {
  
      console.log(error);
    }

  }
}
