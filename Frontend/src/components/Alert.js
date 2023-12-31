export default function Alert({ type, message, color }) {
  return (
    <div
      className={`toast-container position-fixed bottom-0 end-0 border border-${color} m-5 bg-white`}
      role="alert"
      aria-live="toast"
      aria-atomic="true"
    >
      <div className={`toast-header bg-${color} text-white`}>
        <strong className="me-auto col-11">{type}</strong>
        <button
          className="ml-2 mb-1 btn-close btn-close-white col-1"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
      <div className="toast-body m-4">{message}</div>
    </div>
  );
}
