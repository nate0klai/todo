import React, {useEffect, useCallback} from 'react';
import {connect} from 'react-redux';

import actionsUsers from "../../store/actions/users";
import actionsTasks from "../../store/actions/tasks";

import {
  Box,
  Container,
  IconButton,
  Button,
  Switch,
  TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ArrowBack } from "@material-ui/icons";

import { Link, withRouter } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import DialogInfo from '../DialogInfo';
import Filter from "../Filter";

const formFieldStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    '& .field-name': {
      width: '40%',
    },
    '& .field-value': {
      position: 'relative',
      '& input[type=text]': {
        width: '400px',
      },
      '& > div:nth-child(2)': {
        position: 'absolute',
        left: '120%',
        top: '0px',
        width: '200px',
        fontSize: '13px',
        color: 'red'
      }
    },
  }
});

function FormField({ children, fieldName }) {
  const formFieldClasses = formFieldStyles();
  return (
    <Box classes={formFieldClasses}>
      <Box className="field-name">{fieldName}</Box>
      <Box className="field-value">{children}</Box>
    </Box>
  )
}

const createStyles = makeStyles({
  root: {
    '& form': {
      display: 'flex',
      flexFlow: 'column nowrap',
      alignItems: 'center',
      width: '800px',
      marginLeft: 'auto',
      marginRight: 'auto',
      '& > div': {
        width: '100%',
      },
      '& > div + div': {
        marginTop: 20
      }
    }
  }
});

const mapStateToProps = ({users, tasks}) => ({
  users: users.list,
  usersLoaded: users.loaded,
  addTaskStatus: tasks.addTaskStatus
});

const mapActionsToProps = dispatch => ({
  loadUsers: () => dispatch(actionsUsers.load()),
  addTask: (title, userId, completed) => dispatch(actionsTasks.add(title, userId, completed)),
  clearTaskAddStatus: () => dispatch(actionsTasks.clearTaskAddStatus()),
});

const SignupSchema = Yup.object().shape({
  title: Yup.string()
  .min(2, 'Too Short!')
  .max(50, 'Too Long!')
  .required('this field is required'),
  user: Yup.string()
  .required('this field is required'),
  completed: Yup.string()
  .required('this field is required'),
});

function Create(props) {
  const createClasses = createStyles();

  const addTask = useCallback((title, userId, completed) => props.addTask(title, userId, completed), [props.addTask]);

  const handleCloseDialogSuccess = useCallback(() => {
    props.clearTaskAddStatus();
    props.history.push('/');
  }, []);

  const handleCloseDialogError = useCallback(() => {
    props.clearTaskAddStatus();
  }, []);

  useEffect(() => {
    !props.usersLoaded && props.loadUsers();
  }, []);
  
  return (
    <Box classes={createClasses}>
      <Container>
        <Box p={5}>
          <Box>
            <Link to="/">
              <IconButton color="primary" component="span" aria-label="back">
                <ArrowBack />
              </IconButton>
            </Link>
          </Box>
          <Box>
            <Formik
              initialValues={{
                title: 'new task',
                completed: false,
              }}
              validationSchema={SignupSchema}
              onSubmit={({title, user, completed}) => {
                addTask(title, user, completed);
              }}
            >
              {({ errors, touched, setFieldValue, initialValues, values }) => {
                const usersOptions = props.users.map(u => ({title: u.name, value: u.id}));
                return (
                  <Form>
                    <FormField fieldName="title">
                      <TextField
                        name="title"
                        defaultValue={initialValues.title}
                        placeholder="enter task title"
                        onInput={event => setFieldValue('title', event.target.value)}
                      />
                      {errors.title && touched.title ? (
                        <div>{errors.title}</div>
                      ) : null}
                    </FormField>
                    {props.usersLoaded && (
                      <FormField fieldName="user">
                        <Filter
                          name="user"
                          options={usersOptions}
                          buttonText={'user: ' + (values.user ? usersOptions.find(u => u.value === values.user).title: 'not selected')}
                          onSelect={value => setFieldValue('user', value)}
                        />
                        {errors.user ? (
                          <div>{errors.user}</div>
                        ) : null}
                      </FormField>
                    )}
                    <FormField fieldName="completed">
                      <Switch
                        defaultChecked={initialValues.completed}
                        onChange={event => setFieldValue('completed', event.target.checked)}
                        name="completed"
                        color="primary"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                      />
                      {errors.completed && touched.completed ? (
                        <div>{errors.completed}</div>
                      ) : null}
                    </FormField>
                    <Box mt={5} component="span">
                      <Button type="submit" variant="outlined" color="primary">Submit</Button>
                    </Box>
                  </Form>
                )
              }}
            </Formik>
          </Box>
          <DialogInfo onClose={handleCloseDialogSuccess} open={props.addTaskStatus === 'success'} title="task added successfully"/>
          <DialogInfo onClose={handleCloseDialogError} open={props.addTaskStatus === 'error'} title="the error during adding task. try again!"/>
        </Box>
      </Container>
    </Box>
  )
}

export default withRouter(connect(mapStateToProps, mapActionsToProps)(Create));