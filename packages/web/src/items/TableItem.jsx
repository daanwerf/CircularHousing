import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import EditableItemCell from './EditableItemCell';
import { ALLOWEDQUALITIES } from '../config/Qualities';

export default function TableItem(props) {
  let item = props.item;
  const user = props.user;
  const org = props.org;
  const view = props.view;
  const setView = props.setView;
  const viewId = props.viewId;
  const setViewId = props.setViewId;

  function handleViewItem(event) {
    event.preventDefault();
    setView(true);
    setViewId(item._id);
  }

  function handleHideItem(event) {
    setView(false);
  }

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>{item._id.substring(0, 10)}...</TableCell>
        <EditableItemCell
          value={item._name}
          apiCall={'item/updateName?org=' + org + '&user=' + user}
          itemId={item._id}
          editKey={'name'}
        />
        <TableCell>{item._itemOwner}</TableCell>
        <EditableItemCell 
          value={item._quality} 
          apiCall={'item/updateQuality?org=' + org + '&user=' + user}
          itemId={item._id}
          editKey={'quality'}
          dropdown={true}
          values={ALLOWEDQUALITIES}
        />
        <EditableItemCell
          value={item._proposedOwner ? item._proposedOwner : ''}
          apiCall={'item/proposeTransfer?org=' + org + '&user=' + user}
          itemId={item._id}
          editKey={'newOwner'}
        />

        <TableCell align="right">
          {view && viewId === item._id
            ? <IconButton onClick={handleHideItem}>
                <ExpandLessIcon color="primary"/>
              </IconButton>
            : <IconButton onClick={handleViewItem}>
                <ExpandMoreIcon color="primary"/>
              </IconButton>
          }
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
