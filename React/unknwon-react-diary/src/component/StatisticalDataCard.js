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

const StatisticalDataCard = (props) => {
  const classes = useStyles();

  const numberOfMyDiaries = props.myDiaries.length;
  var numberOfMydieriesReaction = 0;
  props.myDiaries.forEach((diary, index) => {
    numberOfMydieriesReaction += Number(diary.reaction);
  });
  return (
    <Grid container className={classes.grid}>
      <Card className={classes.card}>
        <div className={classes.numOfPost}>
          <CardContent className={classes.number}>
            <Typography variant="h6">{numberOfMyDiaries}</Typography>
            <Typography component="h5" variant="h5">
              YourPost
            </Typography>
          </CardContent>
        </div>
        <div className={classes.numOfGotLike}>
          <CardContent className={classes.number}>
            <Typography variant="h6">{numberOfMydieriesReaction}</Typography>
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
