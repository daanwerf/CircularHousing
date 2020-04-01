import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import CreateItem from '../items/CreateItem';

const useStyles = makeStyles(theme => ({
  dialogPaper: {
  	minHeight: '80vh',
  	maxHeight: '80vh'
  }
}));

export default function CreateDialog(props) {
	const classes = useStyles();

	const open = props.open;
	const setOpen = props.setOpen;
	const user = props.user;
	const org = props.org;
	const participant = props.participant;

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Dialog
			classes={{ paper : classes.dialogPaper }}
			open={open}
			onClose={handleClose}
			scroll={"paper"}
			fullWidth={true}
			maxWidth={"lg"}
		>
			<DialogTitle>Create Item</DialogTitle>
			<DialogContent dividers={true}>
				<CreateItem
					user={user}
					org={org}
					setOpen={setOpen}
					participant={participant}
				/>
			</DialogContent>
		</Dialog>
	);
}