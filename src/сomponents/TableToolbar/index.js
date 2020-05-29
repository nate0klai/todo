import React, {useCallback, useMemo} from "react";
import { connect } from 'react-redux';
import clsx from "clsx";

import actionsTasks from '../../store/actions/tasks';

import { lighten, makeStyles } from "@material-ui/core/styles";
import {
  Toolbar,
  TextField,
  Box
} from "@material-ui/core";

import Filter from '../Filter';

const statusOptions = [
  {title: 'all', value: 0},
  {title: 'completed', value: 1},
  {title: 'not completed', value: 2}
];

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  title: {
    flex: '1 1 100%',
  },
}));

const mapStateToProps = ({users, tasks}) => ({users: users.list, filter: tasks.filter});

const mapActionsToProps = dispatch => ({
  setFilter: filter => dispatch(actionsTasks.setFilter(filter))
});

function TableToolbar(props) {
  const classes = useToolbarStyles();

  const onSetStatus = useCallback((statusValue) => {
    props.setFilter({...props.filter, status: statusValue});
  }, [props.filter]);

  const onSetUser = useCallback((userValue) => {
    props.setFilter({...props.filter, user: userValue});
  }, [props.filter]);

  const onSetTitle = useCallback(event => {
    const {value: titleValue} = event.currentTarget;
    props.setFilter({...props.filter, title: titleValue});
  }, [props.filter]);

  const userOptions = useMemo(() => [{title: 'all', value: 0}, ...props.users.map(u => ({value: u.id, title: u.name}))], [props.users]);

  return (
    <Toolbar className={clsx(classes.root)} display="flex">
      <Filter
        options={statusOptions}
        onSelect={onSetStatus}
        buttonText={'status: ' + statusOptions.find(item => props.filter.status === item.value).title}
      />
      <Box ml={8}>
        <Filter
          options={userOptions}
          onSelect={onSetUser}
          buttonText={'user: ' + userOptions.find(item => props.filter.user === item.value).title}
        />
      </Box>
      <Box align="right" flexGrow={1} ml={20}>
        <TextField
          placeholder="enter title substring"
          id="standard-basic"
          label=""
          fullWidth
          onChange={onSetTitle}
        />
      </Box>
    </Toolbar>
  );
}

export default connect(mapStateToProps, mapActionsToProps)(TableToolbar);