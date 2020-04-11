import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TransportItem from './TransportItem';
import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import Title from '../dashboard/Title';

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
  const [loading, setLoading] = React.useState(true);
  const participant = props.participant;
  const org = props.org;
  const user = props.user;

  const [alert, setAlert] = React.useState('');

  const classes = useStyles();

  React.useEffect(() => {
    if (loading) {
      setAlert('');

      fetch('http://localhost:8000/item/getTransportItems/' + participant 
            + '?org=' + org + '&user=' + user)
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
          //TODO: MAKE ERROR MESSAGE BETTER FORMATTED
          setAlert(error);
          console.error(error);
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    <TableCell>Shipping from</TableCell>
                    <TableCell>Shipping to</TableCell>
                    <TableCell align="right">Deliver</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map(item => (
                    <TransportItem
                      user={props.user}
                      org={props.org}
                      key={item._id}
                      item={item}
                      setLoading={setLoading}
                    />
                  ))}
                </TableBody>
              </Table>}</div>
            }
        </Paper>
      </Grid>
    </React.Fragment>
  );
}
