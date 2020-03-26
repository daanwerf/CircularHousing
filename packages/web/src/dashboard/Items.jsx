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
  const [loading, setLoading] = React.useState(true);
  const [update, setUpdate] = React.useState(false);
  const [updateId, setUpdateId] = React.useState('');

  const classes = useStyles();

  React.useEffect(() => {
    fetch('http://localhost:8000/item/getAll?org=Government&user=chaincodeAdmin')
      .then(results => results.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch((error) => {
        //TODO: MAKE ERROR MESSAGE HERE
        console.error(error);
      });
  }, []);

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Title>Items</Title>
          {loading ? <LinearProgress /> :
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Quality</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map(item => (
                  <TableItem 
                    key={item._id} 
                    item={item} 
                    setUpdate={setUpdate} 
                    setUpdateId={setUpdateId} 
                  />
                ))}
              </TableBody>
            </Table>}
        </Paper>
      </Grid>

      {update 
        ? <UpdateItem 
            user={props.user} 
            org={props.org} 
            itemId={updateId} 
            setUpdate={setUpdate} 
          /> 
        : null
      }
    </React.Fragment>
  );
}
