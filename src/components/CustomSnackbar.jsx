import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

export default function CustomSnackbar({
  message,
  open,
  severity,
  onClose,
  Duration,
  handleClose,
}) {
  const [openSnack, setOpenSnack] = React.useState(open);

  return (
    <Stack spacing={2} sx={{ width: '5%' }}>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => handleClose(false)}
      >
        <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
          {message}!
        </Alert>
      </Snackbar>
    </Stack>
  );
}
