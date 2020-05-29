import tasksTypes from '../types/tasks';
import axios from "axios";

const tasksLoaded = (tasksData, adding = true) => ({
  type: adding ? tasksTypes.LOAD_TO_END : tasksTypes.LOAD,
  payload: tasksData
});

const tasksFilterProgress = () => ({
  type: tasksTypes.TASKS_FILTER_PROGRESS,
  payload: false
})

const tasksFilterError = () => ({
  type: tasksTypes.TASKS_FILTER_ERROR,
  payload: false
});

const clearTasksFilterStatus = () => ({
  type: tasksTypes.TASKS_FILTER_CLEAR,
  payload: false
});

const setFilter = filter => ({
  type: tasksTypes.SET_FILTER,
  payload: {filter}
});

// task change

const taskChangeSuccess = (id, params) => ({
  type: tasksTypes.TASK_CHANGE_SUCCESS,
  payload: {id, params}
})

const taskChangeError = () => ({
  type: tasksTypes.TASK_CHANGE_ERROR,
  payload: false
})

const clearTaskChangeStatus = () => ({
  type: tasksTypes.TASK_CHANGE_CLEAR,
  payload: false
});

// task remove

const taskRemoveSuccess = (id) => ({
  type: tasksTypes.TASK_REMOVE_SUCCESS,
  payload: {id}
});

const taskRemoveError = () => ({
  type: tasksTypes.TASK_REMOVE_ERROR,
  payload: false
});

const clearTaskRemoveStatus = () => ({
  type: tasksTypes.TASK_REMOVE_CLEAR,
  payload: false
});

// task add

const taskAddSuccess = () => ({
  type: tasksTypes.TASK_ADD_SUCCESS,
  payload: false
})

const taskAddError = () => ({
  type: tasksTypes.TASK_ADD_ERROR,
  payload: false
})

const clearTaskAddStatus = () => ({
  type: tasksTypes.TASK_ADD_CLEAR,
  payload: false
});

const filter = (filter, adding, from = 0, count = 10) => dispatch => {
  dispatch(tasksFilterProgress());

  axios.post('/tasks/filter', {filter, from, count})
  .then(success => {
    dispatch(tasksLoaded(success.data, adding));
  }, error => {
    dispatch(tasksFilterError());
  });
};

const change = (id, params) => dispatch => {
  axios.post('/tasks/change', {id, params})
    .then(success => {
      dispatch(taskChangeSuccess(id, params));
    }, error => {
      dispatch(taskChangeError());
    });
};

const remove = id => dispatch => {
  axios.post('/tasks/remove', {id})
    .then(success => {
      dispatch(taskRemoveSuccess(id));
    }, error => {
      dispatch(taskRemoveError());
    })
};

const add = (title, userId, completed = false) => dispatch => {
  axios.post('/tasks/add', {title, userId, completed})
  .then(success => {
    dispatch(taskAddSuccess());
  }, error => {
    dispatch(taskAddError());
  })
};

export default {
  setFilter,
  filter,
  change,
  remove,
  add,
  clearTaskRemoveStatus,
  clearTaskAddStatus,
  clearTaskChangeStatus,
  clearTasksFilterStatus
}