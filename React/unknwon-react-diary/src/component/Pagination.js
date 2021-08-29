import Link from 'next/link';
import { Button } from '@material-ui/core';

export const Pagination = ({ maxPageNumber, currentPageNumber }) => {
  currentPageNumber = Number(currentPageNumber);
  maxPageNumber = Number(maxPageNumber);
  const prevPage = currentPageNumber - 1;
  const nextPage = currentPageNumber + 1;

  return (
    <div className="flex px-3 my-12">
      {currentPageNumber !== 1 && (
        <Button onClick={}>
          <a>&lt; Previous</a>
        </Button>
      )}
      {currentPageNumber !== maxPageNumber && (
        <Button onClick={}>
          <a className="ml-4">Next &gt;</a>
        </Button>
      )}
    </div>
  );
};
