import React, { useContext } from 'react';
import { ApiContext } from '../context/ApiContext';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FavoriteIcon from '@material-ui/icons/Favorite';

const MyDiaryDetail = () => {
  const { myDiaryDetail } = useContext(ApiContext);
  return (
    <Container style={{ marginTop: '20px' }} maxWidth="md">
      <Typography style={{ marginTop: '30px', color: 'black', marginBottom: '10%' }} variant="h6">
        貴方の日記の詳細
      </Typography>
      <TextField
        style={{ width: '100%', marginBottom: '5%' }}
        multiline
        rows={20}
        value={myDiaryDetail.diaryContent}
        disabled
      />
      <Grid container justify="flex-end">
        <Button variant="contained">
          <FavoriteIcon style={{ marginRight: '2%' }} color="error" />
          {myDiaryDetail.diaryReaction}
        </Button>
      </Grid>
    </Container>
  );
};

export default MyDiaryDetail;
