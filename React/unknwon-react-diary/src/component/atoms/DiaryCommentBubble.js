import React from 'react';

export default function DiaryCommentBubble(props) {
  const { diaryComment } = props;
  console.log(diaryComment);
  return (
    <div className="bg-white shadow-xl rounded-2xl mb-4 sm:w-9/12 md:w-2/3 text-left py-1 px-2">
      <p className="ml-3">{diaryComment}</p>
    </div>
  );
}
