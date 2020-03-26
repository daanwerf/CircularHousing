import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from "@material-ui/core/Button";

export default function TableItem(props) {
  let item = props.item;
  let setUpdate = props.setUpdate;
  let setUpdateId = props.setUpdateId;
  let setLoading = props.setLoading;
  const user = props.user;
  const org = props.org;

  function handleChangeQuality(event) {
    event.preventDefault();
    setUpdate('changeQuality');
    setUpdateId(item._id);
  }

  function handleChangeName(event) {
    event.preventDefault();
    setUpdate('changeName');
    setUpdateId(item._id);
  }

  function handleTransfer(event) {
    event.preventDefault();
    setUpdate('transfer');
    setUpdateId(item._id);
  }

  function handleViewItem(event) {
    event.preventDefault();
    setUpdate('view');
    setUpdateId(item._id);
  }

  function refuseProposal(event) {
    event.preventDefault();
    setUpdateId(item._id);
    answerProposal(false);
  }

  function finishProposal(event) {
    event.preventDefault();
    setUpdateId(item._id);
    answerProposal(true);
  }

  function answerProposal(accept) {
    fetch('http://localhost:8000/item/answerProposal?org=' + org + '&user=' + user, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: item._id,
        accept: accept
      })
    }).then((response) => {
      if (response.status === 200) {
        setUpdate('');
        setLoading(true);
      } else {
        console.log(JSON.stringify(response));
      }
    });
  }

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>{item._id}</TableCell>
        <TableCell>{item._name}</TableCell>
        <TableCell>{item._itemOwner}</TableCell>
        <TableCell>{item._quality}</TableCell>
        <TableCell>{item._proposedOwner} {(item._proposedOwner && item._proposedOwner.length > 0) ? <div>
          <Button onClick={finishProposal} variant="contained">Accept</Button><Button
          onClick={refuseProposal} variant="contained">Deny</Button>
        </div> : ""}</TableCell>
        <TableCell align="right">
          <IconButton onClick={handleViewItem}>
            <ExpandMoreIcon color="primary"/>
          </IconButton>
          <IconButton onClick={handleChangeQuality}>
            <EditIcon color="primary"/>
          </IconButton>
          <IconButton onClick={handleChangeName}>
            <TextFieldsIcon color="primary"/>
          </IconButton>
          <IconButton onClick={handleTransfer}>
            <TransferWithinAStationIcon color="primary"/>
          </IconButton>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
