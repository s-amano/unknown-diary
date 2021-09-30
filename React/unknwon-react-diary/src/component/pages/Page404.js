import React from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

const Page404 = () => {
  return (
    <div className="flex flex-wrap content-between justify-center">
      <div className="shadow-xl rounded-md bg-white w-80 m-6">
        <div className="p-4">
          <p className="text-center text-xl font-semibold pb-3">404</p>
          <p className="text-left text-base">
            ペーシが存在しません。アドレスの入力ミスか、ページが移動した可能性があります。
          </p>
        </div>
        <div className="p-2">
          <Button variant="contained" color="primary" component={Link} to="/">
            homeへ戻る
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page404;
