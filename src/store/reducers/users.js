import usersTypes from '../types/users';

const initialState = {
  list: [],
  loaded: false
};

function users (state = initialState, action) {
  switch (action.type) {

    case usersTypes.LOAD_TO_END: {
      return {
        ...state,
        list: action.payload,
        loaded: true
      }
    }

    default: {
      return state;
    }
  }
}

export default users;
