import React from 'react';

import {
  Box,
  Container,
  IconButton
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Link } from 'react-router-dom';

import Table from '../Table';

function Home(props) {
  return (
    <Box>
      <Container>
        <Box p={5}>
          <Box align="right">
            <Link to="/create">
              <IconButton color="primary" component="span" aria-label="add task">
                <Add/>
              </IconButton>
            </Link>
          </Box>
          <Box>
            <Table/>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Home;