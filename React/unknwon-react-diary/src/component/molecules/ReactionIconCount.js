import React from 'react';
import FilledFavoriteIcon from '../atoms/FilledFavoriteIcon';
import BorderedFavoriteIcon from '../atoms/BorderedFavoriteIcon';
import DiaryReactionCount from '../atoms/DiaryReactionCount';
import { IconButton } from '@material-ui/core';

export default function ReactionIconCount(props) {
  const { updateDiary, favorite, diaryReaction } = props;

  return (
    <div className="flex justify-end">
      <IconButton className="p-2" onClick={() => updateDiary()}>
        {favorite ? <FilledFavoriteIcon /> : <BorderedFavoriteIcon />}
      </IconButton>
      <DiaryReactionCount diaryReaction={diaryReaction} />
    </div>
  );
}
