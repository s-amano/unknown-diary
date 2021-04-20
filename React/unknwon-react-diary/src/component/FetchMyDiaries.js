import React, { useContext, useEffect, useState } from 'react';
import { Auth, API } from 'aws-amplify';
import { ApiContext } from '../context/ApiContext';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DetailsIcon from '@material-ui/icons/Details';
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

const FetchMyDiaries = () => {
  const { setMyDiaryDetail } = useContext(ApiContext);
  const [myDiaries, setMyDiaries] = useState([]);

  useEffect(() => {
    const envAPI = () => {
      const env = process.env.REACT_APP_ENVIROMENT;
      console.log(env);
      if (env === 'prod') {
        return 'GETMyDiariesAPIProd';
      } else if (env === 'dev') {
        return 'GETMyDiariesAPIDev';
      }
    };

    const fetchMyDiaries = async () => {
      const apiName = envAPI();
      const path = '';

      const myInit = {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
        },
      };

      await API.get(apiName, path, myInit)
        .then((response) => {
          console.log(response);
          setMyDiaries(response.Diaries);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchMyDiaries();
  }, []);

  const DetailMyDiary = (diaryContent) => {
    console.log(diaryContent);
    setMyDiaryDetail(diaryContent);
  };

  return (
    <Container style={{ marginTop: '20px' }} maxWidth="md">
      <Grid container justify="flex-end">
        <Button variant="contained" color="primary">
          <Link to="/diary" style={{ textDecoration: 'none', color: 'white' }}>
            日記を取得
          </Link>
        </Button>
      </Grid>
      <Typography style={{ marginTop: '30px', color: 'black', marginBottom: '10%' }} variant="h6">
        自分が書いた日記
      </Typography>
      <List>
        {myDiaries.map((value) => {
          const diaryContent = value.content;
          const maxLength = 22;
          let modifiedDiaryContent = '';
          if (diaryContent.length > maxLength) {
            modifiedDiaryContent = diaryContent.substr(0, maxLength) + '...';
          }

          return (
            <ListItem key={value.id} role={undefined} dense button>
              <ListItemText style={{ color: 'black', textOverflow: 'ellipsis' }}>{modifiedDiaryContent}</ListItemText>
              <ListItemSecondaryAction>
                <Link to="/mydiary-detail" onClick={() => DetailMyDiary(diaryContent)}>
                  <IconButton edge="end" aria-label="detail">
                    <DetailsIcon />
                  </IconButton>
                </Link>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    </Container>
  );
};

export default FetchMyDiaries;
