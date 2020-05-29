import usersTypes from '../types/users';
import axios from "axios";

const usersLoaded = users => ({
  type: usersTypes.LOAD_TO_END,
  payload: users
});

const load = () => dispatch => {
  axios.post('/users', {})
  .then(success => {
    dispatch(usersLoaded(success.data));
  }, error => {
    console.log('users load error', error.response);
  });
};

export default {
  load
}