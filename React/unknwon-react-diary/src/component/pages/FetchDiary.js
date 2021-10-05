import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { Auth, API } from 'aws-amplify';
import { Grid } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { ApiContext } from '../../context/ApiContext';
import CircularProgress from '@material-ui/core/CircularProgress';
import FetchedDiaryCard from '../organisms/FetchedDiaryCard';
import DiaryComment from '../organisms/DiaryComment';

const FetchDiary = () => {
  const { thisUserName, loading, setLoading } = useContext(ApiContext);

  const [diary, setDiary] = useState({});
  const [diaryContentLength, setDiaryContentLength] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditComment, setIsEditComment] = useState(false);
  const [leaveComment, setLeaveComment] = useState('');
  const [alreadyCommentedDialog, setAlreadyCommentedDialog] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [fetch, setFetch] = useState(false);

  const handleClose = useCallback(() => {
    setDialogOpen(false);
    setAlreadyCommentedDialog(false);
  }, []);

  const handleEditComment = useCallback(() => {
    if (!(diary.commenters === null || diary.commenters.indexOf(thisUserName) === -1)) {
      setAlreadyCommentedDialog(true);
    } else {
      setIsEditComment(true);
    }
  }, [diary.commenters, thisUserName]);

  const updateLeaveComment = useCallback(
    () => (event) => {
      setLeaveComment(event.target.value);
    },
    []
  );

  useEffect(() => {
    const fetchDiary = async () => {
      setLoading(true);
      const apiName = 'GETStoreAPI';
      const path = ``;

      const myInit = {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
        },
      };

      await API.get(apiName, path, myInit)
        .then((response) => {
          console.log(response);
          setDiary(response);
          setDiaryContentLength(response.content.length);
          if (response.id === '') {
            setDialogOpen(true);
          }
          console.log(thisUserName);
          if (response.reactioners === null || response.reactioners.indexOf(thisUserName) === -1) {
            setFavorite(false);
          } else {
            setFavorite(true);
          }
          setIsEditComment(false);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };
    fetchDiary();
  }, [thisUserName, fetch, setLoading]);

  const updateDiary = useCallback(async () => {
    const apiName = 'REACTIONDiaryAPI';
    const path = '';

    const postData = {
      id: diary.id,
      post_at: diary.post_at,
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
        setDiary({ ...diary, reaction: response.reaction, reactioners: response.reactioners });
        setFavorite(!favorite);
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [diary, favorite]);

  const commentDiary = useCallback(async () => {
    console.log(leaveComment);
    const apiName = 'COMMENTDiaryAPI';
    const path = '';

    const postData = {
      id: diary.id,
      post_at: diary.post_at,
      comment: leaveComment,
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
        console.log(response);
        if (response.is_comment) {
          setAlreadyCommentedDialog(true);
        } else {
          setDiary({ ...diary, comments: response.comments });
        }
        setIsEditComment(false);
        setLeaveComment('');
      })
      .catch((err) => {
        console.log(err);
      });
  }, [diary, leaveComment]);

  const maxCommentLength = useMemo(() => {
    return diaryContentLength < 70 ? diaryContentLength : 70;
  }, [diaryContentLength]);

  const isCommentLengthOver = useMemo(() => {
    const leaveCommentLength = leaveComment.length;
    return leaveCommentLength > 0 && leaveCommentLength <= maxCommentLength;
  }, [leaveComment.length, maxCommentLength]);

  return (
    <Container className="sm:w-full md:w-700 mt-6">
      <FetchedDiaryCard diary={diary} updateDiary={updateDiary} favorite={favorite} />

      <Grid container justify="flex-end">
        <Button style={{ marginRight: '3%' }} variant="contained" color="primary" onClick={() => setFetch(!fetch)}>
          <p style={{ color: 'white', margin: '3px', fontWeight: 'bold' }}>日記を取得する</p>
        </Button>
      </Grid>

      <DiaryComment
        diaryComment={diary.comments}
        isEditComment={isEditComment}
        leaveComment={leaveComment}
        updateLeaveComment={updateLeaveComment}
        maxCommentLength={maxCommentLength}
        isCommentLengthOver={isCommentLengthOver}
        commentDiary={commentDiary}
        handleEditComment={handleEditComment}
        diaryCommentTile={'足跡を残す'}
      />

      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle id="simple-dialog-title">
          <p className="text-base">取得できる日記がありません</p>
          <p className="text-sm">※過去にいいねした日記は取得できません</p>
        </DialogTitle>
      </Dialog>

      <Dialog open={alreadyCommentedDialog} onClose={handleClose}>
        <DialogTitle id="simple-dialog-title">
          <p className="text-base">足跡は1つまでしか残せません</p>
        </DialogTitle>
      </Dialog>
      {loading && <CircularProgress />}
    </Container>
  );
};

export default FetchDiary;
