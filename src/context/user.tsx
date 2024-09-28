import {makeObservable, observable} from 'mobx';
import {UserType} from "@/types/users";

export default class User {
    _isAuthenticated: boolean = false;
    _user: UserType = {
        gmail: "",
        userId: 0,
    };

    constructor() {
        makeObservable(this, {
            _user: observable,
            _isAuthenticated: observable,
        });
    }

    setUser(user: UserType) {
        this._user = user;
    }

    setIsAuthenticated(isAuthenticated: boolean) {
        this._isAuthenticated = isAuthenticated;
    }

    get isAuthenticated() {
        return this._isAuthenticated;
    }

    get user() {
        return this._user;
    }
}