import ReactPaginate from "react-paginate";

import ChangeLink from "../usefull/ChangeLink.js";

export default function Pagination({ elements }) {
  return (
    <div className="d-flex justify-content-center mt-5">
      <ReactPaginate
        previousLabel="Previous"
        nextLabel="Next"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        pageCount={elements?.totalPages}
        pageRangeDisplayed={2}
        marginPagesDisplayed={2}
        onPageChange={(e) => ChangeLink("pagenumber", e.selected + 1)}
        containerClassName="pagination justify-content-center"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        activeClassName="active"
        forcePage={elements?.number}
      />
    </div>
  );
}
