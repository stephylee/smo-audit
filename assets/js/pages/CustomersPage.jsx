import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Pagination from '../components/Pagination';
import CustomersAPI from '../services/CustomersAPI';
import { toast } from 'react-toastify';
import TableLoader from '../components/loaders/TableLoader';

const CustomersPage = (props) => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    // permet de récupérer les customers
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
            setLoading(false);
        } catch(error){
            toast.error("Impossible de charger les clients")
        }
    }

    // Au chargement on va chercher les customers
    useEffect(() => {
        fetchCustomers();        
    }, []);

    // Gestion de la suppression d'un customer
    const handledelete = async id => {

        const originalCustomers = [...customers];

        setCustomers(customers.filter(customer => customer.id !== id));
        
        try{
            await CustomersAPI.delete(id)
            toast.success("le client a été supprimé")
        } catch(error){
            setCustomers(originalCustomers);
            toast.error("le client n'a pas été supprimé")
        }
    };

    // gestion du changement de page
    const handlePageChange = page => {
        setCurrentPage(page);
    }

    // gestion de la recherche
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    }

    const itemsPerPage = 10;

    // Filtrage des customers en fonction de la recherche
    const filteredCustomers = customers.filter(
        c =>    c.firstname.toLowerCase().includes(search.toLowerCase()) ||
                c.lastname.toLowerCase().includes(search.toLowerCase()) ||
                c.email.toLowerCase().includes(search.toLowerCase()) ||
                (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
    );
    
    // Pagination des données
    const paginatedCustomers = Pagination.getData(
                                            filteredCustomers, 
                                            currentPage, 
                                            itemsPerPage
                                            );

    return ( 
        <>
            <div className="mb-2 d-flex justify-content-between align-items-center">
                <h1>Liste des Clients</h1>
                <Link to="/customers/new" className="btn btn-primary">Créer un client</Link>
            </div>
            

            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="rechercher..."/>
            </div>

            <table className="table table-hover">
                
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Entreprise</th>
                        <th className="text-center">Factures</th>
                        <th className="text-center">Montant total</th>
                        <th />
                    </tr>
                </thead>
                {!loading &&  (
                    <tbody>
                        {paginatedCustomers.map(customer => 
                        <tr key = {customer.id}>
                            <td>{customer.id}</td>
                            <td>
                                <Link to={"/customers/" + customer.id}>{customer.firstname} {customer.lastname}</Link>
                            </td>
                            <td>{customer.email}</td>
                            <td>{customer.company}</td>
                            <td className = "text-center">
                                <span className="badge badge-primary">{customer.invoices.length}</span>
                            </td>
                            <td className = "text-center">{customer.totalAmount.toLocaleString()} €</td>
                            <td>
                                <button 
                                    onClick={() => handledelete(customer.id)}
                                    disabled={customer.invoices.length > 0} 
                                    className="btn btn-sm btn-danger"
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                        )}
                        
                    </tbody>
                )}
                    
            </table>

            {loading && <TableLoader />}
            
            {itemsPerPage < filteredCustomers.length && <Pagination 
                currentPage={currentPage} 
                itemsPerPage={itemsPerPage} 
                length={filteredCustomers.length} 
                onPageChanged={handlePageChange} 
            />}
        </>
     );
}
 
export default CustomersPage;