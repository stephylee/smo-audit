import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import InvoicesAPI from '../services/InvoicesAPI';
import moment from 'moment';

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "primary",
    CANCELLED: "danger"
};

const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée"
}

const InvoicesPage = (props) => {

    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    // permet de récupérer les invoices
    const fetchInvoices = async () => {
        try {
            const data = await InvoicesAPI.findAll();
            setInvoices(data);
        } catch(error){
            console.log(error.response);
        }
    }

    // Au chargement on va chercher les invoices
    useEffect(() => {
        fetchInvoices();        
    }, []);

    const formatDate = (str) => moment(str).format('DD/MM/YYYY');

    // Gestion de la suppression d'un invoice
    const handledelete = async id => {

        const originalInvoices = [...invoices];

        setInvoices(invoices.filter(invoice => invoice.id !== id));
        
        try{
            await InvoicesAPI.delete(id)
        } catch(error){
            setInvoices(originalInvoices);
            console.log(error.response) 
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

    // Filtrage des invoices en fonction de la recherche
    const filteredInvoices = invoices.filter(
        i =>    i.customer.firstname.toLowerCase().includes(search.toLowerCase()) ||
                i.customer.lastname.toLowerCase().includes(search.toLowerCase()) ||
                i.amount.toString().includes(search.toLowerCase()) 
    );
    
    // Pagination des données
    const paginatedInvoices = Pagination.getData(
                                            filteredInvoices, 
                                            currentPage, 
                                            itemsPerPage
                                            );

    return ( 
        <>
            <h1>Liste des factures</h1>

            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="rechercher..."/>
            </div>

            <table className="table table-hover">
                
                <thead>
                    <tr>
                        <th>Numéro</th>
                        <th>Client</th>
                        <th className="text-center">Date d'envoi</th>
                        <th className="text-center">Statut</th>
                        <th className="text-center">Montant</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {paginatedInvoices.map(invoice => 
                    <tr key = {invoice.id}>
                        <td>{invoice.chrono}</td>
                        <td>
                            <a href="#">{invoice.customer.firstname} {invoice.customer.lastname}</a>
                        </td>
                        <td className="text-center">{formatDate(invoice.sentAt)}</td>
                        <td className="text-center">
                            <span className="badge badge-success">{invoice.status}</span>
                        </td>
                        <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                        
                        <td>
                            <button 
                                onClick={() => handledelete(invoice.id)}
                                className="btn btn-sm btn-primary mr-1"
                            >
                                Editer
                            </button>
                            <button 
                                onClick={() => handledelete(invoice.id)}
                                className="btn btn-sm btn-danger"
                            >
                                Supprimer
                            </button>
                        </td>
                    </tr>
                    )}
                    
                </tbody>
                    
                

            </table>
            
            {itemsPerPage < filteredInvoices.length && <Pagination 
                currentPage={currentPage} 
                itemsPerPage={itemsPerPage} 
                length={filteredInvoices.length} 
                onPageChanged={handlePageChange} 
            />}
        </>
     );
}
 
export default InvoicesPage;