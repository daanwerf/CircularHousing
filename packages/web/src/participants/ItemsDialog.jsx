import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Items from '../items/Items';
import Proposals from '../proposals/Proposals';

const useStyles = makeStyles(theme => ({
  dialogPaper: {
  	minHeight: '80vh',
  	maxHeight: '80vh'
  }
}));

export default function ItemsDialog(props) {
	const [proposalAccepted, setProposalAccepted] = React.useState(false);

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
			<DialogTitle>Items for {participant}</DialogTitle>
			<DialogContent dividers={true}>
				<Items 
			        user={user} 
			        org={org} 
			        participant={participant}
			        reload={proposalAccepted}
			        setReload={setProposalAccepted}
			    />

			    <Proposals 
		            user={user}
		            org={org}
		            participant={participant}
		            setProposalAccepted={setProposalAccepted}
		        />
			</DialogContent>
		</Dialog>
	);
}