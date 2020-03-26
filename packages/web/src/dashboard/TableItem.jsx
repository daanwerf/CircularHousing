import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';

export default function TableItem(props) {
	let item = props.item;
	let setUpdate = props.setUpdate;
	let setUpdateId = props.setUpdateId;

	function handleEdit(event) {
		event.preventDefault();
		setUpdate(true);
		setUpdateId(item._id);
	}

	return (
		<React.Fragment>
			<TableRow>
				<TableCell>{item._id}</TableCell>
				<TableCell>{item._name}</TableCell>
				<TableCell>{item._itemOwner}</TableCell>
				<TableCell>{item._quality}</TableCell>
				<TableCell align="right">
					<IconButton onClick={handleEdit}>
						<EditIcon color="primary" />
					</IconButton>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}