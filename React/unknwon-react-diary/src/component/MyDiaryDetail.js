import React, { useState, useEffect } from 'react';
import { Auth, API } from 'aws-amplify';
import { useLocation } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FavoriteIcon from '@material-ui/icons/Favorite';

const MyDiaryDetail = () => {
  const location = useLocation();
  const [myDiaryDetail, setMyDiaryDetail] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editDiaryTitle, setEditDiaryTitle] = useState('');
  const [editDiaryContent, setEditDiaryContent] = useState('');
  const [editDiaryDate, setEditDiaryDate] = useState();

  const envUpdateAPI = () => {
    const env = process.env.REACT_APP_ENVIROMENT;
    console.log(env);
    if (env === 'prod') {
      return 'UPDATEDiaryAPIProd';
    } else if (env === 'dev') {
      return 'UPDATEDiaryAPIDev';
    }
  };

  useEffect(() => {
    const envFetchAPI = () => {
      const env = process.env.REACT_APP_ENVIROMENT;
      console.log(env);
      if (env === 'prod') {
        return 'GETStoreAPIProd';
      } else if (env === 'dev') {
        return 'GETStoreAPIDev';
      }
    };

    const fetchMyDiary = async () => {
      const apiName = envFetchAPI();
      const path = `${location.search}`;

      const myInit = {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
        },
      };

      await API.get(apiName, path, myInit)
        .then((response) => {
          console.log(response);
          if (response.id === '') {
            window.location.href = '/mydiary';
          }
          setMyDiaryDetail(response);
          setEditDiaryTitle(response.title);
          setEditDiaryContent(response.content);
          setEditDiaryDate(response.date);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchMyDiary();
  }, [location.search]);

  const upadteMyDiary = async () => {
    const apiName = envUpdateAPI();
    const path = '';
    console.log(myDiaryDetail);
    console.log(editDiaryTitle);
    console.log(editDiaryContent);

    const postData = {
      id: myDiaryDetail.id,
      post_at: myDiaryDetail.post_at,
      title: editDiaryTitle,
      content: editDiaryContent,
      date: myDiaryDetail.date,
    };
    const myInit = {
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
      },
      body: postData,
      contentType: 'application/json',
    };

    await API.post(apiName, path, myInit)
      .then((response) => {
        console.log('成功');
        setMyDiaryDetail({ ...myDiaryDetail, title: response.title, content: response.content, date: response.date });
        setEditMode(!editMode);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateDiaryContent = () => (event) => {
    setEditDiaryContent(event.target.value);
  };

  const updateDiaryTitle = () => (event) => {
    setEditDiaryTitle(event.target.value);
  };

  return (
    <Container style={{ marginTop: '20px' }} maxWidth="md">
      <Grid container justify="flex-end">
        <Button onClick={() => setEditMode(!editMode)}>
          <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>編集モード</p>
        </Button>
      </Grid>
      {editMode ? (
        <>
          <Grid container justifyContent="space-around" style={{ marginTop: '8%', marginBottom: '5%' }}>
            <TextField
              value={editDiaryTitle}
              onChange={updateDiaryTitle()}
              label="日記のタイトル"
              helperText="30字以下で入力してください"
              error={Boolean(editDiaryTitle.length !== 0 && !(editDiaryTitle.length <= 30))}
            />
            <TextField value={editDiaryDate} />
          </Grid>
          <TextField
            style={{ width: '100%', marginBottom: '5%' }}
            onChange={updateDiaryContent()}
            multiline
            rows={20}
            value={editDiaryContent}
            error={Boolean(
              editDiaryContent.length !== 0 && !(17 <= editDiaryContent.length && editDiaryContent.length < 5000)
            )}
            helperText="17文字以上5000字以下で入力してください"
          />
          <Grid container justify="flex-end">
            <Button onClick={() => upadteMyDiary()}>
              <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>日記を編集する</p>
            </Button>
          </Grid>
        </>
      ) : (
        <>
          <Grid container justifyContent="space-around" style={{ marginTop: '8%', marginBottom: '5%' }}>
            <Typography variant="h5" component="h2" style={{ marginBottom: '2%' }}>
              {myDiaryDetail.title ? myDiaryDetail.title : 'タイトル'}
            </Typography>
            <Typography variant="subtitle1" component="h2">
              {myDiaryDetail.date ? myDiaryDetail.date : '日付'}
            </Typography>
          </Grid>
          <TextField
            style={{ width: '100%', marginBottom: '5%' }}
            multiline
            rows={20}
            value={myDiaryDetail.content}
            disabled
          />
          <Grid container justify="flex-end">
            <Button variant="contained" color="primary">
              <FavoriteIcon style={{ marginRight: '2%' }} color="error" />
              <p style={{ margin: 0, fontWeight: 'bold', color: 'white', fontSize: '16px' }}>
                {myDiaryDetail.reaction}
              </p>
            </Button>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default MyDiaryDetail;
