import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation';
import TextFieldsIcon from '@material-ui/icons/TextFields';

export default function TableItem(props) {
	let item = props.item;
	let setUpdate = props.setUpdate;
	let setUpdateId = props.setUpdateId;

	function handleChangeQuality(event) {
		event.preventDefault();
		setUpdate('changeQuality');
		setUpdateId(item._id);
	}

	function handleChangeName(event) {
		event.preventDefault();
		setUpdate('changeName');
		setUpdateId(item._id);
	}

	function handleTransfer(event) {
		event.preventDefault();
		setUpdate('transfer');
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
					<IconButton onClick={handleChangeQuality}>
						<EditIcon color="primary" />
					</IconButton>
					<IconButton onClick={handleChangeName}>
						<TextFieldsIcon color="primary" />
					</IconButton>
					<IconButton onClick={handleTransfer}>
						<TransferWithinAStationIcon color="primary" />
					</IconButton>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}