import React from 'react';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Typography from '@material-ui/core/Typography';

export default function DiaryCard(props) {
  const { pathname, diary } = props;
  return (
    <div className="shadow-xl rounded-md bg-white w-80 m-6">
      <Link to={{ pathname: pathname, search: `?id=${diary.id}` }} style={{ textDecoration: 'none' }}>
        <div className="flex flex-col h-full content-between">
          <div className="p-4 mb-auto">
            <p className="text-left text-xl font-semibold text-gray-600">{diary.title}</p>
            <Typography style={{ textAlign: 'left' }} variant="body2" color="textSecondary" component="p">
              {diary.content}
            </Typography>
          </div>
          <div className="flex px-2 pb-2 items-center">
            <FavoriteIcon style={{ marginRight: '2%' }} color="error" />
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>{diary.reaction}</p>
            <p className="text-gray-500 text-lg ml-auto">{diary.date}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
