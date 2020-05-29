import { combineReducers } from 'redux';

import tasks from './tasks';
import users from './users';

export default combineReducers({
  tasks,
  users
});