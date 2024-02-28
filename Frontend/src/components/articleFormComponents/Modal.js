export default function Modal({ id, title, message, onAccept }) {
  return (
    <div
      className="modal fade"
      id={id}
      tabIndex="-1"
      aria-labelledby={`modalLabel${id}`}
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`modalLabel${id}`}>
              {title}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">{message}</div>
          <div className="modal-footer d-flex justify-content-center">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              className="btn btn-success"
              onClick={onAccept}
              data-bs-dismiss="modal"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
