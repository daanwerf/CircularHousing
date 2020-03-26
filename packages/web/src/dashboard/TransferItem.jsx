import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Title from './Title';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  transferButton: {
    marginLeft: theme.spacing(1),
    padding: theme.spacing(1)
  }
}));

export default function UpdateQuality(props) {
  const classes = useStyles();

  const user = props.user;
  const org = props.org;
  const itemId = props.itemId;
  const setUpdate = props.setUpdate;

  const [newOwner, setNewowner] = React.useState('');

  const [alertMessage, setAlert] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setAlert('');
    fetch('http://localhost:8000/item/transfer?org=' + org + '&user=' + user, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: itemId,
        newOwner: newOwner
      })
    })
    .then((response) => {
      setLoading(false);
      if (response.status === 200) {
        setUpdate('');
      } else {
        setAlert(response.statusText);
      }
    })
    .catch((error) => {
      setLoading(false);
      setAlert('Undefined error happened');
    });
  }

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Title>Transfer of item {itemId}</Title>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                id="newOwner"
                name="newOwner"
                label="New Owner"
                value={newOwner}
                onInput={e => setNewowner(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid className={classes.updateButton}>
              {loading 
                ? <CircularProgress /> 
                : <Button 
                    onClick={handleSubmit} 
                    variant="contained"
                  >Transfer Item
                  </Button>
              }
            </Grid>
            <Grid className={classes.transferButton}>
              {alertMessage === '' ? null :
                <Alert severity="error">{alertMessage}</Alert>
              }
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </React.Fragment>
  );
}
