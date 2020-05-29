const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const fs = require('fs');
const app = express();
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const tasksData = fs.readFileSync('data/tasks.json');
let tasks = JSON.parse(tasksData);

const usersData = fs.readFileSync('data/users.json');
let users = JSON.parse(usersData);

app.post('/tasks/filter', function (req, res) {
  const {filter: {status, user, title}, from, count} = req.body;
  const requiredTasks = tasks.filter(task => {
    // task is matched for required status and userId and title (substring)
    return (!status || Boolean(2 - status) === task.completed) && (!user || user === task.userId) && (!title.length || task.title.indexOf(title) !== -1);
  });
  return res.send(
    {
      list: requiredTasks.slice(from, from + count),
      count: requiredTasks.length
    }
  );
});

app.post('/users', function (req, res) {
  return res.send(users.map(u => ({id: u.id, name: u.name})));
});

app.post('/tasks/change', function (req, res) {
  const {id, params} = req.body;
  const taskIndex = tasks.findIndex(task => task.id === id);
  const task = tasks[taskIndex];
  tasks[taskIndex] = {...task, ...params};
  res.send(true);
});

app.post('/tasks/remove', function (req, res) {
  const {id} = req.body;
  const elemIndex = tasks.findIndex(task => task.id === id);
  tasks.splice(elemIndex, 1);
  res.send(true);
});

app.post('/tasks/add', function (req, res) {
  const {userId, title, completed} = req.body;
  const newTaskId = tasks[tasks.length - 1].id + 1;
  tasks.push({id: newTaskId, userId, title, completed});
  res.send(true);
});

app.listen(process.env.PORT || 8080);