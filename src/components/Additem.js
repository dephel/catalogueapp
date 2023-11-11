import React, { useEffect, useRef, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AuthContext from '../../service/context';

import CustomSnackbar from '@/components/CustomSnackbar';
import FormInput from '@/components/FormInput';

const API_URL = process.env.API_URL;

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label('Name'),
  // itemCode: Yup.string().required().label('Item-Code'),
  price: Yup.number().required().label('Price'),
});

export default function AddItem({ currentItem, UpdateDone, addingDone }) {
  const initialValues = {
    name: '',
    itemType: '',
    price: '',
  };

  const [openSnack, setOpenSnack] = useState(false);
  const [messageSnack, setMessageSnack] = useState('');
  const [severitySnack, setSeveritySnack] = useState('success');
  const [loading, setLoading] = useState(false);
  const { user } = React.useContext(AuthContext);

  const formikRef = useRef();

  useEffect(() => {
    if (currentItem && formikRef.current) {
      // console.log('currentItems', currentItem);
      formikRef.current.setFieldValue('name', currentItem.itemName);
      formikRef.current.setFieldValue('price', currentItem.itemPrice);
      formikRef.current.setFieldValue('itemType', currentItem.itemType);

      formikRef.current.setErrors('name', []);
      formikRef.current.setErrors('itemType', []);
      formikRef.current.setErrors('price', []);
    }

    if (!currentItem) {
      formikRef.current.resetForm();
    }
  }, [currentItem]);

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      onSubmit={(formValues, { resetForm }) => {
        // console.log('formValues', formValues);
        if (currentItem) {
          setLoading(true);

          axios
            .post(`http://localhost:3001/api/item-edit`, {
              ...formValues,
              itemCode: currentItem.itemCode,
              id: currentItem.id,
            })
            .then((res) => {
              setMessageSnack('Item Updated successfully');
              setSeveritySnack('success');
              setOpenSnack(true);
              setLoading(false);
              UpdateDone();
              formikRef.current.resetForm();
            })
            .catch((e) => {
              setMessageSnack('Error in Updating Item');

              setLoading(false);
              setSeveritySnack('error');
              setOpenSnack(true);
            });
        } else {
          setLoading(true);

          function generateRandomItemCode() {
            const prefix = 'CU-';
            const randomChars = Array.from({ length: 4 }, () =>
              String.fromCharCode(Math.floor(Math.random() * 26) + 65)
            ).join('');

            return prefix + randomChars;
          }

          const randomItemCode = generateRandomItemCode();
          // console.log('API_URL', API_URL);
          axios
            .post(`http://localhost:3001/api/items-add`, {
              ...formValues,
              itemCode: randomItemCode,
              userId: user,
            })
            .then((res) => {
              console.log('response', res);
              setMessageSnack('Item added successfully');
              setSeveritySnack('success');
              setOpenSnack(true);
              setLoading(false);
              addingDone();
              formikRef.current.resetForm();
            })
            .catch((e) => {
              console.log(e);
              setMessageSnack('Error in adding Item');
              setLoading(false);
              setSeveritySnack('error');
              setOpenSnack(true);
            });
        }
      }}
      validationSchema={validationSchema}
    >
      {({
        handleSubmit,
        values,
        resetForm,
        setErrors,
        setFieldValue,
        handleChange,
      }) => (
        <>
          <CustomSnackbar
            open={openSnack}
            handleClose={() => {
              setOpenSnack(false);
            }}
            message={messageSnack}
            severity={severitySnack}
          />

          <div className='grid md:grid-cols-1 md:gap-x-8 gap-y-8 mx-9'>
            <FormInput
              variant='outlined'
              name={'name'}
              value={values.name}
              className='w-full'
              label='Name'
              size={'small'}
            />
            {/* <FormInput
              variant='outlined'
              name={'itemCode'}
              value={values.itemCode}
              className='w-full'
              label='Item-Code'
              size={'small'}
            /> */}
            <FormInput
              variant='outlined'
              name={'price'}
              value={values.price}
              className='w-full'
              label='Price'
              type='number'
              size={'small'}
            />
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-label'>Item Type</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                size={'small'}
                value={values.itemType}
                label='Item-Type'
                onChange={(e) => setFieldValue('itemType', e.target.value)}
              >
                <MenuItem value={1}>Type 1</MenuItem>
                <MenuItem value={2}>Type 2</MenuItem>
                <MenuItem value={3}>Type 3</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className=' md:grid-cols-1 my-8 mx-9 items-center justify-center flex'></div>
          <div className=' md:grid-cols-1  gap-x-8 gap-y-8 my-8 mx-9 items-center justify-center flex'>
            {loading ? (
              <Button
                variant='outlined'
                size='large'
                className='w-3/4 md:w-full'
              >
                <CircularProgress />
              </Button>
            ) : (
              <Button
                className='w-3/4 md:w-full bg-green-500'
                variant='contained'
                type='submit'
                onClick={handleSubmit}
                size='large'
              >
                {currentItem ? <>UPDATE ITEM</> : <>ADD ITEM</>}
              </Button>
            )}
          </div>
        </>
      )}
    </Formik>
  );
}
