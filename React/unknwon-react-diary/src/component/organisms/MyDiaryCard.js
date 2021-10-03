import React, { memo } from 'react';
import DiaryDate from '../atoms/DiaryDate';
import DiaryTitle from '../atoms/DiaryTilte';
import DiaryContent from '../atoms/DiaryContent';
import FilledFavoriteIcon from '../atoms/FilledFavoriteIcon';
import DiaryReactionCount from '../atoms/DiaryReactionCount';
import { IconButton } from '@material-ui/core';

export default memo(function MyDiaryCard(props) {
  const { diary } = props;
  return (
    <>
      <DiaryDate diaryDate={diary.date} />
      <div className="bg-white text-center shadow-xl py-4 px-3 w-10/12 max-w-2xl rounded-md mx-6 mb-6">
        <DiaryTitle diaryTitle={diary.title} />
        <DiaryContent diaryContent={diary.content} />
        <div className="flex justify-end">
          <IconButton className="p-2">
            <FilledFavoriteIcon />
          </IconButton>
          <DiaryReactionCount diaryReaction={diary.reaction} />
        </div>
      </div>
    </>
  );
});
