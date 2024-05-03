export default function LoaderTypewriter() {
  return (
    <div
      className="container-xl col-12 d-flex justify-content-center align-items-center"
      style={{ height: "55vh" }} // Adjust the height of the container
    >
      <div className="loader-container">
        <div className="coffee-header">
          <div className="coffee-header__buttons coffee-header__button-one"></div>
          <div className="coffee-header__buttons coffee-header__button-two"></div>
          <div className="coffee-header__display"></div>
          <div className="coffee-header__details"></div>
        </div>
        <div className="coffee-medium">
          <div className="coffe-medium__exit"></div>
          <div className="coffee-medium__arm"></div>
          <div className="coffee-medium__liquid"></div>
          <div className="coffee-medium__smoke coffee-medium__smoke-one"></div>
          <div className="coffee-medium__smoke coffee-medium__smoke-two"></div>
          <div className="coffee-medium__smoke coffee-medium__smoke-three"></div>
          <div className="coffee-medium__smoke coffee-medium__smoke-for"></div>
          <div className="coffee-medium__cup"></div>
        </div>
        <div className="coffee-footer"></div>
      </div>

      <div className="col-12" style={{ marginTop: "580px" }}>
        <h1>Your Article is Initializing...</h1>
        <h1 style={{ color: "red" }}>Don't Forget Your Coffee</h1>
      </div>
    </div>
  );
}
