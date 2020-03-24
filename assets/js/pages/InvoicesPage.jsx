import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Pagination from '../components/Pagination';
import InvoicesAPI from '../services/InvoicesAPI';
import { toast } from 'react-toastify';
import TableLoader from '../components/loaders/TableLoader';

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
    const [loading, setLoading] = useState(true);

    // permet de récupérer les invoices
    const fetchInvoices = async () => {
        try {
            const data = await InvoicesAPI.findAll();
            setInvoices(data);
            setLoading(false);
        } catch(error){
            toast.error("Erreur de chargement des factures !")
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
            toast.success("La facture a bien été supprimée.")
        } catch(error){
            setInvoices(originalInvoices);
            toast.error("La facture n'a pas été supprimée.")
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
            <div className="mb-2 d-flex justify-content-between align-items-center">
                <h1>Liste des factures</h1>
                <Link to="/invoices/new" className="btn btn-primary">Créer une facture</Link>
            </div>

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
                {!loading &&  (
                    <tbody>
                        {paginatedInvoices.map(invoice => 
                        <tr key = {invoice.id}>
                            <td>{invoice.chrono}</td>
                            <td>
                                <Link to={"/customers/" + invoice.customer.id}>{invoice.customer.firstname} {invoice.customer.lastname}</Link>
                            </td>
                            <td className="text-center">{formatDate(invoice.sentAt)}</td>
                            <td className="text-center">
                                <span className="badge badge-success">{invoice.status}</span>
                            </td>
                            <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                            
                            <td>
                                <Link 
                                    to={"/invoices/" + invoice.id}
                                    className="btn btn-sm btn-primary mr-1"
                                >
                                    Editer
                                </Link>
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
                )}
            </table>

            {loading && <TableLoader />}
            
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