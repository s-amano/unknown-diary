import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { FiLogOut } from 'react-icons/fi';
import { Auth } from 'aws-amplify';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
}));

const Navbar = () => {
  const classes = useStyles();
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h5" className={classes.title}>
          Unknown Diary
        </Typography>
        <button className="signOut" onClick={() => Auth.signOut()}>
          <FiLogOut />
        </button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
