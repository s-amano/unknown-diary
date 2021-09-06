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
    color: 'white',
    fontWeight: 'bolder',
    fontFamily: 'VAG Rounded Bold,Helvetica Neue,Arial,Liberation Sans,FreeSans,sans-serif',
  },
  iconLink: {
    textDecoration: 'none',
    color: 'hsla(0,0%,100%,.9)',
    display: 'flex',
    marginRight: '16px',
  },
  icon: {
    marginRight: '2px',
    fontSize: '150%',
    position: 'relative',
  },
}));

const Navbar = () => {
  const classes = useStyles();
  return (
    <AppBar position="static">
      <Toolbar style={{ width: '800px', margin: '0 auto' }}>
        <Typography variant="h5" className={classes.title}>
          Unknown Diary
        </Typography>
        <Link to="/" className={classes.iconLink}>
          <CreateIcon className={classes.icon} />
          日記を書く
        </Link>
        <Link to="/diary" className={classes.iconLink}>
          <MenuBookIcon className={classes.icon} style={{ top: '-1px' }} />
          誰かのあの日
        </Link>
        <Link to="/mydiary" className={classes.iconLink} style={{ marginRight: '4px', marginLeft: '8px' }}>
          <AccountBoxIcon />
        </Link>
        <ExitToAppIcon className={classes.iconLink} onClick={() => Auth.signOut()} />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
