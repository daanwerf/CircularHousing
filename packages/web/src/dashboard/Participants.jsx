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
import Title from './Title';

const useStyles = makeStyles(theme => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
}));

export default function Participants() {
  const classes = useStyles();
  const [allPart, setAllpart] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('http://localhost:8000/participant/getAll?org=Government&user=chaincodeAdmin')
      .then(results => results.json())
      .then(data => {
        setAllpart(data);
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
          <Title>Registered Participants</Title>
          {isLoading ? <LinearProgress /> :
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Organisation</TableCell>
                  <TableCell>Fingerprint</TableCell>
                  <TableCell align="right">View items</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                    {allPart.map(part => (
                  <TableRow key={part._id}>
                    <TableCell>{part._id}</TableCell>
                    <TableCell>{part._name}</TableCell>
                    <TableCell>{part._msp}</TableCell>
                    <TableCell>{part._identities
                      .filter((identity : any) => identity.status === true)[0].fingerprint}</TableCell>
                    <TableCell align="right">VIEWALLITEMSTODO</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          }
        </Paper>
      </Grid>
    </React.Fragment>
  );
}
