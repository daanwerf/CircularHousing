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
  createButton: {
    marginLeft: theme.spacing(1),
    padding: theme.spacing(1)
  }
}));

export default function CreateItem(props) {
  const classes = useStyles();

  const user = props.user;
  const org = props.org;
  const setShow = props.setShow;

  const [itemId, setId] = React.useState('');
  const [itemName, setItemname] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [quality, setQuality] = React.useState('');
  const [materials, setMaterials] = React.useState('');

  const [alertMessage, setAlert] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setAlert('');
    fetch('http://localhost:8000/item/add?org=' + org + '&user=' + user, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: itemId,
        name: itemName,
        owner: username,
        quality: quality,
        materials: materials
      })
    })
    .then((response) => {
      setLoading(false);
      if (response.status === 200) {
        setShow('items');
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
          <Title>Create Item</Title>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                id="itemId"
                name="itemId"
                label="Item ID"
                value={itemId}
                onInput={(e : any) => setId(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="itemName"
                name="itemName"
                label="Item Name"
                value={itemName}
                onInput={(e : any) => setItemname(e.target.value)}
                fullWidth
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
                id="quality"
                name="quality"
                label="Quality"
                value={quality}
                onInput={(e : any) => setQuality(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="materials"
                name="materials"
                label="materials"
                value={materials}
                onInput={(e : any) => setMaterials(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid className={classes.createButton}>
              {loading 
                ? <CircularProgress /> 
                : <Button 
                    onClick={handleSubmit} 
                    variant="contained"
                  >Create Item
                  </Button>
              }
            </Grid>
            <Grid className={classes.createButton}>
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
