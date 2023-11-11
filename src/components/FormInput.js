import React from 'react';
import { TextField } from '@mui/material';
import { useFormikContext } from 'formik';

const ErrorsMessage = ({ error, visible }) => {
  if (!visible || !error) return null;
  return (
    <p className='text-xs mt-1 text-red-500' color='red'>
      {error}
    </p>
  );
};

const FormInput = ({ name, ...otheProps }) => {
  const { setFieldTouched, handleChange, errors, touched } = useFormikContext();
  return (
    <>
      <div className=''>
        <TextField
          size='small'
          error={errors[name] ? true : false}
          onChange={handleChange(name)}
          onBlur={() => setFieldTouched(name)}
          className='border py-2 px-3 text-grey-darkest md:ml-2'
          {...otheProps}
        />
        <ErrorsMessage error={errors[name]} visible={touched[name]} />
      </div>
    </>
  );
};

export default FormInput;
