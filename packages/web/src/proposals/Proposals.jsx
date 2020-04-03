import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import Title from '../dashboard/Title';
import FullItem from '../items/FullItem';
import SingleProposal from './SingleProposal';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
}));

export default function Proposals(props) {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [alert, setAlert] = React.useState('');
  const [view, setView] = React.useState(false);
  const [viewId, setViewId] = React.useState('');

  const classes = useStyles();

  React.useEffect(() => {
    if (loading) {
      setAlert('');

      fetch('http://localhost:8000/item/getParticipantProposals/' 
            + props.participant + '?org=' + props.org + '&user=' + props.user)
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          {alert !== '' ? <Alert severity="error">{alert}</Alert> 
          : <div><Title>Proposals to {props.participant}</Title>
            {loading ? <LinearProgress /> :
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell>Current owner</TableCell>
                    <TableCell>Quality</TableCell>
                    <TableCell></TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map(item => (
                    <SingleProposal key={item._id}
                      item={item}
                      user={props.user}
                      org={props.org}
                      view={view}
                      setView={setView}
                      viewId={viewId}
                      setViewId={setViewId}
                      setProposalAccepted={props.setProposalAccepted}
                      setLoading={setLoading}
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
