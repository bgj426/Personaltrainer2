import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Snackbar from '@material-ui/core/Snackbar';
import AddCustomer from './AddCustomer';
import EditCustomer from './EditCustomer';

function Customers() {

const [customers, setCustomers] = useState([]);
const [open, setOpen] = React.useState(false);
const [msg, setMsg] = useState('');

const gridRef = useRef();

useEffect(() => {
    getCustomers();
}, [])

const getCustomers = () => {
    fetch('https://customerrest.herokuapp.com/api/customers')
    .then(response => response.json())
    .then(data => setCustomers(data.content))
    .catch(err => console.error(err))
}

const deleteCustomer = (link) => {
    if (window.confirm('Are you sure?')){
    fetch(link, {
        method: 'DELETE',
    })
    .then(_ => gridRef.current.refreshCells({rowNodes: getCustomers()}))
    .then(_ => setMsg('Customer was deleted successfully.'))
    .then(_ => setOpen(true))
    .catch(err => console.error(err))
}
}

const addCustomer = (newCustomer) => {
    fetch('https://customerrest.herokuapp.com/api/customers', { 
    method: 'POST',
    headers: {'Content-type' : 'application/json' },
    body: JSON.stringify(newCustomer)
})
.then(_ => gridRef.current.refreshCells({rowNodes: getCustomers()}))
.catch(err => console.error(err))
}


const updateCustomer = (link, customer) => {
    fetch(link, { 
    method: 'PUT',
    headers: {'Content-type' : 'application/json' },
    body: JSON.stringify(customer)
})
.then(_ => gridRef.current.refreshCells({rowNodes: getCustomers()}))
.then(_ => setMsg('Customer was updated successfully.'))
.then(_ => setOpen(true))
.catch(err => console.error(err))
}

const closeSnackbar = () => {
    setOpen(false);
}





const columns = [

{ headerName: 'First name', field: 'firstname', sortable: true, filter: true, width: 150},
{ headerName: 'Last name', field: 'lastname', sortable: true, filter: true, width: 150},
{ headerName: 'Street address', field: 'streetaddress', sortable: true, filter: true, width: 170},
{ headerName: 'Postcode', field: 'postcode', sortable: true, filter: true, width: 130},
{ headerName: 'City', field: 'city', sortable: true, filter: true, width: 150},
{ headerName: 'Email', field: 'email', sortable: true, filter: true, width: 200},
{ headerName: 'Phone', field: 'phone', sortable: true, filter: true, width: 150},

{
    headerName: '',
    field: '_links.self.href',
    width: 50,
    cellRendererFramework: params => <EditCustomer updateCustomer={updateCustomer} params={params} />

},

{
    headerName: '',
    field: '_links.self.href',
    width: 50,
    cellRendererFramework: params => 
    <IconButton aria-label="delete" onClick={() => deleteCustomer(params.value)}><DeleteIcon /></IconButton>

},

]




return(
    <div>
        <AddCustomer addCustomer={addCustomer} />
    <div className="ag-theme-material" style={{height: '593px', width: '79%', margin: 'auto', paddingTop: '10px'}}>
    <AgGridReact
    ref={gridRef}
    suppressCellSelection={true}
    onGridReady={ params => {
        gridRef.current = params.api
    }}
    columnDefs={columns}
    rowData={customers}
    suppressCellSelection={true}
    pagination="true"
    paginationPageSize="10"
    >
        </AgGridReact>
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={closeSnackbar}
            message={msg}
            />

        </div>
        </div>
    );

}

export default Customers;