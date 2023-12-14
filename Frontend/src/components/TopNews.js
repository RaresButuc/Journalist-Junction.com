import FirstLetterUppercase from "../usefull/FirstLetterUppercase";

export default function TopNews() {
  const testObject = {
    id: 1,
    title: "Titlu de Articol",
    short:
      "The decision to freeze the case came as former President Trump’s lawyers asked a court to move slowly in reviewing his claims of presidential immunity.",
    categories: ["politics", "lifestyle", "gastronomy", "sport"],
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
            style={{ borderRadius: 16, marginLeft: "10px" }}
          />
          <div className="col-xl-6 col-sm-12">
            <h3>{testObject.title}</h3>
            <p>{testObject.short}</p>
          </div>
        </div>
      </a>

      {testObject.categories.map((categ) => (
        <button
          className="btn btn-outline-success m-2"
          style={{
            borderRadius: 10,
          }}
          href={`/news/category/${categ}`}
        >
          <h5>{FirstLetterUppercase(categ)}</h5>
        </button>
      ))}
    </div>
  );
}
