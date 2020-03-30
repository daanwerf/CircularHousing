import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableItem from './TableItem';
import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import Title from './Title';
import UpdateItem from './UpdateItem';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
}));

export default function Items(props) {
  const [items, setItems] = React.useState([]);
  const loading = props.loading;
  const setLoading = props.setLoading;
  const [update, setUpdate] = React.useState('');
  const [updateId, setUpdateId] = React.useState('');
  const [alert, setAlert] = React.useState('');
  const itemFetch = props.apiCall;

  const classes = useStyles();

  React.useEffect(() => {
    if (loading) {
      setAlert('');

      fetch('http://localhost:8000/item/' + itemFetch + '?org=' + props.org + '&user=' + props.user)
        .then(results => {
          if (results.status === 200) {
            results.json()
            .then(data => {
              setItems(data);
              setLoading(false);
            })
          } else {
            setAlert(results.statusText);
            setLoading(false);
          }
        })
        .catch((error) => {
          //TODO: MAKE ERROR MESSAGE HERE
          console.error(error);
        });
    }
  }, [loading]);

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          {alert !== '' ? <Alert severity="error">{alert}</Alert> 
          : <div><Title>Items</Title>
            {loading ? <LinearProgress /> :
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell>Quality</TableCell>
                    <TableCell>Transfer</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map(item => (
                    <TableItem
                      user={props.user}
                      org={props.org}
                      key={item._id}
                      item={item}
                      setUpdate={setUpdate}
                      setUpdateId={setUpdateId}
                      setLoading={setLoading}
                    />
                  ))}
                </TableBody>
              </Table>}</div>
            }
        </Paper>
      </Grid>

      {update !== ''
        ? <UpdateItem
            user={props.user}
            org={props.org}
            item={items.filter(item => item._id === updateId)[0]}
            update={update}
            setUpdate={setUpdate}
            setLoading={setLoading}
          />
        : null
      }
    </React.Fragment>
  );
}
