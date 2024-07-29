export default function LoaderSaver({ message }) {
  return (
    <div
      className="position-fixed bottom-0 end-0 m-5"
      role="alert"
      aria-live="toast"
      aria-atomic="true"
    >
      <div className="d-flex justify-content-center">
        <div className="typewriter">
          <div className="slide">
            <i className="bi bi-save"></i>
          </div>
          <div className="paper"></div>
          <div className="keyboard"></div>
        </div>
      </div>

      <div
        className="border border-danger rounded-pill mt-2 d-flex align-items-center justify-content-center bg-white"
        style={{
          display: "inline-flex",
          padding: "10px 20px",
          whiteSpace: "nowrap",
          maxWidth: "100%",
        }}
      >
        <h5 className="mb-0">
          <b>{message}</b>
        </h5>
      </div>
    </div>
  );
}
