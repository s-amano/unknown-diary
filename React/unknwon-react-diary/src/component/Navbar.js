import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Auth } from 'aws-amplify';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import CreateIcon from '@material-ui/icons/Create';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    textAlign: 'left',
  },
  icon: {
    textDecoration: 'none',
    color: 'white',
    marginRight: '2%',
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
        <Link to="/" className={classes.icon}>
          <CreateIcon />
        </Link>
        <Link to="/diary" className={classes.icon}>
          <MenuBookIcon />
        </Link>
        <Link to="/mydiary" className={classes.icon}>
          <AccountBoxIcon />
        </Link>
        <ExitToAppIcon className={classes.icon} onClick={() => Auth.signOut()} />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
