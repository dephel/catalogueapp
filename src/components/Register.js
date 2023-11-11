import React, { useEffect, useRef, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import CustomSnackbar from '@/components/CustomSnackbar';
import FormInput from '@/components/FormInput';
import AuthContext from '../../service/context';
import storage from '../../service/storage';

const API_URL = process.env.API_URL;

const validationSchema = Yup.object().shape({
  password: Yup.string().required().label('Password'),
  email: Yup.string().email().required().label('Email'),
});

export default function Register({ registerDone, login }) {
  const initialValues = {
    password: '',
    email: '',
  };

  const [loading, setLoading] = useState(false);

  const [openSnack, setOpenSnack] = useState(null);
  const [severitySnack, setSeveritySnack] = useState(null);
  const [messageSnack, setMessageSnack] = useState(null);
  const formikRef = useRef();

  const { setUser } = React.useContext(AuthContext);

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      onSubmit={(formValues, { resetForm }) => {
        setLoading(true);

        axios
          .post(
            login
              ? `http://localhost:3001/api/login`
              : `http://localhost:3001/api/register`,
            {
              ...formValues,
            }
          )
          .then((res) => {
            setLoading(false);
            registerDone();
            formikRef.current.resetForm();
            setUser(res.data.email);
            storage.StoreUser(res.data.email);

            // console.log(res.data);
          })
          .catch((e) => {
            console.log(e);
            setLoading(false);
            if (login) {
              console.log(e);

              setMessageSnack('Incorrect Email or Password');
            } else {
              setMessageSnack('Email already taken');
            }
            setSeveritySnack('error');
            setOpenSnack(true);
          });
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
              name={'email'}
              value={values.email}
              className='w-full'
              label='Email'
              size={'small'}
            />

            <FormInput
              variant='outlined'
              name={'password'}
              value={values.password}
              className='w-full'
              label='password'
              size={'small'}
            />
          </div>

          <div className=' md:grid-cols-1 my-8 mx-9 items-center justify-center flex'></div>
          <div className=' md:grid-cols-1  gap-x-8 gap-y-8 my-8 mx-9 items-center justify-center flex'>
            {loading ? (
              <Button
                variant='outlined'
                size='large'
                className='w-3/4 md:w-full bg-green-500'
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
                {login ? 'Login' : 'Register'}
              </Button>
            )}
          </div>
        </>
      )}
    </Formik>
  );
}
