import axios from "axios";
import { CUSTOMERS_API }  from "./config";

function findAll(){
    return axios
        .get(CUSTOMERS_API)
        .then(response => response.data['hydra:member']);
}

function deleteCustomer(id){
    return axios
        .delete(CUSTOMERS_API + "/" + id);
}

function findCustomer(id){
    return axios
        .get(CUSTOMERS_API + "/" + id)
        .then(response => response.data);
}

function updateCustomer(id, customer){
    return axios
        .put(CUSTOMERS_API + "/" + id, customer);
}

function createCustomer(customer) {
    return axios
        .post(CUSTOMERS_API, customer);
}

export default {
    findAll,
    delete: deleteCustomer,
    findCustomer,
    updateCustomer,
    createCustomer
};
