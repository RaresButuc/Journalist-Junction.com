export default function LoaderTypewriter() {
  return (
    <div
      className="container-xl col-12 d-flex justify-content-center align-items-center"
      style={{ height: "55vh" }} // Adjust the height of the container
    >
      <div className="loader-container">
        <div class="coffee-header">
          <div class="coffee-header__buttons coffee-header__button-one"></div>
          <div class="coffee-header__buttons coffee-header__button-two"></div>
          <div class="coffee-header__display"></div>
          <div class="coffee-header__details"></div>
        </div>
        <div class="coffee-medium">
          <div class="coffe-medium__exit"></div>
          <div class="coffee-medium__arm"></div>
          <div class="coffee-medium__liquid"></div>
          <div class="coffee-medium__smoke coffee-medium__smoke-one"></div>
          <div class="coffee-medium__smoke coffee-medium__smoke-two"></div>
          <div class="coffee-medium__smoke coffee-medium__smoke-three"></div>
          <div class="coffee-medium__smoke coffee-medium__smoke-for"></div>
          <div class="coffee-medium__cup"></div>
        </div>
        <div class="coffee-footer"></div>
      </div>

      <div className="col-12" style={{ marginTop: "580px" }}>
        <h1>Your Article is Initializing...</h1>
        <h1 style={{ color: "red" }}>Don't Forget Your Coffee</h1>
      </div>
    </div>
  );
}
