import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

export default function SingleNode(props : any) {
	let user = props.userObj;
	let selectedUser = props.selectedUser;
	let [fingerprint, setFingerprint] = React.useState('fingerprint');

	React.useEffect(() => {
	    fetch('http://localhost:8000/user/getCert/' + user.org + '/' + user.user)
	    	.then(results => results.json())
			.then(data => {
				setFingerprint(data.fingerprint);
			})
			.catch((error) => {
				//TODO: MAKE ERROR MESSAGE HERE
				console.error(error);
			});
	});

	return (
		<React.Fragment>
			<TableRow
              	style={{backgroundColor: selectedUser === user.user ? '#F6F6F6' : 'white'}}>
              	<TableCell>{user.user}</TableCell>
              	<TableCell>{user.org}</TableCell>
              	<TableCell>{fingerprint}</TableCell>
              	<TableCell align="right">{user.username}</TableCell>
            </TableRow>
		</React.Fragment>
	);
}