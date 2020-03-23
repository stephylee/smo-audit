import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import CustomersAPI from "../services/CustomersAPI";
import InvoicesAPI from "../services/InvoicesAPI";
import axios from "axios";

const InvoicePage = ( {history, match }) => {

    const {id = "new"} = match.params;

    const [invoice, setInvoice] = useState ({
        amount: "",
        customer: "",
        status: "SENT"
    });

    const [customers, setCustomers] = useState([]);

    const [editing, setEditing] = useState(false);

    const [errors, setErrors] = useState ({
        amount: "",
        customer: "",
        status: ""
    });

    // Récupération des clients
	const fetchCustomers = async () => {
		try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);

            if(!invoice.customer) setInvoice({ ...invoice, customer: data[0].id });
		} catch(error) {
			// todo : Notification flash d'une erreur
            history.replace("/invoices");
		}
    }

    // Récupération d'une facture
	const fetchInvoice = async id => {
		try {
            const { amount, customer, status } = await InvoicesAPI.find(id);
            setInvoice( { amount, customer: customer.id, status } );            
		} catch(error) {
			// todo : Notification flash d'une erreur
            history.replace("/invoices");
		}
    }
    
    // récupération des clients à chaque chargement du composant
	useEffect(() => {
		fetchCustomers();
    }, []);
    
    // recupération de la bonne facture quand l'identifiant de l'url change
    useEffect(() =>{
        if(id !== "new"){
            setEditing(true);
            fetchInvoice(id);
        }

    }, [id]);

    // Gestion des changement des inputs dans le formulaire
	const handleChange = ({currentTarget}) => {
		const { value, name } = currentTarget;
		setInvoice({ ...invoice, [name]: value});
    }
    
    // Gestion de la soumission du formulaire
	const handleSubmit = async event => {
		event.preventDefault();

		try {
            if(editing){
                await InvoicesAPI.update(id, invoice);
                // todo : flash notification de succès
            }else{
                await InvoicesAPI.create(invoice);
                // todo : flash notification de succès
                history.replace("/invoices");
                setErrors({});
            }
		} catch({ response }) {
			const { violations } = response.data;
			if(violations){
				const apiErrors = {};
				violations.forEach( ({ propertyPath, message}) => {
					apiErrors[propertyPath] = message;
				});
                setErrors(apiErrors);
				// todo : flash notification d'erreurs
			}
		}
	};

    return ( 
        <>
        {editing && <h1>Modification d'une facture</h1> || <h1>Création d'une facture</h1> }

        <form onSubmit={handleSubmit}>
            <Field 
                name="amount" 
                type="number" 
                placeholder="Montant de la facture" 
                label="Montant" 
                onChange={handleChange} 
                value={invoice.amount} 
                error={errors.amount}
            />

            <Select 
                name="customer"
                label="Client"
                value={invoice.customer}
                error={errors.customer}
                onChange={handleChange}
            >
                {customers.map(customer => <option key={customer.id} value={customer.id}>{customer.firstname} {customer.lastname}</option> )}
            </Select>

            <Select 
                name="status"
                label="Statut"
                value={invoice.status}
                error={errors.status}
                onChange={handleChange}
            >
                <option value="SENT">Envoyée</option>
                <option value="PAID">Payée</option>
                <option value="CANCELLED">Annulée</option>
            </Select>

            <div className="form-group">
                <button type="submit" className="btn btn-success">Enregistrer</button>
                <Link to="/invoices" className="btn btn-link">Retour à la liste</Link>
            </div>

        </form>

        </>
     );
}
 
export default InvoicePage;