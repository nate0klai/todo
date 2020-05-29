import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';

import actionsUsers from '../../store/actions/users';
import actionsTasks from '../../store/actions/tasks';

import {withRouter} from 'react-router-dom';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  Backdrop, 
  CircularProgress
} from '@material-ui/core';

import DialogInfo from '../DialogInfo';
import Row from '../Row';
import TableToolbar from '../TableToolbar';

const headCells = [
  { id: 'completed', align: 'center', disablePadding: false, label: 'completed' },
  { id: 'userId', align: 'center', disablePadding: false, label: 'user' },
  { id: 'title', align: 'center', disablePadding: false, label: 'title' },
];

function EnhancedTableHead(props) {

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'default'}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const mapStateToProps = ({tasks, users}) => ({
  tasks: tasks.list,
  tasksCount: tasks.count,
  usersLoaded: users.loaded,
  filter: tasks.filter,
  removeTaskStatus: tasks.removeTaskStatus,
  changeTaskStatus: tasks.changeTaskStatus,
  filterTasksStatus: tasks.filterTasksStatus
});

const mapActionsToProps = dispatch => ({
  loadUsers: () => dispatch(actionsUsers.load()),
  filterTasks: (filter, adding, from, count) => dispatch(actionsTasks.filter(filter, adding, from, count)),
  clearTaskRemoveStatus: () => dispatch(actionsTasks.clearTaskRemoveStatus()),
  clearTaskChangeStatus: () => dispatch(actionsTasks.clearTaskChangeStatus()),
  clearTasksFilterStatus: () => dispatch(actionsTasks.clearTasksFilterStatus()),
});

const ROWS_PER_PAGE = 5;

function Tasks(props) {
  const classes = useStyles();
  const [page, setPage] = useState(0);

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
    if ((props.tasks.length / ROWS_PER_PAGE - 1) === newPage && props.tasks.length < props.tasksCount) {
      props.filterTasks(props.filter, true, (newPage + 1) * ROWS_PER_PAGE, ROWS_PER_PAGE);
    }
  }, [props.tasksCount, props.tasks, ROWS_PER_PAGE]);

  const handleCloseRemoveDialogError = useCallback(() => {
    props.clearTaskRemoveStatus();
  }, []);

  const handleCloseChangeDialogError = useCallback(() => {
    props.clearTaskChangeStatus();
  }, []);

  const handleCloseFilterDialogError = useCallback(() => {
    props.clearTasksFilterStatus();
  }, []);

  const emptyRows = useMemo(() => ROWS_PER_PAGE - Math.min(ROWS_PER_PAGE, props.tasks.length - page * ROWS_PER_PAGE), [props.tasks, page, ROWS_PER_PAGE]);

  useEffect(() => {
    !props.usersLoaded && props.loadUsers();
  }, []);

  useEffect(() => {
    document.title = props.tasksCount + ' tasks are available';
  }, [props.tasksCount]);

  useEffect(() => {
    const moduloTasks = props.tasks.length % ROWS_PER_PAGE;
    if (moduloTasks && props.tasks.length < props.tasksCount) {
      props.filterTasks(props.filter, true, moduloTasks * (page + 1), ROWS_PER_PAGE - moduloTasks);
    }
  }, [props.tasks]);

  useEffect(() => {
    props.filterTasks(props.filter, false);
  }, [props.filter]);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableToolbar />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              rowCount={props.tasks.length}
            />
            <TableBody>
              {props.tasks
              .slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE)
              .map((row, index) => {
                return (
                  <Row key={'task' + row.id} taskId={row.id} title={row.title} completed={row.completed} userId={row.userId}/>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={props.tasks.length}
          rowsPerPage={ROWS_PER_PAGE}
          page={page}
          onChangePage={handleChangePage}
        />
      </Paper>
      <DialogInfo onClose={handleCloseRemoveDialogError} open={props.removeTaskStatus === 'error'} title="the error during removing task. try again!"/>
      <DialogInfo onClose={handleCloseChangeDialogError} open={props.changeTaskStatus === 'error'} title="the error during changing task. try again!"/>
      <DialogInfo onClose={handleCloseFilterDialogError} open={props.filterTasksStatus === 'error'} title="the error during loading tasks. try again!"/>
      <Backdrop className={classes.backdrop} open={props.filterTasksStatus === 'progress'}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default withRouter(connect(mapStateToProps, mapActionsToProps)(Tasks));