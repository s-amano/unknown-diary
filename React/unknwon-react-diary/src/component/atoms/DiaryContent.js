import React, { memo } from 'react';

export default memo(function DiaryContent(props) {
  const { diaryContent } = props;
  return <p className="text-left mb-4 pl-3 whitespace-pre-wrap">{diaryContent}</p>;
});
