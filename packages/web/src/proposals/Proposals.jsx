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
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress';
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';
import Title from '../dashboard/Title';
import FullItem from '../items/FullItem';

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
  const [proposalAlert, setProposalalert] = React.useState('');
  const [loadingProposalAnswer, setLoadingproposalanswer] = React.useState(false);
  const [view, setView] = React.useState(false);
  const [viewId, setViewId] = React.useState('');

  const classes = useStyles();

  function handleViewItem(event) {
    const itemId = event.currentTarget.getAttribute('data-item');
    console.log('View item ' + itemId);
    setViewId(itemId);
    setView(true);
  }

  function acceptProposal(event) {
    console.log('Accept proposal!');
    const itemId = event.currentTarget.getAttribute('data-item');
    answerProposal(true, itemId);
  }

  function rejectProposal(event) {
    console.log('Reject proposal!');
    const itemId = event.currentTarget.getAttribute('data-item');
    answerProposal(false, itemId);
  }

  function answerProposal(accept, itemId) {
    setProposalalert('');
    setLoadingproposalanswer(true);

    fetch('http://localhost:8000/item/answerProposal?org=' + props.org + '&user=' + props.user, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: itemId,
        accept: accept.toString()
      })
    }).then((response) => {
      setLoadingproposalanswer(false);
      if (response.status === 200) {
        setLoading(true);
        setLoadingproposalanswer(false);
      } else {
        setAlert(response.statusText);
      }
    }).catch(response => {
      setLoadingproposalanswer(false);
      console.log(response);
    })
  }

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
                    <TableCell align="right">Answer proposal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map(item => (
                    <TableRow key={item._id}>
                      <TableCell>{item._id.substring(0, 10)}...</TableCell>
                      <TableCell>{item._name}</TableCell>
                      <TableCell>{item._itemOwner}</TableCell>
                      <TableCell>{item._quality}</TableCell>
                      <TableCell>
                        <IconButton onClick={handleViewItem} data-item={item._id}>
                          <ExpandMoreIcon color="primary"/>
                        </IconButton>
                      </TableCell>
                      <TableCell align="right">
                        {loadingProposalAnswer ? <CircularProgress /> :
                          item._proposedOwner && item._proposedOwner.length > 0 ?
                            <div>
                              <IconButton onClick={acceptProposal} data-item={item._id}>
                                <CheckIcon style={{fill: "green"}} />
                              </IconButton>
                              <IconButton onClick={rejectProposal} data-item={item._id}>
                                <ClearIcon style={{fill: "red"}} />
                              </IconButton>
                              {proposalAlert === '' ? null :
                                <Alert severity="error">{proposalAlert}</Alert>
                              }
                          </div> : ""
                        }
                      </TableCell>
                    </TableRow>
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
