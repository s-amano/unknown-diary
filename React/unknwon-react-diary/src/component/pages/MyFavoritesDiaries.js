import React, { useState, useEffect, useContext, useCallback } from "react";
import { useRecoilState } from "recoil";
import {
  favoriteDiaryIDAtom,
  favoritePageAtom,
  myAllFavoritesDiariesAtom,
} from "../../recoil/atom";
import { Auth, API } from "aws-amplify";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ApiContext } from "../../context/ApiContext";
import DiaryCard from "../atoms/DiaryCard";
import Pagination from "../atoms/Pagination";

const FetchMyFavoritesDiaries = () => {
  const { loading, setLoading } = useContext(ApiContext);

  const [diaryID, setDiaryID] = useRecoilState(favoriteDiaryIDAtom);
  const [page, setPage] = useRecoilState(favoritePageAtom);
  const [myAllFavoritesDiaries, setMyAllFavoritesDiaries] = useRecoilState(
    myAllFavoritesDiariesAtom
  );
  const [myFavoritesDiaries, setMyFavoritesDiaries] = useState([]);

  useEffect(() => {
    const apiName = "FAVORITESDiaryAPI";
    const fetchAllFavoritesDiaries = async () => {
      const myInit = {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession())
            .getIdToken()
            .getJwtToken()}`,
        },
      };
      setLoading(true);
      await API.get(apiName, "", myInit)
        .then((response) => {
          setMyAllFavoritesDiaries(response.Diaries);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };

    const fetchMyFavoritesDiaries = async () => {
      const myInit = {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession())
            .getIdToken()
            .getJwtToken()}`,
        },
      };
      const path = diaryID === "" ? `` : `?id=${diaryID}&limit=${6}`;
      setLoading(true);
      await API.get(apiName, path, myInit)
        .then((response) => {
          setMyFavoritesDiaries(response.Diaries.slice(0, 6));
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };
    fetchAllFavoritesDiaries();
    fetchMyFavoritesDiaries();
  }, [diaryID, setLoading, setMyAllFavoritesDiaries]);

  const length = Math.ceil(myAllFavoritesDiaries.length / 6);
  const maxPageNumber = Math.ceil(myAllFavoritesDiaries.length / 6);
  const lastDiaryIDList = new Array(length)
    .fill()
    .map((_, i) => myAllFavoritesDiaries.slice(i * 6, (i + 1) * 6));

  const prevPage = useCallback(() => {
    if (page === 2) {
      setDiaryID("");
    } else {
      setDiaryID(lastDiaryIDList[page - 3].slice(-1)[0].id);
    }
    setPage(page - 1);
  }, [page, lastDiaryIDList, setDiaryID, setPage]);

  const nextPage = useCallback(() => {
    setDiaryID(lastDiaryIDList[page - 1].slice(-1)[0].id);
    setPage(page + 1);
  }, [page, lastDiaryIDList, setDiaryID, setPage]);

  return (
    <Container style={{ marginTop: "40px" }} maxWidth="md">
      <Typography style={{ marginTop: "30px", color: "black" }} variant="h6">
        いいねした日記
      </Typography>
      {loading && <CircularProgress />}
      <div className="flex flex-wrap content-between justify-center">
        {myFavoritesDiaries.map((value, key) => {
          value.title = value.title ? value.title : "タイトルなし";
          value.date = value.date ? value.date : "日付なし";
          const maxLength = 37;
          if (value.content.length > maxLength) {
            value.content = value.content.substr(0, maxLength) + "...";
          }
          return (
            <DiaryCard key={key} pathname="/favorites/detail" diary={value} />
          );
        })}
      </div>

      <Pagination
        page={page}
        maxPageNumber={maxPageNumber}
        prevPage={prevPage}
        nextPage={nextPage}
      />
    </Container>
  );
};

export default FetchMyFavoritesDiaries;
