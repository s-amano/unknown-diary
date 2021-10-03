import React, { memo } from 'react';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

export default memo(function BorderedFavoriteIcon() {
  return <FavoriteBorder className="mr-1" color="error" />;
});
