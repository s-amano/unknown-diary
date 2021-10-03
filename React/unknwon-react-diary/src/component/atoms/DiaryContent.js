import React from 'react';

export default function DiaryContent(props) {
  const { diaryContent } = props;
  return <p className="text-left mb-4 pl-3 whitespace-pre-wrap">{diaryContent}</p>;
}
