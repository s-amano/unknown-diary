import React from 'react';

export default function DiaryTitle(props) {
  const { diaryTitle } = props;
  return (
    <p className="text-xl mb-3 text-black font-bold text-gray-600 text-left">
      {diaryTitle !== '' ? diaryTitle : 'タイトルなし'}
    </p>
  );
}
