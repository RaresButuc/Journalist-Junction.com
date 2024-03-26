const ViewPhoto = ({ photoData, onClose }) => {
  return (
    <div
      className="modal"
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-lg" style={{ overflowY: "auto" }}>
        <div className="modal-content">
          <div className="modal-header d-flex justify-content-center">
            <button
              type="button"
              className="border-danger border-3"
              aria-label="Close"
              onClick={onClose}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <img
              src={photoData.preview}
              className="img-fluid"
              alt="Full Size"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPhoto;
