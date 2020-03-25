import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import SingleNode from './SingleNode';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
}));

export default function NetworkNodes(props : any) {
  const allUsers = props.allUsers;
  const selectedUser = props.user;
  const selectedOrg = props.org;

  const classes = useStyles();
  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Title>Network nodes</Title>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Organisation</TableCell>
                <TableCell>Fingerprint</TableCell>
                <TableCell align="right">Username</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allUsers.map((user : any) => (
                <SingleNode key={user.user} userObj={user} selectedUser={selectedUser} />
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </React.Fragment>
  );
}