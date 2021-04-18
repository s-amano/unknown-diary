import React, { useContext } from 'react';
import { ApiContext } from '../context/ApiContext';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

const MyDiaryDetail = () => {
  const { myDiaryDetail } = useContext(ApiContext);
  return (
    <Container style={{ marginTop: '20px' }} maxWidth="md">
      <Grid container>
        <Button variant="contained" color="primary">
          <Link to="/mydiary" style={{ textDecoration: 'none', color: 'white' }}>
            戻る
          </Link>
        </Button>
      </Grid>
      <Typography style={{ marginTop: '30px', color: 'black', marginBottom: '10%' }} variant="h6">
        自分の日記の詳細
      </Typography>
      <TextField style={{ width: '100%', marginBottom: '5%' }} multiline rows={20} value={myDiaryDetail} disabled />
    </Container>
  );
};

export default MyDiaryDetail;
