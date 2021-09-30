import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

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

const StatisticalDataCard = memo((props) => {
  const classes = useStyles();

  const numberOfMyDiaries = props.myDiaries.length;
  var numberOfMydieriesReaction = 0;
  props.myDiaries.forEach((diary, index) => {
    numberOfMydieriesReaction += Number(diary.reaction);
  });
  return (
    <Grid container className={classes.grid}>
      <div className="flex shadow-xl rounded-md bg-white w-96 my-6 p-2">
        <div className={classes.numOfPost}>
          <div className="p-3">
            <p className="text-xl text-gray-800 font-medium">{numberOfMyDiaries}</p>
            <p className="text-xl text-gray-600 font-semibold">ポストした日記</p>
          </div>
        </div>
        <div className={classes.numOfGotLike}>
          <div className="p-3">
            <p className="text-xl text-gray-800 font-medium">{numberOfMydieriesReaction}</p>
            <p className="text-xl text-gray-600 font-semibold">貰ったいいね</p>
          </div>
        </div>
      </div>
    </Grid>
  );
});

export default StatisticalDataCard;
