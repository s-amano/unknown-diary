import React, { memo } from 'react';
import FavoriteIcon from '@material-ui/icons/Favorite';

export default memo(function FetchedDiaryCard(props) {
  const { diary } = props;

  return (
    <>
      <div className="text-right mr-12 mb-1">
        <p className="text-gray-500 text-lg ml-auto">{diary.date ? diary.date : '日付なし'}</p>
      </div>

      <div className="bg-white text-center shadow-xl py-4 px-3 max-w-2xl rounded-md md:mx-7 mb-6">
        <p className="text-xl mb-3 text-black font-bold text-gray-600 text-left">
          {diary.title !== '' ? diary.title : 'タイトルなし'}
        </p>
        <p className="text-left mb-4 pl-3 whitespace-pre-wrap">{diary.content}</p>
        <div className="flex justify-end">
          <FavoriteIcon className="mr-1" color="error" />
          <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>{diary.reaction}</p>
        </div>
      </div>
    </>
  );
});
