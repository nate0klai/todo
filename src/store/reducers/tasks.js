import tasksTypes from '../types/tasks';

const initialState = {
  filter: {
    status: 0,
    user: 0,
    title: ''
  },
  filterTasksStatus: null,
  changeTaskStatus: null,
  removeTaskStatus: null,
  addTaskStatus: null,
  list: [],
  count: 0
};

function tasks (state = initialState, action) {
  switch (action.type) {

    case tasksTypes.LOAD_TO_END: {
      const {list, count} = action.payload;
      return {
        ...state,
        list: [...state.list, ...list],
        count,
        filterTasksStatus: initialState.filterTasksStatus
      }
    }

    case tasksTypes.LOAD: {
      const {list, count} = action.payload;
      return {
        ...state,
        list,
        count,
        filterTasksStatus: initialState.filterTasksStatus
      }
    }

    case tasksTypes.TASKS_FILTER_PROGRESS: {
      return {
        ...state,
        filterTasksStatus: 'progress',
      }
    }

    case tasksTypes.TASKS_FILTER_ERROR: {
      return {
        ...state,
        filterTasksStatus: 'error'
      }
    }

    case tasksTypes.TASKS_FILTER_CLEAR: {
      return {
        ...state,
        filterTasksStatus: initialState.filterTasksStatus
      }
    }

    case tasksTypes.SET_FILTER: {
      return {
        ...state,
        filter: {...state.filter, ...action.payload.filter}
      }
    }

    case tasksTypes.TASK_CHANGE_SUCCESS: {
      const {id, params} = action.payload;
      return {
        ...state,
        list: state.list.map(t => t.id === id ? {...t, ...params} : t)
      }
    }

    case tasksTypes.TASK_CHANGE_ERROR: {
      return {
        ...state,
        changeTaskStatus: 'error'
      }
    }

    case tasksTypes.TASK_CHANGE_CLEAR: {
      return {
        ...state,
        changeTaskStatus: initialState.changeTaskStatus
      }
    }

    case tasksTypes.TASK_REMOVE_SUCCESS: {
      const {id} = action.payload;
      return {
        ...state,
        list: state.list.filter(t => t.id !== id),
        count: state.count - 1
      }
    }

    case tasksTypes.TASK_REMOVE_ERROR: {
      return {
        ...state,
        removeTaskStatus: 'error'
      }
    }

    case tasksTypes.TASK_REMOVE_CLEAR: {
      return {
        ...state,
        removeTaskStatus: initialState.removeTaskStatus
      }
    }

    case tasksTypes.TASK_ADD_SUCCESS: {
      return {
        ...state,
        addTaskStatus: 'success'
      }
    }

    case tasksTypes.TASK_ADD_ERROR: {
      return {
        ...state,
        addTaskStatus: 'error'
      }
    }

    case tasksTypes.TASK_ADD_CLEAR: {
      return {
        ...state,
        addTaskStatus: initialState.addTaskStatus
      }
    }

    default: {
      return state;
    }
  }
}

export default tasks;
