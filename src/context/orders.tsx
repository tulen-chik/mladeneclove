import { makeObservable, observable } from 'mobx';
import {OrderType} from "@/types/orders";

export default class Order {
    // Declare the _projects property directly in the class
    _orders: Array<OrderType> = [];

    constructor() {
        // Initialize MobX observable on this instance
        makeObservable(this, {
            _orders: observable,
        });
    }

    setOrders(orders: Array<OrderType>) {
        this._orders = orders;
    }

    // Corrected getter method to return _projects
    get orders() {
        return this._orders;
    }
}
