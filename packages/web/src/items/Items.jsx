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
import Title from '../dashboard/Title';
import FullItem from './FullItem';

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
  const reload = props.reload;
  const setReload = props.setReload;
  const participant = props.participant;
  const org = props.org;
  const user = props.user;

  const [view, setView] = React.useState(false);
  const [viewId, setViewId] = React.useState('');
  const [alert, setAlert] = React.useState('');

  const classes = useStyles();

  React.useEffect(() => {
    if (loading || reload) {
      setAlert('');

      fetch('http://localhost:8000/item/getParticipantItems/' + participant 
            + '?org=' + org + '&user=' + user)
        .then(results => {
          if (results.status === 200) {
            results.json()
            .then(data => {
              setItems(data);
              setLoading(false);
              setReload(false);
            })
          } else {
            setAlert(results.statusText);
            setLoading(false);
            setReload(false);
          }
        })
        .catch((error) => {
          //TODO: MAKE ERROR MESSAGE BETTER FORMATTED
          setAlert(error);
          console.error(error);
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, reload]);

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          {alert !== '' ? <Alert severity="error">{alert}</Alert> 
          : <div><Title>Items for {participant}</Title>
            {loading || reload ? <LinearProgress /> :
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell>Quality</TableCell>
                    <TableCell>Transfer</TableCell>
                    <TableCell>Transporter</TableCell>
                    <TableCell>Status</TableCell>
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
                      view={view}
                      setView={setView}
                      viewId={viewId}
                      setViewId={setViewId}
                    />
                  ))}
                </TableBody>
              </Table>}</div>
            }
        </Paper>
      </Grid>

      {view
        ? <FullItem
            item={items.filter(item => item._id === viewId)[0]}
          />
        : null
      }
    </React.Fragment>
  );
}
