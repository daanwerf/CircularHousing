import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';

// Generate Order Data (never actually used, see comment below)
function createData(_id : string, _name : string, _msp : string, _identities : any) {
  return { _id, _name, _msp, _identities};
}

// This is needed to make the types of rows work, this data is never actually used
const rows = [
  createData("casper", "Casper Athmer", "WoodGatherer", [{"status": true, "fingerprint": "test"}])
];

const useStyles = makeStyles(theme => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Users() {
  const [allPart, setAllpart] = React.useState(rows);
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

  const classes = useStyles();

  return (
    <React.Fragment>
      <Title>Registered Participants</Title>
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
          {isLoading ? "Loading..." : allPart.map(part => (
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
    </React.Fragment>
  );
}
