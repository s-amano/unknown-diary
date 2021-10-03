import React, { useState, useEffect, memo, useContext } from 'react';
import { Auth, API } from 'aws-amplify';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ApiContext } from '../context/ApiContext';
import DiaryCard from './atoms/DiaryCard';
import Pagination from '../component/atoms/Pagination';

const FetchMyDiaries = memo((props) => {
  const { loading, setLoading } = useContext(ApiContext);

  const [page, setPage] = useState(1);
  const [myDiaries, setMyDiaries] = useState([]);
  const [diaryID, setDiaryID] = useState('');

  const sliceByNumber = (array, number) => {
    const length = Math.ceil(array.length / number);
    return new Array(length).fill().map((_, i) => array.slice(i * number, (i + 1) * number));
  };

  const lastDiraryIDList = sliceByNumber(props.myDiaries, 6);

  var maxPageNumber = Math.ceil(props.myDiaries.length / 6);

  useEffect(() => {
    const fetchMyDiaries = async () => {
      setLoading(true);
      const limit = '6';
      const apiName = 'GETMyDiariesAPI';
      const path = diaryID === '' ? `?limit=${limit}` : `?id=${diaryID}&limit=${limit}`;

      const myInit = {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
        },
      };

      await API.get(apiName, path, myInit)
        .then((response) => {
          setMyDiaries(response.Diaries);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };
    fetchMyDiaries('');
  }, [diaryID, setLoading]);

  const prevPage = () => {
    if (page === 2) {
      setDiaryID('');
    } else {
      setDiaryID(lastDiraryIDList[page - 3].slice(-1)[0].id);
    }
    setPage(page - 1);
  };

  const nextPage = () => {
    setDiaryID(lastDiraryIDList[page - 1].slice(-1)[0].id);
    setPage(page + 1);
  };
  return (
    <>
      {loading && <CircularProgress />}
      <div className="flex flex-wrap content-between justify-center">
        {myDiaries.map((value, key) => {
          value.title = value.title ? value.title : 'タイトルなし';
          value.date = value.date ? value.date : '日付なし';
          const maxLength = 37;
          if (value.content.length > maxLength) {
            value.content = value.content.substr(0, maxLength) + '...';
          }
          return <DiaryCard key={key} pathname="/mydiary/detail" diary={value} />;
        })}
      </div>

      <Pagination page={page} maxPageNumber={maxPageNumber} prevPage={prevPage} nextPage={nextPage} />
    </>
  );
});

export default FetchMyDiaries;
