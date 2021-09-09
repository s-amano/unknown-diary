import React, { useState, useEffect } from 'react';
import { Auth, API } from 'aws-amplify';
import { useLocation } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FavoriteIcon from '@material-ui/icons/Favorite';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

const MyDiaryDetail = () => {
  const location = useLocation();
  const [myDiaryDetail, setMyDiaryDetail] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editDiaryTitle, setEditDiaryTitle] = useState('');
  const [editDiaryContent, setEditDiaryContent] = useState('');
  const [editDiaryDate, setEditDiaryDate] = useState();

  const dateConvert = (date) => {
    var y = date.getFullYear();
    var m = ('00' + (date.getMonth() + 1)).slice(-2);
    var d = ('00' + date.getDate()).slice(-2);
    var result = y + '/' + m + '/' + d;
    return result;
  };

  const isDateValid = (strDate) => {
    if (!strDate.match(/^\d{4}\/\d{2}\/\d{2}$/)) {
      return false;
    }
    var y = strDate.split('/')[0];
    var m = strDate.split('/')[1] - 1;
    var d = strDate.split('/')[2];
    var date = new Date(y, m, d);
    if (date.getFullYear() !== Number(y) || date.getMonth() !== m || date.getDate() !== Number(d)) {
      return false;
    }
    return true;
  };

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
          if (response.date == null) {
            setEditDiaryDate(dateConvert(new Date()));
          } else {
            setEditDiaryDate(response.date);
          }
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

    const postData = {
      id: myDiaryDetail.id,
      post_at: myDiaryDetail.post_at,
      title: editDiaryTitle,
      content: editDiaryContent,
      date: editDiaryDate,
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

  const updateDiaryDate = () => (date) => {
    const result = dateConvert(date);
    setEditDiaryDate(result);
  };

  return (
    <Container className="sm:w-full md:w-700">
      <Grid container justify="flex-end" style={{ marginTop: '5%' }}>
        <Button className="mb-3" onClick={() => setEditMode(!editMode)} color="primary" variant="contained">
          <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px', color: 'white' }}>編集モード</p>
        </Button>
      </Grid>
      {editMode ? (
        <>
          <Grid container justifyContent="space-around" style={{ marginTop: '4%', marginBottom: '5%' }}>
            <TextField
              value={editDiaryTitle}
              onChange={updateDiaryTitle()}
              style={{ width: '100%' }}
              label="日記のタイトル"
              helperText="30字以下で入力してください"
              error={Boolean(editDiaryTitle.length !== 0 && !(editDiaryTitle.length <= 30))}
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container justifyContent="flex-end" style={{ justifyContent: 'flex-end' }}>
                <KeyboardDatePicker
                  margin="normal"
                  id="date-picker-dialog"
                  // label="日付"
                  format="yyyy/MM/dd"
                  value={editDiaryDate}
                  onChange={updateDiaryDate()}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                  error={Boolean(!isDateValid(editDiaryDate))}
                  helperText="有効な形式で日付を入力してください"
                />
              </Grid>
            </MuiPickersUtilsProvider>
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
          <Grid container justify="flex-end" style={{ marginBottom: '8%' }}>
            <Button
              onClick={() => upadteMyDiary()}
              disabled={Boolean(
                !(
                  17 <= editDiaryContent.length &&
                  editDiaryContent.length < 5000 &&
                  editDiaryTitle.length <= 30 &&
                  isDateValid(editDiaryDate)
                )
              )}
              variant="contained"
              color="primary"
            >
              <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px', color: 'white' }}>日記を編集する</p>
            </Button>
          </Grid>
        </>
      ) : (
        <>
          <div className="text-right mr-12 mb-1">
            <p className="text-gray-500 text-lg ml-auto">{myDiaryDetail.date ? myDiaryDetail.date : '日付なし'}</p>
          </div>

          <div className="bg-white text-center shadow-xl py-4 px-3 w-10/12 max-w-2xl rounded-md mx-6 mb-6">
            <p className="text-xl mb-3 text-black font-bold text-gray-600 text-left">
              {myDiaryDetail.title !== '' ? myDiaryDetail.title : 'タイトルなし'}
            </p>
            <p className="text-left mb-4 pl-3 whitespace-pre-wrap">{myDiaryDetail.content}</p>
            <div className="flex justify-end">
              <FavoriteIcon className="mr-1" color="error" />
              <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>{myDiaryDetail.reaction}</p>
            </div>
          </div>
        </>
      )}
    </Container>
  );
};

export default MyDiaryDetail;
