import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { Auth, API } from "aws-amplify";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ApiContext } from "../../context/ApiContext";
import DiaryCard from "../atoms/DiaryCard";
import Pagination from "../atoms/Pagination";

const FetchMyFavoritesDiaries = () => {
  const { loading, setLoading } = useContext(ApiContext);

  const [page, setPage] = useState(1);
  const [myAllFavoritesDiaries, setMyAllFavoritesDiaries] = useState([]);
  const [myFavoritesDiaries, setMyFavoritesDiaries] = useState([]);
  const [diaryID, setDiaryID] = useState("");
  const [maxPageNumber, setMaxPageNumber] = useState();

  const lastDiaryIDList = useMemo(() => {
    const number = 6;
    const length = Math.ceil(myAllFavoritesDiaries.length / number);
    return new Array(length)
      .fill()
      .map((_, i) => myAllFavoritesDiaries.slice(i * number, (i + 1) * number));
  }, [myAllFavoritesDiaries]);

  useEffect(() => {
    const fetchMyFavoritesDiaries = async () => {
      setLoading(true);
      const apiName = "FAVORITESDiaryAPI";
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
          if (response.Diaries.length > myAllFavoritesDiaries.length) {
            setMyAllFavoritesDiaries(response.Diaries);
          }
          setMyFavoritesDiaries(response.Diaries.slice(0, 6));
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };
    setMaxPageNumber(Math.ceil(myAllFavoritesDiaries.length / 6));
    fetchMyFavoritesDiaries("");
  }, [diaryID, myAllFavoritesDiaries.length, setLoading]);

  const prevPage = useCallback(() => {
    if (page === 2) {
      setDiaryID("");
    } else {
      setDiaryID(lastDiaryIDList[page - 3].slice(-1)[0].id);
    }
    setPage(page - 1);
  }, [page, lastDiaryIDList]);

  const nextPage = useCallback(() => {
    setDiaryID(lastDiaryIDList[page - 1].slice(-1)[0].id);
    setPage(page + 1);
  }, [page, lastDiaryIDList]);

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
