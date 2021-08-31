import React, { useState, useEffect } from 'react';
import { Auth, API } from 'aws-amplify';
import { makeStyles } from '@material-ui/core/styles';
import CardActionArea from '@material-ui/core/CardActionArea';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Button from '@material-ui/core/Button';

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
  const [page, setPage] = useState(1);
  const [myDiaries, setMyDiaries] = useState([]);

  const sliceByNumber = (array, number) => {
    const length = Math.ceil(array.length / number);
    return new Array(length).fill().map((_, i) => array.slice(i * number, (i + 1) * number));
  };

  const lastDiraryIDList = sliceByNumber(props.myDiaries, 6);

  var maxPageNumber = Math.ceil(props.myDiaries.length / 6);

  const envAPI = () => {
    const env = process.env.REACT_APP_ENVIROMENT;
    console.log(env);
    if (env === 'prod') {
      return 'GETMyDiariesAPIProd';
    } else if (env === 'dev') {
      return 'GETMyDiariesAPIDev';
    }
  };

  useEffect(() => {
    const fetchMyDiaries = async () => {
      const limit = '6';
      const apiName = envAPI();
      const path = `?limit=${limit}`;

      const myInit = {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
        },
      };

      await API.get(apiName, path, myInit)
        .then((response) => {
          setMyDiaries(response.Diaries);
          setPage(1);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchMyDiaries('');
  }, []);

  const fetchMyDiaries = async (id) => {
    const limit = '6';
    const apiName = envAPI();
    const path = `?id=${id}&limit=${limit}`;

    const myInit = {
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
      },
    };

    await API.get(apiName, path, myInit)
      .then((response) => {
        setMyDiaries(response.Diaries);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const prevPage = () => {
    if (page === 2) {
      fetchMyDiaries('');
    } else {
      fetchMyDiaries(lastDiraryIDList[page - 3].slice(-1)[0].id);
    }
    setPage(page - 1);
  };

  const nextPage = () => {
    fetchMyDiaries(lastDiraryIDList[page - 1].slice(-1)[0].id);
    setPage(page + 1);
  };
  return (
    <>
      <Container className={classes.cardContainer} maxWidth="md">
        {myDiaries.map((value, key) => {
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

      <div style={{ paddingLeft: '12px', paddingRight: '12px', marginTop: '36px', marginBottom: '48px' }}>
        {page !== 1 && (
          <Button style={{ marginRight: '3%' }} onClick={() => prevPage()}>
            <a>&lt; Previous</a>
          </Button>
        )}
        {page !== maxPageNumber && (
          <Button onClick={() => nextPage()}>
            <a className="ml-4">Next &gt;</a>
          </Button>
        )}
      </div>
    </>
  );
};

export default FetchMyDiaries;
