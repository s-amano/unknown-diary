import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ApiContext } from '../context/ApiContext';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';

const useStyles = makeStyles((theme) => ({
  card: {
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
}));

const FetchMyDiaries = (props) => {
  const classes = useStyles();
  const { setMyDiaryDetail } = useContext(ApiContext);

  const DetailMyDiary = (diary) => {
    console.log(diary);
    setMyDiaryDetail(diary);
  };

  return (
    <Container style={{ marginTop: '40px' }} maxWidth="md">
      {props.myDiaries.map((value, key) => {
        const diary = {};
        const diaryContent = value.content;
        const diaryReaction = value.reaction;
        const maxLength = 22;
        let modifiedDiaryContent = '';
        if (diaryContent.length > maxLength) {
          modifiedDiaryContent = diaryContent.substr(0, maxLength) + '...';
        } else {
          modifiedDiaryContent = diaryContent;
        }

        diary.diaryContent = diaryContent;
        diary.diaryReaction = diaryReaction;

        return (
          <Grid container key={key}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography>{modifiedDiaryContent}</Typography>
              </CardContent>
              <CardActions>
                <Link to="/mydiary-detail" onClick={() => DetailMyDiary(diary)}>
                  <IconButton edge="end" aria-label="detail">
                    <ChromeReaderModeIcon />
                  </IconButton>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        );
      })}
    </Container>
  );
};

export default FetchMyDiaries;
