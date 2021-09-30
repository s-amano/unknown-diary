import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Page404 from '../component/Page404';
import PostDiary from '../component/PostDiary';
import FetchDiary from '../component/FetchDiary';
import MyDiaryDetail from '../component/MyDiaryDetail';
import MyProfile from '../component/pages/MyProfile';
import MyFavoritesDiaries from '../component/MyFavoritesDiaries';
import Home from '../component/Home';

const Router = () => {
  return (
    <Switch>
      <Route exact path="/mydiary" component={MyProfile} />
      <Route exact path="/mydiary-detail" component={MyDiaryDetail} />
      <Route exact path="/diary" component={FetchDiary} />
      <Route exact path="/post" component={PostDiary} />
      <Route exact path="/" component={Home} />
      <Route exact path="/favorites" component={MyFavoritesDiaries} />
      <Route component={Page404} />
    </Switch>
  );
};

export default Router;
