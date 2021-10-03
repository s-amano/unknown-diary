import React, { memo } from 'react';
import DiaryCard from '../atoms/DiaryCard';

const FetchMyDiaries = memo((props) => {
  const { myDiaries } = props;

  return (
    <>
      <div className="flex flex-wrap content-between justify-center">
        {myDiaries.map((value, key) => {
          value.title = value.title ? value.title : 'タイトルなし';
          value.date = value.date ? value.date : '日付なし';
          const maxLength = 37;
          if (value.content.length > maxLength) {
            value.content = value.content.substr(0, maxLength) + '...';
          }
          return <DiaryCard key={key} pathname="/mydiary/detail" diary={value} />;
        })}
      </div>
    </>
  );
});

export default FetchMyDiaries;
