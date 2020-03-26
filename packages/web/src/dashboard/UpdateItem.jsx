import React from 'react';
import UpdateQuality from './UpdateQuality';
import TransferItem from './TransferItem';
import ChangeName from './ChangeName';

export default function UpdateItem(props) {
  const update = props.update;

  return (
    <React.Fragment>
      {update === 'changeQuality'
        ? <UpdateQuality 
            user={props.user}
            org={props.org}
            itemId={props.itemId}
            setUpdate={props.setUpdate}
          />
        : null
      }

      {update === 'changeName'
        ? <ChangeName 
            user={props.user}
            org={props.org}
            itemId={props.itemId}
            setUpdate={props.setUpdate}
          />
        : null
      }

      {update === 'transfer'
        ? <TransferItem
            user={props.user}
            org={props.org}
            itemId={props.itemId}
            setUpdate={props.setUpdate}
          />
        : null
      }
    </React.Fragment>
  );
}
