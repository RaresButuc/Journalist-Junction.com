import FirstLetterUppercase from "../usefull/FirstLetterUppercase";

export default function News({ news }) {
  const testObject = {
    id: 1,
    title: "Titlu de Articol",
    short:
      "The decision to freeze the case came as former President Trump’s lawyers asked a court to move slowly in reviewing his claims of presidential immunity.The decision to freeze the case came as former President Trump’s lawyers asked a court to move slowly in reviewing his claims of presidential immunity.",
    categories: ["politics", "lifestyle", "gastronomy"],
    location: "International",
    language: "Romanian",
    ownerName: "Rares",
    views: 100.0,
  };

  return (
    <div className="container-xl">
      {news &&
        news.map((article, index) => (
          <div className="container-xl mt-3" key={index}>
            <a
              className=""
              href={`/news/read/${article.id}`}
              style={{
                textDecoration: "none",
                color: "black",
              }}
            >
              <div className="d-xl-flex align-items-center border-bottom border-danger">
                <img
                  className="img-fluid col-xl-5 col-sm-12 mb-3"
                  src="https://www.state.gov/wp-content/uploads/2022/01/shutterstock_248799484-scaled.jpg"
                  style={{ borderRadius: 16 }}
                />
                <div className="col-xl-7 col-sm-12">
                  <h3>{article.title}</h3>
                  <p>{article.shortDescription}</p>
                  <h5>Categories:</h5>
                  {article.categories.map((categ) => (
                    <a
                      href={`/news/category/${categ.nameOfCategory}`}
                      className="btn btn-outline-success btn-sm ms-2 my-2"
                      style={{
                        borderRadius: 10,
                        fontSize: 15,
                      }}
                    >
                      {FirstLetterUppercase(categ.nameOfCategory)}
                    </a>
                  ))}
                  <div className="d-flex justify-content-between mt-2">
                    <h6 className="d-flex justify-content-start ms-5">
                      Posted By:
                    </h6>
                    <h6 className="d-flex justify-content-end me-5">
                      Posted at: {article.}
                    </h6>
                  </div>
                </div>
              </div>
            </a>
          </div>
        ))}
    </div>
  );
}
