import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import CustomerAPI from "../services/CustomersAPI";

const CustomerPage = ({ match, history }) => {

	const {id = "new"} = match.params;

	const [customer, setCustomer] = useState ({
		firstname: "",
		lastname: "",
		email: "",
		company: ""
	});

	const [errors, setErrors] = useState ({
		firstname: "",
		lastname: "",
		email: "",
		company: ""
	});

	const [editing, setEditing] = useState(false);

	// Récupération du customer en focntion de l'identifiant
	const fetchCustomer = async id => {
		try {
			const { firstname, lastname, email, company } = await CustomerAPI.findCustomer(id);
			setCustomer({ firstname, lastname, email, company });
		} catch(error) {
			// todo : Notification flash d'une erreur
			history.replace("/customers");
		}
	}

	// Chargement du customer si besoin au chargement du composant ou au changement de l'identifiant
	useEffect(() => {
		if(id !== "new") setEditing(true);
		fetchCustomer(id);
	}, [id]);
	

	// Gestion des changement des inputs dans le formulaire
	const handleChange = ({currentTarget}) => {
		const { value, name } = currentTarget;
		setCustomer({ ...customer, [name]: value});
	}

	// Gestion de la soumission du formulaire
	const handleSubmit = async event => {
		event.preventDefault();

		try {
			if(editing) {
				await CustomerAPI.updateCustomer(id, customer);
				// todo : flash notification de succès
			}else{
				await CustomerAPI.createCustomer(customer);
				// todo : flash notification de succès
				history.replace("/customers");
			}
			setErrors({});
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
			{(!editing && 
				<h1>Création d'un client</h1>
			) || (
				<h1>Modification du client</h1>
			)}

			<form onSubmit={handleSubmit}>
				<Field 
					name="firstname" 
					label="Prénom" 
					placeholder="Prénom du client" 
					value={customer.firstname} 
					onChange={handleChange} 
					error={errors.firstname} 
				/>
				<Field 
					name="lastname" 
					label="Nom de famille" 
					placeholder="Nom de famille du client" 
					value={customer.lastname} 
					onChange={handleChange}  
					error={errors.lastname} 
				/>
				<Field 
					name="email" 
					label="Email" 
					placeholder="Adresse email du client" 
					type="email" 
					value={customer.email} 
					onChange={handleChange}  
					error={errors.email} 
				/>
				<Field 
					name="company" 
					label="Entreprise" 
					placeholder="Entreprise du client" 
					value={customer.company} 
					onChange={handleChange}  
					error={errors.company} 
				/>

				<div className="form-group">
					<button type="submit" className="btn btn-success">Enregistrer</button>
					<Link to="/customers" className="btn btn-link">Retour à la liste</Link>
				</div>
			</form>
		</>
		
	 );
};
 
export default CustomerPage;