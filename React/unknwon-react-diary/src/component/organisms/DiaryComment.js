import React from 'react';
import DiaryCommentBubble from '../atoms/DiaryCommentBubble';
import DiaryCommentEdit from '../molecules/DiaryCommentEdit';
import DiaryCommentButton from '../atoms/DiaryCommentButton';

const DiaryComment = (props) => {
  const {
    diaryComment,
    isEditComment,
    leaveComment,
    updateLeaveComment,
    maxCommentLength,
    isCommentLengthOver,
    commentDiary,
    handleEditComment,
    diaryCommentTile,
  } = props;
  console.log(diaryComment);
  return (
    <div className="flex flex-col w-11/12 pl-8 mt-4">
      <p className="text-xl text-gray-800 font-semibold mb-3 text-left">{diaryCommentTile}</p>

      {diaryComment
        ? diaryComment.map((comment, index) => <DiaryCommentBubble key={index} diaryComment={comment} />)
        : null}

      {isEditComment ? (
        <DiaryCommentEdit
          leaveComment={leaveComment}
          updateLeaveComment={updateLeaveComment}
          maxCommentLength={maxCommentLength}
          isCommentLengthOver={isCommentLengthOver}
          commentDiary={commentDiary}
        />
      ) : (
        <DiaryCommentButton handleEditComment={handleEditComment} />
      )}
    </div>
  );
};

export default DiaryComment;
