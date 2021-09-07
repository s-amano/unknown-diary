import React, { useState, useEffect } from 'react';
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
    color: 'hsla(0,0%,100%,.8)',
    display: 'flex',
    marginRight: '16px',
  },
  icon: {
    marginRight: '2px',
    fontSize: '150%',
    position: 'relative',
  },
  iconText: {
    padding: 0,
    margin: 0,
    fontWeight: '600',
  },
  iconLinkSm: {
    textDecoration: 'none',
    color: 'hsla(0,0%,100%,.8)',
    display: 'flex',
    marginRight: '4px',
  },
}));

const Navbar = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const updateWidth = (event) => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener(`resize`, updateWidth, {
      capture: false,
      passive: true,
    });

    return () => window.removeEventListener(`resize`, updateWidth);
  }, []);

  const classes = useStyles();

  const sm = 640;

  return (
    <AppBar position="static" className="mb-20">
      <Toolbar className="sm:max-w-full md:w-9/12 lg:w-8/12 xl:w-1/2" style={{ margin: '0 auto' }}>
        <Link to="/" className={classes.title}>
          <Typography variant="h5" className={classes.title}>
            Unknown Diary
          </Typography>
        </Link>
        {width > sm ? (
          <>
            <Link to="/post" className={classes.iconLink}>
              <CreateIcon className={classes.icon} />
              <p className={classes.iconText}>日記を書く</p>
            </Link>
            <Link to="/diary" className={classes.iconLink}>
              <MenuBookIcon className={classes.icon} style={{ top: '-1px' }} />
              <p className={classes.iconText}>誰かのあの日</p>
            </Link>
            <Link to="/mydiary" className={classes.iconLink} style={{ marginRight: '4px', marginLeft: '8px' }}>
              <AccountBoxIcon />
            </Link>
            <ExitToAppIcon className={classes.iconLink} onClick={() => Auth.signOut()} />
          </>
        ) : (
          <>
            <Link to="/post" className={classes.iconLinkSm}>
              <CreateIcon className="ml-3" />
            </Link>
            <Link to="/diary" className={classes.iconLinkSm}>
              <MenuBookIcon />
            </Link>
            <Link to="/mydiary" className={classes.iconLinkSm}>
              <AccountBoxIcon />
            </Link>
            <ExitToAppIcon className={classes.iconLinkSm} onClick={() => Auth.signOut()} />
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
