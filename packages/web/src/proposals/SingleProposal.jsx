import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import Tooltip from '@material-ui/core/Tooltip';

export default function SingleProposal(props) {
  let item = props.item;
  const user = props.user;
  const org = props.org;
  const view = props.view;
  const setView = props.setView;
  const viewId = props.viewId;
  const setViewId = props.setViewId;

  const [loadingProposalAnswer, setLoadingproposalanswer] = React.useState(false);
  const [proposalAlert, setProposalalert] = React.useState('');

  function handleViewItem(event) {
    setView(true);
    setViewId(item._id);
  }

  function handleHideItem(event) {
    setView(false);
  }

  function acceptProposal(event) {
    answerProposal(true);
  }

  function rejectProposal(event) {
    answerProposal(false);
  }

  function answerProposal(accept) {
    setProposalalert('');
    setLoadingproposalanswer(true);

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
      setLoadingproposalanswer(false);
      if (response.status === 200) {
        props.setLoading(true);
        setLoadingproposalanswer(false);
        if (accept) {
          props.setProposalAccepted(true);
        }
      } else {
        setProposalalert(response.statusText);
      }
    }).catch(response => {
      setLoadingproposalanswer(false);
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
          {view && viewId === item._id
            ? <Tooltip title="Show less">
                <IconButton onClick={handleHideItem}>
                  <ExpandLessIcon color="primary"/>
                </IconButton>
              </Tooltip>
            : <Tooltip title="Show more">
                <IconButton onClick={handleViewItem}>
                  <ExpandMoreIcon color="primary"/>
                </IconButton>
              </Tooltip>
          }
        </TableCell>
        <TableCell align="right">
        	{loadingProposalAnswer ? <CircularProgress /> :
              item._proposedOwner && item._proposedOwner.length > 0 ?
                <div>
                  <Tooltip title="Accept proposal">
                    <IconButton onClick={acceptProposal}>
                      <CheckIcon style={{fill: "green"}} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Reject proposal">
                    <IconButton onClick={rejectProposal}>
                      <ClearIcon style={{fill: "red"}} />
                    </IconButton>
                  </Tooltip>
                  {proposalAlert === '' ? null :
                    <Alert severity="error">{proposalAlert}</Alert>
                  }
              </div> : ""
            }
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}