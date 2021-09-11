import React, { useState, useEffect } from 'react';
import { Auth, API } from 'aws-amplify';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

const FetchMyFavoritesDiaries = () => {
  const [page, setPage] = useState(1);
  const [myAllFavoritesDiaries, setMyAllFavoritesDiaries] = useState([]);
  const [myFavoritesDiaries, setMyFavoritesDiaries] = useState([]);

  const sliceByNumber = (array, number) => {
    const length = Math.ceil(array.length / number);
    return new Array(length).fill().map((_, i) => array.slice(i * number, (i + 1) * number));
  };

  const lastDiraryIDList = sliceByNumber(myAllFavoritesDiaries, 6);

  let maxPageNumber = Math.ceil(myAllFavoritesDiaries.length / 6);

  const envAPI = () => {
    const env = process.env.REACT_APP_ENVIROMENT;
    console.log(env);
    if (env === 'prod') {
      return 'GETMyDiariesAPIProd';
    } else if (env === 'dev') {
      return 'FAVORITESDiaryAPIDev';
    }
  };

  useEffect(() => {
    const fetchMyFavoritesDiaries = async () => {
      const apiName = envAPI();
      const path = ``;

      const myInit = {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
        },
      };

      await API.get(apiName, path, myInit)
        .then((response) => {
          setMyAllFavoritesDiaries(response.Diaries);
          setMyFavoritesDiaries(response.Diaries.slice(0, 6));
          setPage(1);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchMyFavoritesDiaries('');
  }, []);

  const fetchMyFavoritesDiaries = async (id) => {
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
        setMyFavoritesDiaries(response.Diaries);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const prevPage = () => {
    if (page === 2) {
      fetchMyFavoritesDiaries('');
    } else {
      fetchMyFavoritesDiaries(lastDiraryIDList[page - 3].slice(-1)[0].id);
    }
    setPage(page - 1);
  };

  const nextPage = () => {
    fetchMyFavoritesDiaries(lastDiraryIDList[page - 1].slice(-1)[0].id);
    setPage(page + 1);
  };
  return (
    <Container style={{ marginTop: '40px' }} maxWidth="md">
      <Typography style={{ marginTop: '30px', color: 'black' }} variant="h6">
        いいねした日記
      </Typography>
      <div className="flex flex-wrap content-between justify-center">
        {myFavoritesDiaries.map((value, key) => {
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
              <Link to={{ pathname: '/diary', search: `?id=${value.id}` }} style={{ textDecoration: 'none' }}>
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
    </Container>
  );
};

export default FetchMyFavoritesDiaries;
