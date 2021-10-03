import React from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

const DiaryCommentButton = (props) => {
  const { handleEditComment } = props;
  return (
    <div className="flex-start w-full md:w-2/3 mt-2">
      <Button onClick={() => handleEditComment()}>
        <AddIcon />
      </Button>
    </div>
  );
};

export default DiaryCommentButton;
