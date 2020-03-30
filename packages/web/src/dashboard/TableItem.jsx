import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";
import CircularProgress from '@material-ui/core/CircularProgress';
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';

export default function TableItem(props) {
  const [alertMessage, setAlert] = React.useState('');
  const [loadingProposalAnswer, setLoadingProposalAnswer] = React.useState(false);

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
    setAlert('');
    setLoadingProposalAnswer(true);
    fetch('http://localhost:8000/item/answerProposal?org=' + org + '&user=' + user, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: item._id,
        accept: accept.toString()
      })
    }).then((response) => {
      setLoadingProposalAnswer(false);
      if (response.status === 200) {
        setUpdate('');
        setLoading(true);
      } else {
        setAlert(response.statusText);
      }
    }).catch(response => {
      setLoadingProposalAnswer(false);
      console.log(response);
    })
  }

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>{item._id.substring(0, 10)}...</TableCell>
        <TableCell>{item._name}</TableCell>
        <TableCell>{item._itemOwner}</TableCell>
        <TableCell>{item._quality}</TableCell>
        <TableCell>
          {loadingProposalAnswer ? <CircularProgress /> :
            item._proposedOwner && item._proposedOwner.length > 0 ?
            	<div>
                {item._proposedOwner}
                <IconButton onClick={finishProposal}>
                  <CheckIcon style={{fill: "green"}} />
                </IconButton>
                <IconButton onClick={refuseProposal}>
                  <ClearIcon style={{fill: "red"}} />
                </IconButton>
  	            {alertMessage === '' ? null :
  	              <Alert severity="error">{alertMessage}</Alert>
  	            }
          	</div> : ""
          }
        </TableCell>
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
