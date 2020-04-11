import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import Tooltip from '@material-ui/core/Tooltip';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function TableItem(props) {
  let item = props.item;
  const user = props.user;
  const org = props.org;

  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState('');

  function deliverItem(event) {
    setAlert('');
    setLoading(true);

    fetch('http://localhost:8000/item/deliver?org=' + org + '&user=' + user, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: item._id
      })
    }).then((response) => {
      setLoading(false);
      if (response.status === 200) {
        props.setLoading(true);
        setLoading(false);
      } else {
        setAlert(response.statusText);
      }
    }).catch(response => {
      setLoading(false);
      console.log(response);
    });
  }

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>{item._id.substring(0, 10)}...</TableCell>
        <TableCell>{item._name}</TableCell>
        <TableCell>{item._itemOwner}</TableCell>
        <TableCell>{item._proposedOwner}</TableCell>
        <TableCell align="right">
          {loading ? <CircularProgress /> :
            <div><Tooltip title="Item delivered">
              <IconButton onClick={deliverItem}>
                <CheckIcon color="primary" />
              </IconButton>
            </Tooltip>
            {alert === '' ? null :
              <Alert severity="error">{alert}</Alert>
            }</div>
          }
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
