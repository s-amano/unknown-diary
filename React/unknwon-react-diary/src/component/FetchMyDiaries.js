import React, { useState, useEffect, memo, useContext } from 'react';
import { Auth, API } from 'aws-amplify';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ApiContext } from '../context/ApiContext';

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
          const diaryContent = value.content;
          const diaryReaction = value.reaction;
          const diaryTitle = value.title ? value.title : 'タイトルなし';
          const diaryDate = value.date ? value.date : '日付なし';
          const maxLength = 37;
          let modifiedDiaryContent = '';
          if (diaryContent.length > maxLength) {
            modifiedDiaryContent = diaryContent.substr(0, maxLength) + '...';
          } else {
            modifiedDiaryContent = diaryContent;
          }

          return (
            <div key={key} className="shadow-xl rounded-md bg-white w-80 m-6">
              <Link to={{ pathname: '/mydiary-detail', search: `?id=${value.id}` }} style={{ textDecoration: 'none' }}>
                <div className="flex flex-col h-full content-between">
                  <div className="p-4 mb-auto">
                    <p className="text-left text-xl font-semibold text-gray-600">{diaryTitle}</p>
                    <Typography style={{ textAlign: 'left' }} variant="body2" color="textSecondary" component="p">
                      {modifiedDiaryContent}
                    </Typography>
                  </div>
                  <div className="flex px-2 pb-2 items-center">
                    <FavoriteIcon style={{ marginRight: '2%' }} color="error" />
                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>{diaryReaction}</p>
                    <p className="text-gray-500 text-lg ml-auto">{diaryDate}</p>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      <div style={{ paddingLeft: '12px', paddingRight: '12px', marginTop: '36px', marginBottom: '48px' }}>
        {page !== 1 && (
          <Button style={{ marginRight: '3%' }} onClick={() => prevPage()}>
            <a href={() => false}>&lt; Previous</a>
          </Button>
        )}
        {page !== maxPageNumber && (
          <Button onClick={() => nextPage()}>
            <a href={() => false} className="ml-4">
              Next &gt;
            </a>
          </Button>
        )}
      </div>
    </>
  );
});

export default FetchMyDiaries;
