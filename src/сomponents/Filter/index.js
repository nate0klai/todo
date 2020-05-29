import React, {useCallback, useState} from "react";
import PropTypes from "prop-types";

import {
  Box,
  Button,
  Menu,
  MenuItem
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const buttonStyles = makeStyles({
  root: {
    '& .MuiButton-label': {
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      justifyContent: 'flex-start',
      maxWidth: '100%'
    }
  }
});
function Filter(props) {
  const buttonClasses = buttonStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(val => () => {
    setAnchorEl(null);
    props.onSelect(val);
  }, [props.onSelect]);

  return (
    <Box>
      <Button
        onClick={handleClick}
        variant="outlined"
        color="primary"
        classes={buttonClasses}
      >{props.buttonText}</Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {props.options.map(item => <MenuItem key={'menuItem' + item.value} onClick={handleClose(item.value)}>{item.title}</MenuItem>)}
      </Menu>
    </Box>
  )
}

Filter.propTypes = {
  buttonText: PropTypes.string,
  options: PropTypes.array.isRequired,
  onSelect: PropTypes.func,
};

Filter.defaultProps = {
  buttonText: 'menu',
  onSelect: () => null
};

export default Filter;