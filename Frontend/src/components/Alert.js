export default function Alert({ type, message, color }) {
  return (
    <div
      className="toast"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className={`toast-header bg-${color} text-white`}>
        <i data-feather="alert-circle"></i>
        <strong className="mr-auto">{type}</strong>
        <small className="text-white-50 ml-2">just now</small>
        <button
          className="ml-2 mb-1 btn-close btn-close-white"
          type="button"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
      <div className="toast-body">{message}</div>
    </div>
  );
}
