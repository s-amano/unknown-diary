import React, { useEffect, useState, useContext, useCallback } from "react";
import { useRecoilState } from "recoil";
import { myPageAtom, myDiaryIDAtom, myAllDiariesAtom } from "../../recoil/atom";
import { Auth, API } from "aws-amplify";
import FetchMyDiaries from "../organisms/FetchMyDiaries";
import StatisticalDataCard from "../molecules/StatisticalDataCard";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { ApiContext } from "../../context/ApiContext";
import CircularProgress from "@material-ui/core/CircularProgress";
import Pagination from "../atoms/Pagination";

const MyProfile = () => {
  const [diaryID, setDiaryID] = useRecoilState(myDiaryIDAtom);
  const [page, setPage] = useRecoilState(myPageAtom);
  const [myAllDiaries, setMyAllDiaries] = useRecoilState(myAllDiariesAtom);
  const [myDiaries, setMyDiaries] = useState([]);
  const { loading, setLoading } = useContext(ApiContext);

  useEffect(() => {
    const apiName = "GETMyDiariesAPI";

    const fetchMyAllDiaries = async () => {
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
          setMyAllDiaries(response.Diaries);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };
    const fetchMyDiaries = async () => {
      setLoading(true);
      const limit = "6";
      const path = diaryID === "" ? `` : `?id=${diaryID}&limit=${limit}`;

      const myInit = {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession())
            .getIdToken()
            .getJwtToken()}`,
        },
      };

      await API.get(apiName, path, myInit)
        .then((response) => {
          setMyDiaries(response.Diaries.slice(0, 6));
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };

    fetchMyAllDiaries();
    fetchMyDiaries();
  }, [diaryID, setLoading, setMyAllDiaries]);

  const length = Math.ceil(myAllDiaries.length / 6);
  const maxPageNumber = Math.ceil(myAllDiaries.length / 6);
  const lastDiaryIDList = new Array(length)
    .fill()
    .map((_, i) => myAllDiaries.slice(i * 6, (i + 1) * 6));

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
        貴方のプロフィール
      </Typography>
      <StatisticalDataCard myDiaries={myAllDiaries} />
      {loading && <CircularProgress />}
      <FetchMyDiaries myDiaries={myDiaries} />
      <Pagination
        page={page}
        maxPageNumber={maxPageNumber}
        prevPage={prevPage}
        nextPage={nextPage}
      />
    </Container>
  );
};

export default MyProfile;
