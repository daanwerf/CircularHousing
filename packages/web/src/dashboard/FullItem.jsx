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

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
}));

export default function FullItem(props) {
  const item = props.item;

  function parseHistory(hist) {
    if (hist.type === "TRANSFER") {
      return hist.description.oldOwner + " transferred " + hist.itemName
        + " to " + hist.ownerId;
    } else if (hist.type === "CREATE") {
      return hist.ownerId + " created " + hist.itemName + " with quality " 
        + hist.description.quality;
    } else if (hist.type === "RENAME") {
      return hist.ownerId + " renamed " + hist.description.oldName + " to "
        + hist.itemName;
    } else if (hist.type === "UPDATE") {
      return hist.ownerId + " updated quality of " + hist.itemName + " from "
        + hist.description.oldQuality + " to " + hist.description.newQuality;
    } else {
      return hist.type + ":" + hist.description;
    }
  }

  function parseDate(date) {
    return new Date(parseInt(date)).toLocaleString();
  }

  const classes = useStyles();
  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Title>Item {item._id}</Title>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{item._name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Creation Date</TableCell>
                <TableCell>{parseDate(item._creationDate)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Owner</TableCell>
                <TableCell>{item._itemOwner}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Quality</TableCell>
                <TableCell>{item._quality}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Materials</TableCell>
                <TableCell>{item._materials.join(',')}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Title>History</Title>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Event</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {item._itemHistory.map(hist => (
                <TableRow key={hist.date}>
                  <TableCell>{parseDate(hist.date)}</TableCell>
                  <TableCell>{parseHistory(hist)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </React.Fragment>
  );
}