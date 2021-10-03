import React, { memo } from 'react';
import TextField from '@material-ui/core/TextField';
import AddCommentIcon from '@material-ui/icons/AddComment';
import Button from '@material-ui/core/Button';

const DiaryCommentEdit = memo((props) => {
  const { leaveComment, updateLeaveComment, maxCommentLength, isCommentLengthOver, commentDiary } = props;
  return (
    <div className="flex-start mt-2">
      <div className="flex">
        <TextField
          className="ml-1 sm:w-full md:w-2/3"
          value={leaveComment}
          rows={2}
          rowsMax={2}
          multiline
          onChange={updateLeaveComment()}
          helperText={`${maxCommentLength}文字以下`}
          error={Boolean(!isCommentLengthOver)}
          variant="filled"
        />
        <Button onClick={() => commentDiary()} disabled={Boolean(!isCommentLengthOver)}>
          <AddCommentIcon />
        </Button>
      </div>
    </div>
  );
});

export default DiaryCommentEdit;
