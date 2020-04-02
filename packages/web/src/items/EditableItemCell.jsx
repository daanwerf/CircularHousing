import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from "@material-ui/lab/Alert";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

export default function EditableItemCell(props) {
	const curValue = props.value;
	const apiCall = props.apiCall;
	const itemId = props.itemId;
	const editKey = props.editKey;
	const dropdown = props.dropdown;

	const [edit, setEdit] = React.useState(false);
	const [value, setValue] = React.useState(curValue);
	const [newValue, setNewvalue] = React.useState(curValue);
	const [loading, setLoading] = React.useState(false);
	const [alert, setAlert] = React.useState('');

	function openEdit(event) {
		setEdit(true);
		setAlert('');
	}

	function closeEdit(event) {
		setEdit(false);
		setAlert('');
	}

	function handleUpdate(event) {
		setAlert('');
		setLoading(true);

		const data = {
			id: itemId
		}

		data[editKey] = newValue;

		fetch('http://localhost:8000/' + apiCall, {
	      method: 'POST',
	      headers: {
	        Accept: 'application/json',
	        'Content-Type': 'application/json'
	      },
	      body: JSON.stringify(data)
	    })
	    .then((response) => {
	      setLoading(false);

	      if (response.status === 200) {
	      	setEdit(false);
	        setValue(newValue);
	      } else {
	        setAlert(response.statusText);
	      }
	    })
	    .catch((error) => {
	      setLoading(false);
	      setEdit(false);

	      setAlert('Undefined error happened');
	    });
	}

	return (
		<TableCell>
			{loading
				? <CircularProgress />
				: <div> {edit
					?	<div>
							{dropdown
								? <FormControl>
					                <Select
					                  id="standard-basic"
					                  value={newValue}
					                  onChange={(e) => setNewvalue(e.target.value)}
					                >
					                  {props.values.map(val => (
					                    <MenuItem key={val} value={val}>{val}</MenuItem>
					                  ))}
					                </Select>
					              </FormControl>
								: <TextField 
									id="standard-basic" 
									value={newValue}
									onInput={(e) => setNewvalue(e.target.value)}
								/>
							}
							<IconButton onClick={handleUpdate}>
								<CheckIcon color="primary" />
							</IconButton>
							<IconButton onClick={closeEdit}>
								<ClearIcon color="secondary" />
							</IconButton>
						</div>
					: 	<div>{value}
							<IconButton onClick={openEdit}>
				            	<EditIcon color="primary"/>
				          	</IconButton>
			          	</div>
				} </div>
			}

			{alert !== '' ? <Alert severity="error">{alert}</Alert> : null}	
		</TableCell>
	);
}