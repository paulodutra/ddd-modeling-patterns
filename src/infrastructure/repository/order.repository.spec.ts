import { Sequelize } from 'sequelize-typescript';
import CustomerModel from '../db/sequelize/model/customer.model';
import Customer from '../../domain/entity/customer';
import CustomerRepository from './customer.repository';
import Address from '../../domain/entity/Address';
describe('Order repository test',() => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory',
            logging: false,
            sync: { force: true },
        });
    
        sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

   
});
