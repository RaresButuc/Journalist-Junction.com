export default function NewsBox({ title, source, text, href, datePosted }) {
  return (
    <a
      href={href}
      target="_blank"
      style={{ textDecoration: "none", color: "black" }}
    >
      <div className="d-flex justify-content-center my-3">
        <div className="card border-dark" style={{ width: "600px" }}>
          <div className="card-body">
            <div>
              <div className="row">
                <h5 className="justify-content-start col-6 mb-0 text-primary">
                  <b>{source}</b>
                </h5>
                <h5 className="justify-content-end col-6 text-muted">
                  {datePosted.split("T").reverse().join(" / ").replace("Z", "")}
                </h5>
              </div>
            </div>
            <h4 className="my-2">{title}</h4>
            <p className="card-text">{text}</p>
          </div>
        </div>
      </div>
    </a>
  );
}
