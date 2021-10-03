import React, { memo } from 'react';
import DiaryDate from '../atoms/DiaryDate';
import DiaryTitle from '../atoms/DiaryTilte';
import ReactionIconCount from '../molecules/ReactionIconCount';
import DiaryContent from '../atoms/DiaryContent';

export default memo(function FetchedDiaryCard(props) {
  console.log('再レンダリング');
  const { diary, updateDiary, favorite } = props;
  return (
    <>
      <DiaryDate diaryDate={diary.date} />
      <div className="bg-white text-center shadow-xl py-4 px-3 w-10/12 max-w-2xl rounded-md mx-6 mb-6">
        <DiaryTitle diaryTitle={diary.title} />
        <DiaryContent diaryContent={diary.content} />
        <ReactionIconCount updateDiary={updateDiary} favorite={favorite} diaryReaction={diary.reaction} />
      </div>
    </>
  );
});
