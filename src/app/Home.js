'use client';
import React, { useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Close from 'mdi-material-ui/Close';
import AddItem from '@/components/Additem';
import AppHeader from '@/components/Header';
import { styled } from '@mui/material/styles';
import ItemCard from '@/components/ItemCard';
import axios from 'axios';
import CustomSnackbar from '@/components/CustomSnackbar';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Register from '@/components/Register';
import AuthContext from '../../service/context';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function Home() {
  const [opendraw, setOpendraw] = useState(false);
  const [login, setLogin] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authDialog, setAuthDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [openSnack, setOpenSnack] = useState(null);
  const [severitySnack, setSeveritySnack] = useState(null);
  const [messageSnack, setMessageSnack] = useState(null);

  useEffect(() => {
    getItems();
  }, []);
  const { user } = React.useContext(AuthContext);

  useEffect(() => {
    if (user) getItems();
  }, [user]);

  const getItems = () => {
    axios
      .get('http://localhost:3001/api/get-items', { params: { user } })
      .then((res) => {
        console.log(res.data);
        setItems(res.data);
        setLoading(false);
      });
  };
  const addingDone = () => {
    getItems();
    setCurrentItem(null);
    setOpendraw(false);
    setMessageSnack('Item Added successfully');
    setSeveritySnack('success');
    setOpenSnack(true);
  };
  const UpdateDone = () => {
    getItems();
    setCurrentItem(null);
    setOpendraw(false);
    setMessageSnack('Item Updated successfully');
    setSeveritySnack('success');
    setOpenSnack(true);
  };
  const deleteDone = () => {
    getItems();
    setCurrentItem(null);
    setOpendraw(false);
    setMessageSnack('Item Deleted successfully');
    setSeveritySnack('success');
    setOpenSnack(true);
  };
  const registerDone = () => {
    setAuthDialog(false);
    if (login) {
      setMessageSnack('Login successfully');
    } else {
      setMessageSnack('Register successfully');
    }
    setSeveritySnack('success');
    setLogin(false);
    setOpenSnack(true);
  };

  const Header = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(3, 4),
    justifyContent: 'space-between',
    backgroundColor: theme.palette.background.default,
  }));

  return (
    <>
      <CustomSnackbar
        open={openSnack}
        handleClose={() => {
          setOpenSnack(false);
        }}
        message={messageSnack}
        severity={severitySnack}
      />
      <div className=''>
        <AppHeader
          onAddItem={() => {
            setOpendraw(true);
          }}
          onAuth={() => {
            setAuthDialog(true);
            setLogin(false);
          }}
          onAuthLogin={() => {
            setAuthDialog(true);
            setLogin(true);
          }}
        />
        <div className='flex justify-center items-center'>
          {items.length > 0 ? (
            <div className='grid grid-cols-3 gap-2 md:gap-x-4 gap-y-4 mt-4 mx-auto'>
              {items.map((item, index) => {
                return (
                  <div key={index} className='text-center'>
                    <ItemCard
                      item={item}
                      deleteDone={deleteDone}
                      editItem={() => {
                        setCurrentItem(item);
                        setOpendraw(true);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <>
              {!user ? (
                <Typography className='text-center mt-8'>
                  Please Register or Login To View and Add Items
                </Typography>
              ) : (
                <Typography className='text-center mt-8'>
                  No Item Added
                </Typography>
              )}
            </>
          )}
        </div>

        <Drawer
          open={opendraw}
          anchor='right'
          onClose={() => {
            setOpendraw(false);
            setCurrentItem(null);
          }}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: ['100%', 400] } }}
        >
          <div className=''>
            <Header>
              <Typography variant='h6'>
                {!currentItem ? 'Add New Item' : 'Update Item'}
              </Typography>
              <Close
                fontSize='small'
                onClick={() => setOpendraw(false)}
                sx={{ cursor: 'pointer' }}
              />
            </Header>
            <AddItem
              updateError={() => {}}
              addingDone={addingDone}
              UpdateDone={UpdateDone}
              currentItem={currentItem}
            />
          </div>
        </Drawer>
      </div>

      <BootstrapDialog
        onClose={() => setAuthDialog(false)}
        aria-labelledby='customized-dialog-title'
        open={authDialog}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
          {login ? 'Login' : 'Register'}
        </DialogTitle>
        <IconButton
          aria-label='close'
          onClick={() => setAuthDialog(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close fontSize='small' sx={{ cursor: 'pointer' }} />
        </IconButton>
        <DialogContent dividers>
          <Register registerDone={registerDone} login={login} />
        </DialogContent>
      </BootstrapDialog>
    </>
  );
}
