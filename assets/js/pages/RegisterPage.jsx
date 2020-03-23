import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import UsersAPI from '../services/UsersAPI';

const RegisterPage = ({ history }) => {

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    // Gestion des champs
    const handleChange = ({currentTarget}) => {
        const { value, name } = currentTarget;
        setUser({ ...user, [name]: value});
    };

    // Gestion du submit
    const handleSubmit =  async event => {
        event.preventDefault();

        try {
            await UsersAPI.register(user);
            setErrors({});
            // notification du succès
            history.replace("/login");
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
    }

    return ( 
        <>
            <h1>Inscription</h1>

            <form onSubmit={handleSubmit}>

                <Field 
                    name="firstName"
                    label="Prénom"
                    placeholder="Votre prénom"
                    error={errors.firstName}
                    onChange={handleChange}
                    value={user.firstName}
                />

                <Field 
                    name="lastName"
                    label="Nom"
                    placeholder="Votre nom"
                    error={errors.lastName}
                    onChange={handleChange}
                    value={user.lastName}
                />

                <Field 
                    name="email"
                    label="Adresse email"
                    placeholder="Votre adresse email"
                    error={errors.email}
                    onChange={handleChange}
                    value={user.email}
                    type="email"
                />

                <Field 
                    name="password"
                    label="Mot de passe"
                    placeholder="Votre mot de passe"
                    error={errors.password}
                    onChange={handleChange}
                    value={user.password}
                    type="password"
                />

                <Field 
                    name="passwordConfirm"
                    label="Confirmation du mot de passe"
                    placeholder="Confirmez votre mot de passe"
                    error={errors.passwordConfirm}
                    onChange={handleChange}
                    value={user.passwordConfirm}
                    type="password"
                />

                    

                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Je m'inscris
                    </button>
                    <Link to="/login" className="btn btn-link">J'ai déjà un compte</Link>
                </div>

            </form>
        </>
     );
}
 
export default RegisterPage;