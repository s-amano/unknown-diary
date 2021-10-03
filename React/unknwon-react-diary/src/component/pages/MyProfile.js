import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react';
import { Auth, API } from 'aws-amplify';
import FetchMyDiaries from '../organisms/FetchMyDiaries';
import StatisticalDataCard from '../molecules/StatisticalDataCard';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { ApiContext } from '../../context/ApiContext';
import CircularProgress from '@material-ui/core/CircularProgress';
import Pagination from '../atoms/Pagination';

const MyProfile = () => {
  const [myAllDiaries, setMyAllDiaries] = useState([]);
  const [myDiaries, setMyDiaries] = useState([]);
  const { loading, setLoading } = useContext(ApiContext);
  const [page, setPage] = useState(1);
  const [diaryID, setDiaryID] = useState('');

  const lastDiraryIDList = useMemo(() => {
    const number = 6;
    const length = Math.ceil(myAllDiaries.length / 6);
    return new Array(length).fill().map((_, i) => myAllDiaries.slice(i * number, (i + 1) * number));
  }, [myAllDiaries]);

  const maxPageNumber = useMemo(() => {
    Math.ceil(myAllDiaries.length / 6);
  }, [myAllDiaries]);

  const prevPage = useCallback(() => {
    if (page === 2) {
      setDiaryID('');
    } else {
      setDiaryID(lastDiraryIDList[page - 3].slice(-1)[0].id);
    }
    setPage(page - 1);
  }, [page, lastDiraryIDList]);

  const nextPage = useCallback(() => {
    setDiaryID(lastDiraryIDList[page - 1].slice(-1)[0].id);
    setPage(page + 1);
  }, [page, lastDiraryIDList]);

  useEffect(() => {
    const fetchMyDiaries = async () => {
      setLoading(true);
      const apiName = 'GETMyDiariesAPI';
      const limit = '6';
      const path = diaryID === '' ? `` : `?id=${diaryID}&limit=${limit}`;

      const myInit = {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
        },
      };

      await API.get(apiName, path, myInit)
        .then((response) => {
          console.log(response.Diaries);
          setMyDiaries(response.Diaries);
          if (response.Diaries.length > myAllDiaries.length) {
            setMyAllDiaries(response.Diaries);
          }
          setMyDiaries(response.Diaries.slice(0, 6));
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };

    fetchMyDiaries('');
  }, [diaryID, myAllDiaries.length, setLoading]);
  return (
    <Container style={{ marginTop: '40px' }} maxWidth="md">
      <Typography style={{ marginTop: '30px', color: 'black' }} variant="h6">
        貴方のプロフィール
      </Typography>
      <StatisticalDataCard myDiaries={myAllDiaries} />
      {loading && <CircularProgress />}
      <FetchMyDiaries myDiaries={myDiaries} />
      <Pagination page={page} maxPageNumber={maxPageNumber} prevPage={prevPage} nextPage={nextPage} />
    </Container>
  );
};

export default MyProfile;
