import React from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Button,
  Dialog,
  DialogTitle
} from "@material-ui/core";

function DialogInfo(props) {
  return (
    <Dialog onClose={props.onClose} aria-labelledby="simple-dialog-title" open={props.open}>
      <DialogTitle id="simple-dialog-title">{props.title}</DialogTitle>
      <Box ml="auto" mr="auto" p={2}>
        <Button onClick={props.onClose} variant="outlined" color="primary">ok</Button>
      </Box>
    </Dialog>
  )
}

DialogInfo.propTypes = {
  title: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default DialogInfo;