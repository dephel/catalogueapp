import * as SecureStore from 'localforage';

const key = 'authToken';

const StoreUser = async (user) => {
  try {
    await SecureStore.setItem('user', user);
  } catch (error) {}
};
const getUser = async () => {
  try {
    return SecureStore.getItem('user');
  } catch (error) {}
};

const removeUser = async () => {
  try {
    await SecureStore.removeItem('user');
  } catch (error) {}
};

export default {
  StoreUser,
  getUser,
  removeUser,
};
