import React, { memo } from 'react';
import FavoriteIcon from '@material-ui/icons/Favorite';

export default memo(function FilledFavoriteIcon() {
  return <FavoriteIcon className="mr-1" color="error" />;
});
