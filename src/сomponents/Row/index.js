import React, {useCallback, useMemo} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import actionsTasks from "../../store/actions/tasks";

import {
  Switch,
  TableCell,
  TableRow,
  TextField,
  IconButton
} from "@material-ui/core";
import {Delete} from "@material-ui/icons";

import Filter from '../Filter';

const mapStateToProps = ({users}) => ({users: users.list});

const mapActionsToProps = dispatch => ({
  changeTask: (taskId, params) => dispatch(actionsTasks.change(taskId, params)),
  removeTask: taskId => dispatch(actionsTasks.remove(taskId)),
});

function Row(props) {

  const onStatusChange = useCallback(() => {
    props.changeTask(props.taskId, {completed: !props.completed});
  }, [props.completed]);

  const onSetUser = useCallback(value => {
    if (props.userId !== value) {
      props.changeTask(props.taskId, {userId: value});
    }
  }, [props.userId]);

  const onSetTitle = useCallback(event => {
    const {value} = event.currentTarget;
    if (props.title !== value) {
      props.changeTask(props.taskId, {title: value});
    }
  }, [props.title]);
  
  const onKeyDownTitle = useCallback((event) => {
    if (event.keyCode === 13) {
      onSetTitle(event);
    }
  }, [onSetTitle]);

  const removeTaskHandler = useCallback(() => {
    props.removeTask(props.taskId);
  }, [props.taskId]);

  const usersOptions = useMemo(() => props.users.map(u => ({value: u.id, title: u.name})), [props.users]);
  const user = useMemo(() => props.users.find(u => u.id === props.userId), [props.userId, props.users]);

  return (
    <TableRow
      hover
      tabIndex={-1}
    >
      <TableCell align="center" width={100}>
        <Switch
          checked={props.completed}
          onChange={onStatusChange}
          color="primary"
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
      </TableCell>
      <TableCell align="center" width={300}>
        <Filter
          options={usersOptions}
          onSelect={onSetUser}
          buttonText={user ? user.name : ''}
        />
      </TableCell>
      <TableCell align="left" width={500}>
        <TextField
          label=""
          defaultValue={props.title}
          fullWidth
          onBlur={onSetTitle}
          onKeyDown={onKeyDownTitle}
        />
      </TableCell>
      <TableCell width={20}>
        <IconButton component="span" aria-label="add task" onClick={removeTaskHandler}>
          <Delete/>
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

Row.propTypes = {
  taskId: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
  completed: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired
};

export default connect(mapStateToProps, mapActionsToProps)(Row);