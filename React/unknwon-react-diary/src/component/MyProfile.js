import React from 'react';
import FetchMyDiaries from './FetchMyDiaries';
import StatisticalDataCard from './StatisticalDataCard';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

const MyProfile = () => {
  return (
    <Container style={{ marginTop: '40px' }} maxWidth="md">
      <Typography style={{ marginTop: '30px', color: 'black', marginBottom: '10%' }} variant="h6">
        貴方のプロフィール
      </Typography>
      <StatisticalDataCard />
      <FetchMyDiaries />
    </Container>
  );
};

export default MyProfile;
