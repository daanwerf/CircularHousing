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
  registerButton: {
    marginLeft: theme.spacing(1),
    padding: theme.spacing(1)
  }
}));

export default function Register(props) {
  const classes = useStyles();

  const user = props.user;
  const org = props.org;
  const setShow = props.setShow;

  const [name, setName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [msp, setMsp] = React.useState('');
  const [fingerprint, setFingerprint] = React.useState('');

  const [alertMessage, setAlert] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setAlert('');
    fetch('http://localhost:8000/participant/register?org=' + org + '&user=' + user, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: username,
        name: name,
        msp: msp,
        certificate: fingerprint
      })
    })
    .then((response) => {
      setLoading(false);
      if (response.status === 200) {
        setShow('users');
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
          <Title>Register Participant</Title>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                id="fullName"
                name="fullName"
                label="Full Name"
                value={name}
                onInput={(e : any) => setName(e.target.value)}
                fullWidth
                autoComplete="fname"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="username"
                name="username"
                label="Username"
                value={username}
                onInput={(e : any) => setUsername(e.target.value)}
                fullWidth
                autoComplete="username"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="organisation"
                name="organisation"
                label="Organisation"
                value={msp}
                onInput={(e : any) => setMsp(e.target.value)}
                fullWidth
                autoComplete="organisation"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="fingerprint"
                name="fingerprint"
                label="Fingerprint"
                value={fingerprint}
                onInput={(e : any) => setFingerprint(e.target.value)}
                fullWidth
                autoComplete="fingerprint"
              />
            </Grid>
            <Grid className={classes.registerButton}>
              {loading 
                ? <CircularProgress /> 
                : <Button 
                    onClick={handleSubmit} 
                    variant="contained"
                  >Register
                  </Button>
              }
            </Grid>
            <Grid className={classes.registerButton}>
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
