import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

export default function SingleNode(props) {
	let user = props.userObj;
	let selectedUser = props.selectedUser;
	let registeredFingerprint = props.fingerprint;
	let [fingerprint, setFingerprint] = React.useState('');
	let [usernames, setUsernames] = React.useState([]);

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
	}, []);

	React.useEffect(() => {
		if (fingerprint !== '' 
			&& (registeredFingerprint === '' || registeredFingerprint === fingerprint)) {
			fetch('http://localhost:8000/participant/getByFingerprint/' + fingerprint + '?org=' 
		    		+ user.org + '&user=' + user.user)
		    	.then(results => results.json())
				.then(data => {
					setUsernames(data.map(user => user._id));
				})
				.catch((error) => {
					//TODO: MAKE ERROR MESSAGE HERE
					console.error(error);
				});
		} 
	}, [fingerprint, registeredFingerprint]);

	return (
		<React.Fragment>
			<TableRow
              	style={{backgroundColor: selectedUser === user.user ? '#A9A9A9' : 'white'}}>
              	<TableCell>{user.user}</TableCell>
              	<TableCell>{user.org}</TableCell>
              	<TableCell>{fingerprint}</TableCell>
              	<TableCell align="right">{usernames.join(', ')}</TableCell>
            </TableRow>
		</React.Fragment>
	);
}