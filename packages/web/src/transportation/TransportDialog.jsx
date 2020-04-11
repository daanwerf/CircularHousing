import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TransportItems from './TransportItems';

const useStyles = makeStyles(theme => ({
  dialogPaper: {
  	minHeight: '80vh',
  	maxHeight: '80vh'
  }
}));

export default function TransportDialog(props) {
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
			<DialogTitle>Items currently transporting with {participant}</DialogTitle>
			<DialogContent dividers={true}>
				<TransportItems
					user={user}
					org={org}
					participant={participant}
				/>
			</DialogContent>
		</Dialog>
	);
}