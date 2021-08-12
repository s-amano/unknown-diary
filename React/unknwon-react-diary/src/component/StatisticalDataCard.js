import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  grid: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    maxWidth: 345,
    height: '100%',
    width: '100%',
    display: 'flex',
    marginBottom: '4%',
    border: 'thick double black',
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  numOfPost: { flex: 1 },
  numOfGotLike: { flex: 1 },
}));

const StatisticalDataCard = () => {
  const classes = useStyles();
  return (
    <Grid container className={classes.grid}>
      <Card className={classes.card}>
        <div className={classes.numOfPost}>
          <CardContent className={classes.number}>
            <Typography variant="h6">15</Typography>
            <Typography component="h5" variant="h5">
              YourPost
            </Typography>
          </CardContent>
        </div>
        <div className={classes.numOfGotLike}>
          <CardContent className={classes.number}>
            <Typography variant="h6">24</Typography>
            <Typography component="h5" variant="h5">
              Like
            </Typography>
          </CardContent>
        </div>
      </Card>
    </Grid>
  );
};

export default StatisticalDataCard;
