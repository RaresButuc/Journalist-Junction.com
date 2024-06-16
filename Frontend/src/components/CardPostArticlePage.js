export default function CardPostArticlePage({ article,image }) {
  return (
    <div
      className="card border-danger col-xl-3 col-lg-4 col-md-6 mx-auto mt-4"
      style={{ width: "18rem" }}
    >
      <a
        href={`/article/edit/${article.id}`}
        style={{ textDecoration: "none", color: "black" }}
      >
        <img
          src={image}
          className="card-img-top"
          style={{ padding: "25px", width: "256px" }}
        />
        <div className="card-body">
          <h5 className="card-title">
            {article.title
              ? article.title?.length > 95
                ? article.title.substring(0, 45) + "..."
                : article.title
              : "No Title was provided for this Article"}
          </h5>
          <hr />
          <p className="card-text">
            {article.thumbnailDescription
              ? article.thumbnailDescription?.length > 95
                ? article.thumbnailDescription.substring(0, 96) + "..."
                : article.thumbnailDescription
              : "No Short Description was provided for this Article"}
          </p>
        </div>
      </a>
    </div>
  );
}
