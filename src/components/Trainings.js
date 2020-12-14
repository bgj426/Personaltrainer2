import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Snackbar from '@material-ui/core/Snackbar';

function Trainings() {

const [trainings, setTrainings] = useState([]);
const [open, setOpen] = React.useState(false);
const [msg, setMsg] = useState('');

const gridRef = useRef();

useEffect(() => {
    getTrainings();
}, [])

const getTrainings = () => {
    fetch('https://customerrest.herokuapp.com/gettrainings')
    .then(response => response.json())
    .then(data => setTrainings(data))
    .catch(err => console.error(err))
}


const deleteTraining = (link) => {
    if (window.confirm('Are you sure?')){
    fetch(link, {
        method: 'DELETE',
    })
    .then(_ => gridRef.current.refreshCells({rowNodes: getTrainings()}))
    .then(_ => setMsg('Training was deleted successfully.'))
    .then(_ => setOpen(true))
    .catch(err => console.error(err))
}
}

const closeSnackbar = () => {
    setOpen(false);
}


const columns = [

    {
        headerName: 'Actions',
        field: '_links.self.href',
        width: 100,
        cellRendererFramework: params => 
        <IconButton aria-label="delete" onClick={() => deleteTraining(params.value)}><DeleteIcon /></IconButton>
    
    },

    { headerName: 'Activity', field: 'activity', sortable: true, filter: true, width: 170},
    { headerName: 'Duration (min)', field: 'duration', sortable: true, filter: true, width: 160},
    { headerName: 'Date', field: 'date', sortable: true, filter: true, width: 200},
    { headerName: 'Customer', field: 'customer.firstname', sortable: true, filter: true, width: 170},
]

return(
    <div className="ag-theme-material" style={{height: '593px', width: '52.5%', margin: 'auto', paddingTop: '20px'}}>
    <AgGridReact
     ref={gridRef}
     suppressCellSelection={true}
     onGridReady={ params => {
         gridRef.current = params.api
     }}
    columnDefs={columns}
    rowData={trainings}
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
    );

}

export default Trainings;