import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ApiContext } from '../context/ApiContext';
import CardActionArea from '@material-ui/core/CardActionArea';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import FavoriteIcon from '@material-ui/icons/Favorite';

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: '40px',
  },
  card: {
    justifyContent: 'flex-start',
    height: '100%',
    width: '100%',
    marginBottom: '4%',
    maxWidth: 345,
  },
  cardContent: {
    flexGrow: 1,
  },
}));

const FetchMyDiaries = (props) => {
  const classes = useStyles();
  // const { setMyDiaryDetail } = useContext(ApiContext);

  return (
    <Container className={classes.cardContainer} maxWidth="md">
      {props.myDiaries.map((value, key) => {
        const diaryContent = value.content;
        const diaryReaction = value.reaction;
        const diaryTitle = value.title ? value.title : 'タイトルなし';
        const diaryDate = value.date ? value.date : '日付なし';
        const maxLength = 37;
        let modifiedDiaryContent = '';
        if (diaryContent.length > maxLength) {
          modifiedDiaryContent = diaryContent.substr(0, maxLength) + '...';
        } else {
          modifiedDiaryContent = diaryContent;
        }

        return (
          <Card className={classes.card} key={key}>
            <Link
              to={{ pathname: '/mydiary-detail', search: `?id=${value.id}` }}
              // onClick={() => fetchMyDiary(value.id)
              style={{ textDecoration: 'none' }}
            >
              <CardActionArea>
                <CardContent className={classes.cardContent}>
                  <Typography style={{ textAlign: 'left' }} gutterBottom variant="h5" component="h2">
                    {diaryTitle}
                  </Typography>
                  <Typography style={{ textAlign: 'left' }} variant="body2" color="textSecondary" component="p">
                    {modifiedDiaryContent}
                  </Typography>
                </CardContent>
                <CardActions style={{ paddingTop: '0px' }}>
                  <FavoriteIcon style={{ marginRight: '2%' }} color="error" />
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>{diaryReaction}</p>
                  <Typography style={{ marginLeft: 'auto' }}>{diaryDate}</Typography>
                </CardActions>
              </CardActionArea>
            </Link>
          </Card>
        );
      })}
    </Container>
  );
};

export default FetchMyDiaries;
