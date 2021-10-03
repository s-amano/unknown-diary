import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Auth, API } from 'aws-amplify';
import { useLocation } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { ApiContext } from '../../context/ApiContext';
import CircularProgress from '@material-ui/core/CircularProgress';
import DiaryForm from '../atoms/DiaryForm';
import MyDiaryCard from '../organisms/MyDiaryCard';

const MyDiaryDetail = () => {
  const { thisUserName, loading, setLoading } = useContext(ApiContext);

  const location = useLocation();
  const [myDiaryDetail, setMyDiaryDetail] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editDiaryDate, setEditDiaryDate] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDiary, setEditDiary] = useState({ title: '', content: '' });

  const handleClose = () => {
    setDialogOpen(false);
  };

  const dateConvert = (date) => {
    var y = date.getFullYear();
    var m = ('00' + (date.getMonth() + 1)).slice(-2);
    var d = ('00' + date.getDate()).slice(-2);
    var result = y + '/' + m + '/' + d;
    return result;
  };

  const isDateValid = useMemo(() => {
    if (editDiaryDate === undefined) {
      return false;
    }
    if (!editDiaryDate.match(/^\d{4}\/\d{2}\/\d{2}$/)) {
      return false;
    }
    var y = editDiaryDate.split('/')[0];
    var m = editDiaryDate.split('/')[1] - 1;
    var d = editDiaryDate.split('/')[2];
    var date = new Date(y, m, d);
    if (date.getFullYear() !== Number(y) || date.getMonth() !== m || date.getDate() !== Number(d)) {
      return false;
    }
    return true;
  }, [editDiaryDate]);

  useEffect(() => {
    const fetchMyDiary = async () => {
      setLoading(true);
      const apiName = 'GETStoreAPI';
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

          console.log(response.author !== thisUserName);
          if (response.author !== thisUserName) {
            setDialogOpen(true);
            window.location.href = '/diary';
          }
          setMyDiaryDetail(response);
          setEditDiary({ title: response.title, content: response.content });
          if (response.date == null) {
            setEditDiaryDate(dateConvert(new Date()));
          } else {
            setEditDiaryDate(response.date);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };

    fetchMyDiary();
  }, [location.search, thisUserName, setLoading]);

  const upadteMyDiary = async () => {
    if (myDiaryDetail.author !== thisUserName) {
      setDialogOpen(true);
      return;
    }
    const apiName = 'UPDATEDiaryAPI';
    const path = '';

    const postData = {
      id: myDiaryDetail.id,
      post_at: myDiaryDetail.post_at,
      title: editDiary.title,
      content: editDiary.content,
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

  const setMyDiaryEditMode = () => {
    if (myDiaryDetail.author !== thisUserName) {
      setDialogOpen(true);
      return;
    }
    setEditMode(!editMode);
  };

  const updateDiaryDate = () => (date) => {
    const result = dateConvert(date);
    setEditDiaryDate(result);
    setEditDiaryDate(date);
  };

  const handleInputChange = () => (event) => {
    const value = event.target.value;
    const name = event.target.name;
    setEditDiary({ ...editDiary, [name]: value });
  };

  return (
    <Container className="sm:w-full md:w-700">
      <Grid container justify="flex-end" style={{ marginTop: '5%' }}>
        <Button className="mb-3" onClick={() => setMyDiaryEditMode()} color="primary" variant="contained">
          <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px', color: 'white' }}>編集モード</p>
        </Button>
      </Grid>
      {loading && <CircularProgress />}
      {editMode ? (
        <DiaryForm
          inputDiary={editDiary}
          handleInputChange={handleInputChange}
          updateDiaryDate={updateDiaryDate}
          isDateValid={isDateValid}
          survayPost={upadteMyDiary}
          inputDiaryDate={editDiaryDate}
          postWord={'日記を編集する'}
        />
      ) : (
        <>
          <MyDiaryCard diary={myDiaryDetail} />
          <div className="flex flex-col w-9/12 pl-8 mt-4">
            <p className="text-xl text-gray-800 font-semibold mb-3 text-left">足跡</p>
            {myDiaryDetail.comments ? (
              myDiaryDetail.comments.map((comment, index) => (
                <div key={index} className="bg-white shadow-xl rounded-2xl w-1/2 mb-2 text-left">
                  <p className="ml-3">{comment}</p>
                </div>
              ))
            ) : (
              <></>
            )}
          </div>
        </>
      )}
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle id="simple-dialog-title">自分の日記のみ編集ができます</DialogTitle>
      </Dialog>
    </Container>
  );
};

export default MyDiaryDetail;
