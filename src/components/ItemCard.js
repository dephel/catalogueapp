import { Fragment, useState, useEffect } from 'react';
import { IconButton } from '@mui/material';
import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PencilOutline from 'mdi-material-ui/PencilOutline';
import { TrashCan } from 'mdi-material-ui';
import DotsVertical from 'mdi-material-ui/DotsVertical';
import axios from 'axios';

export default function ItemCard({ item, deleteDone, editItem }) {
  const RowOptions = ({ item }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const rowOptionsOpen = Boolean(anchorEl);

    const handleRowOptionsClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleRowOptionsClose = () => {
      setAnchorEl(null);
    };

    useEffect(() => {}, []);

    return (
      <Fragment>
        <IconButton size='small' onClick={handleRowOptionsClick}>
          <DotsVertical fontSize='small' className='text-black' />
        </IconButton>
        <Menu
          keepMounted
          anchorEl={anchorEl}
          open={rowOptionsOpen}
          onClose={handleRowOptionsClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem>
            <IconButton size='small' onClick={editItem}>
              <div className='text-sm'>
                <PencilOutline className='text-sm' sx={{ mr: 1 }} />
                Edit
              </div>
            </IconButton>
          </MenuItem>
          <MenuItem
            onClick={() => {
              axios
                .post(`http://localhost:3001/api/item-delete`, { id: item.id })
                .then(() => {
                  deleteDone();
                });
            }}
            classname='text-sm'
          >
            <div className='text-sm'>
              <TrashCan fontSize='small' sx={{ mr: 1 }} />
              Delete
            </div>
          </MenuItem>
        </Menu>
      </Fragment>
    );
  };

  return (
    <div className='h-24 w-28 md:h-32 md:w-36 relative rounded-md grid justify-centejr items-between bg-gray-200 shadow-lg'>
      <div className='flex items-start justify-center relative overflow-hidden'>
        <p className='text-center '>{item.itemName}</p>{' '}
        <div className='absolute right-1 top-1 text-black ml-2'>
          <RowOptions item={item} />
        </div>
      </div>
      <div className='flex items-center justify-center'>
        <div className='h-6 text-center bg-green-500 absolute bottom-1 w-28 md:w-32 rounded-md text-white text-sm'>
          TZS {item.itemPrice}
        </div>
      </div>
    </div>
  );
}
