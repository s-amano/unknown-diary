import React, { memo } from 'react';

export default memo(function DiaryDate(props) {
  const { diaryDate } = props;
  return (
    <div className="text-right mr-12 mb-1">
      <p className="text-gray-500 text-lg ml-auto">{diaryDate ? diaryDate : '日付なし'}</p>
    </div>
  );
});
