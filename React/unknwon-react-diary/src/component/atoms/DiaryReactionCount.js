import React, { memo } from 'react';

export default memo(function DiaryReactionCount(props) {
  const { diaryReaction } = props;
  return <p className="py-2 pr-2 m-0 text-base font-bold">{diaryReaction}</p>;
});
