import React, { useState, useEffect } from 'react';
import { Auth, API } from 'aws-amplify';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Button from '@material-ui/core/Button';

const FetchMyFavoriteDiaries = (props) => {
  const [page, setPage] = useState(1);
  const [myFavoriteDiaries, setMyFavoriteDiaries] = useState([]);

  const sliceByNumber = (array, number) => {
    const length = Math.ceil(array.length / number);
    return new Array(length).fill().map((_, i) => array.slice(i * number, (i + 1) * number));
  };

  const lastDiraryIDList = sliceByNumber(myFavoriteDiaries, 6);

  let maxPageNumber = Math.ceil(myFavoriteDiaries.length / 6);

  const envAPI = () => {
    const env = process.env.REACT_APP_ENVIROMENT;
    console.log(env);
    if (env === 'prod') {
      return 'GETMyDiariesAPIProd';
    } else if (env === 'dev') {
      return 'GETMyDiariesAPIDev';
    }
  };

  useEffect(() => {
    const fetchMyFavoriteDiaries = async () => {
      const limit = '6';
      const apiName = envAPI();
      const path = `?limit=${limit}`;

      const myInit = {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
        },
      };

      await API.get(apiName, path, myInit)
        .then((response) => {
          setMyFavoriteDiaries(response.Diaries);
          setPage(1);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchMyFavoriteDiaries('');
  }, []);

  const fetchMyFavoriteDiaries = async (id) => {
    const limit = '6';
    const apiName = envAPI();
    const path = `?id=${id}&limit=${limit}`;

    const myInit = {
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
      },
    };

    await API.get(apiName, path, myInit)
      .then((response) => {
        setMyFavoriteDiaries(response.Diaries);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const prevPage = () => {
    if (page === 2) {
      fetchMyFavoriteDiaries('');
    } else {
      fetchMyFavoriteDiaries(lastDiraryIDList[page - 3].slice(-1)[0].id);
    }
    setPage(page - 1);
  };

  const nextPage = () => {
    fetchMyFavoriteDiaries(lastDiraryIDList[page - 1].slice(-1)[0].id);
    setPage(page + 1);
  };
  return (
    <>
      <Typography style={{ marginTop: '30px', color: 'black' }} variant="h6">
        いいねした日記
      </Typography>
      <div className="flex flex-wrap content-between justify-center">
        {myFavoriteDiaries.map((value, key) => {
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
};

export default FetchMyFavoriteDiaries;
