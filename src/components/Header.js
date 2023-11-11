import React from 'react';
import Button from '@mui/material/Button';
import MenuIcon from '@material-ui/icons/Menu';
import AuthContext from '../../service/context';
import storage from '../../service/storage';

function Header({ onAddItem, onAuth, onAuthLogin }) {
  const { user, setUser } = React.useContext(AuthContext);

  return (
    <div>
      <nav className='bg-green-700 shadow shadow-gray-300 w-100 px-8 md:px-auto'>
        <div className='md:h-20 h-32 mx-auto md:px-4 container flex items-center justify-between flex-wrap md:flex-nowrap'>
          <div className='text-white md:order-1'>
            <MenuIcon fontSize='small' sx={{ cursor: 'pointer' }} />
          </div>
          <div className='text-gray-500 order-3 w-full md:w-auto md:order-2'>
            <ul className='flex font-semibold justify-between'>
              <li className='md:px-4 md:py-2 text-white'>
                <a href='#'>Dalvick Tech</a>
              </li>
            </ul>
          </div>
          <div className='order-2 md:order-3'>
            {user ? (
              <>
                <div className='flex items-center justify-center'>
                  <Button
                    variant='contained'
                    className='bg-blue-500 text-white'
                    size='small'
                    onClick={onAddItem}
                  >
                    Add Item
                  </Button>
                  <div>
                    <p className='text-xs cursor-pointer ml-2 text-white'>
                      {user}
                    </p>
                    <p
                      className='text-sm cursor-pointer mt-1 ml-2 text-white'
                      onClick={() => {
                        setUser(null);
                        storage.removeUser();
                      }}
                    >
                      logout
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Button
                  variant='contained'
                  className='bg-blue-500 mr-1'
                  onClick={onAuth}
                  size='small'
                >
                  Register
                </Button>
                <Button
                  variant='outlined'
                  size='small'
                  className='bg-blue-500 text-white'
                  onClick={onAuthLogin}
                >
                  login
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
