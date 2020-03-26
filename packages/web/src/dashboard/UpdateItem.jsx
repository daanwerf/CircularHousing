import React from 'react';
import UpdateQuality from './UpdateQuality';
import TransferItem from './TransferItem';
import ChangeName from './ChangeName';
import FullItem from './FullItem';

export default function UpdateItem(props) {
  const update = props.update;
  const itemId = props.item._id;

  return (
    <React.Fragment>
      {update === 'view'
        ? <FullItem
            item={props.item}
          />
        : null
      }

      {update === 'changeQuality'
        ? <UpdateQuality 
            user={props.user}
            org={props.org}
            itemId={itemId}
            setUpdate={props.setUpdate}
          />
        : null
      }

      {update === 'changeName'
        ? <ChangeName 
            user={props.user}
            org={props.org}
            itemId={itemId}
            setUpdate={props.setUpdate}
          />
        : null
      }

      {update === 'transfer'
        ? <TransferItem
            user={props.user}
            org={props.org}
            itemId={itemId}
            setUpdate={props.setUpdate}
          />
        : null
      }
    </React.Fragment>
  );
}
