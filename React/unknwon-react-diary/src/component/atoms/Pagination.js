import { memo } from 'react';
import { Button } from '@material-ui/core';

export default memo(function Pagination(props) {
  const { page, maxPageNumber, prevPage, nextPage } = props;
  console.log(props);
  return (
    <div className="px-3 mt-9 mb-12">
      {page !== 1 && (
        <Button className="mr-4" style={{ marginRight: '3%' }} onClick={() => prevPage()}>
          <a href={() => false}>&lt; Previous</a>
        </Button>
      )}
      {page !== maxPageNumber && (
        <Button onClick={() => nextPage()}>
          <a href={() => false} className="ml-4">
            Next &gt;
          </a>
        </Button>
      )}
    </div>
  );
});
