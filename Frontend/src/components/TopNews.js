import FirstLetterUppercase from "../usefull/FirstLetterUppercase";

export default function TopNews() {
  const testObject = {
    id: 1,
    title: "Titlu de Articol",
    short:
      "The decision to freeze the case came as former President Trump’s lawyers asked a court to move slowly in reviewing his claims of presidential immunity.",
    categories: ["politics", "lifestyle", "gastronomy"],
    location: "International",
    language: "Romanian",
    ownerName: "Rares",
    views: 100.0,
  };

  return (
    <div className="container-xl col-sm-12 border-bottom border-danger">
      <a
        href={`/news/read/${testObject.id}`}
        style={{
          textDecoration: "none",
          color: "black",
        }}
      >
        <div className="d-xl-flex align-items-center">
          <img
            className="img-fluid col-xl-6 col-sm-12 mb-3"
            src="https://www.state.gov/wp-content/uploads/2022/01/shutterstock_248799484-scaled.jpg"
            style={{ borderRadius: 16, marginRight: "5px" }}
          />
          <div className="col-xl-6 col-sm-12">
            <h3>{testObject.title}</h3>
            <p>{testObject.short}</p>
            <h5>Categories:</h5>
            {testObject.categories.map((categ) => (
              <a
                type="button"
                className="btn btn-outline-success btn-sm ms-2 my-3"
                data-mdb-ripple-init
                data-mdb-ripple-color="dark"
                style={{
                  borderRadius: 10,
                }}
                href={`/news/category/${categ}`}
                disabled
              >
                <h5>{FirstLetterUppercase(categ)}</h5>
              </a>
            ))}
            <h7 className="d-flex justify-content-end mb-3">Posted at:</h7>
          </div>
        </div>
      </a>
    </div>
  );
}
