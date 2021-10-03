import React from 'react';

export default function DiaryReactionCount(props) {
  const { diaryReaction } = props;
  return <p className="py-2 pr-2 m-0 text-base font-bold">{diaryReaction}</p>;
}
