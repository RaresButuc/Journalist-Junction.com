import axios from "axios";
import ErrorPage from "./ErrorPage";
import closeIcon from "../photos/close.png";
import { useState, useEffect } from "react";
import DefaultURL from "../usefull/DefaultURL";
import { useAuthHeader } from "react-auth-kit";
import { useNavigate, useParams } from "react-router";
import FirstLetterUppercase from "../usefull/FirstLetterUppercase";

import Alert from "../components/Alert";
import TitleInput from "../components/articleFormComponents/TitleInput";
import BodyTextInput from "../components/articleFormComponents/BodyTextInput";
import CountrySelect from "../components/accountFormComponents/CountrySelect";
import LanguageSelect from "../components/accountFormComponents/LanguageSelect";
import CategoriesSelect from "../components/articleFormComponents/CategoriesSelect";
import ThumbnailDescription from "../components/articleFormComponents/ThumbnailDescription";

export default function EditArticlePage() {
  const { id } = useParams();
  const token = useAuthHeader();
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [titleCurrent, setTitleCurrent] = useState("");
  const [contributors, setContributors] = useState([]);
  const [publishState, setPublishState] = useState(["", ""]);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [alertInfos, setAlertInfos] = useState(["", "", ""]);
  const [selectDisabled, setSelectDisabled] = useState(false);
  const [categoriesCurrent, setCategoriesCurrent] = useState([]);
  const [rejectedContributors, setRejectedContributors] = useState([]);

  useEffect(() => {
    const getArticleById = async () => {
      const response = await axios.get(`${DefaultURL}/article/${id}`);
      const data = response.data;
      setCurrentArticle(data);
      setTitleCurrent(data.title);
      setCategoriesCurrent(data.categories);
      setSelectDisabled(data.categories.length === 3);
      setContributors(data.contributors);
      setRejectedContributors(data.rejectedWorkers);
      setPublishState(
        data.published ? ["Published", "success"] : ["UnPublished", "danger"]
      );
    };

    getArticleById();
  }, [contributors, rejectedContributors]);

  useEffect(() => {
    setSelectDisabled(categoriesCurrent.length === 3);
  }, [categoriesCurrent]);

  const updateTitleLive = (e) => {
    setTitleCurrent(e.target.value);
  };

  const deleteCategoryLive = (e) => {
    setCategoriesCurrent(categoriesCurrent.filter((i) => i.id != e.id));
    setSelectDisabled(categoriesCurrent.length === 3);
  };

  const addCategoryLive = (e) => {
    if (categoriesCurrent.length < 3) {
      setCategoriesCurrent((prevCategories) => [...prevCategories, e.value]);
    }
  };

  const deleteContributor = (e) => {
    const headers = { Authorization: token() };

    axios.put(
      `${DefaultURL}/article/${currentArticle.id}/${e.name}/delete`,
      {},
      { headers }
    );
    setContributors(contributors.filter((i) => i.id != e.id));
  };

  const deleteRejectedContributor = (e) => {
    const headers = { Authorization: token() };

    axios.put(
      `${DefaultURL}/article/removerejection/${currentArticle.id}/${e.id}`,
      {},
      { headers }
    );
    setRejectedContributors(contributors.filter((i) => i.id != e.id));
  };

  const onSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const editData = {
      title: formData.get("titleInput"),
      thumbnailDescription: formData.get("thumbnailDescription"),
      body: formData.get("bodyText"),
      categories: formData.get(categoriesCurrent),
      location: formData.get("countryInput"),
      language: formData.get("shortAutoDescriptionInput"),
    };
    // onSubmitEdit(editData);
  };

  // const onSubmitEdit = async (values) => {
  //   try {
  //     if (values.country !== "") {
  //       const response = await axios.post(
  //         `${DefaultURL}/user/register`,
  //         values
  //       );

  //       if (response.data !== "") {
  //         setTimeout(() => {
  //           navigate("/login");
  //         }, 2000);
  //         setShowAlert(true);
  //         setAlertInfos([
  //           "Congratulations!",
  //           "You have been Succesfully Registered!",
  //           "success",
  //         ]);
  //       } else {
  //         setShowAlert(true);
  //         setAlertInfos([
  //           "Be Careful",
  //           "Email or UserName Already Registered!",
  //           "danger",
  //         ]);
  //         setTimeout(() => {
  //           setShowAlert(false);
  //         }, 3000);
  //       }
  //     } else {
  //       setShowAlert(true);
  //       setAlertInfos([
  //         "Be Careful",
  //         "The Residence Country Must Be Specified!",
  //         "danger",
  //       ]);
  //       setTimeout(() => {
  //         setShowAlert(false);
  //       }, 3000);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  return (
    <div className="container-xl mt-3">
      {showAlert && (
        <Alert
          type={alertInfos[0]}
          message={alertInfos[1]}
          color={alertInfos[2]}
        />
      )}

      {currentArticle ? (
        <div className="row">
          <form onSubmit={onSave} className="container-xl col-xl-6 col-md-12">
            <div className="row d-flex justify-content-center align-items-center">
              <div className="col-md-8 col-lg-6 col-xl-10">
                <div className="border border-danger">
                  <div className="card-body p-4 text-center text-break bg-white bg-opacity-50">
                    <h1 className="mb-4">
                      Edit Article <br></br>"{titleCurrent}"
                    </h1>
                    <div className="row">
                      <h5 className="col-6">
                        <u>
                          <b>Publish State: </b>
                        </u>
                        <b className={`text-${publishState[1]}`}>
                          {publishState[0]}
                        </b>
                      </h5>

                      <h5 className="col-6">
                        <u>
                          <b>Started By: </b>
                        </u>
                        <br />
                        <a
                          href={`/profile/${currentArticle?.owner.id}`}
                          className="text-decoration-none text-success"
                        >
                          <b>{currentArticle?.owner.name}</b>
                        </a>
                      </h5>
                    </div>

                    <hr style={{ color: "#dc3545" }} />

                    <div className="form-outline mb-4">
                      <TitleInput
                        article={currentArticle}
                        id={"floatingNameValue"}
                        updateTitleLive={updateTitleLive}
                      />
                    </div>

                    <div className="form-outline mb-5">
                      <ThumbnailDescription
                        article={currentArticle}
                        id={"floatingThumbnailDescriptionValue"}
                      />
                    </div>

                    <div className="form-outline mb-4">
                      <h2 className="mb-3">Categories</h2>
                      <div className="mb-3">
                        {categoriesCurrent.map((e) => (
                          <div
                            className="border border-success border-3 rounded-pill ms-3 mb-2 d-inline-block"
                            key={e.id}
                          >
                            <h5 className="d-inline me-2 ms-2">
                              {FirstLetterUppercase(e.nameOfCategory)}
                            </h5>
                            <input
                              className="d-inline mt-1 me-2"
                              type="image"
                              src={closeIcon}
                              style={{ width: "22px" }}
                              onClick={() => deleteCategoryLive(e)}
                            />
                          </div>
                        ))}
                      </div>
                      <CategoriesSelect
                        id={"floatingCategoriesSelectValue"}
                        action={addCategoryLive}
                        disabled={selectDisabled}
                        currentChosenCategs={categoriesCurrent}
                      />
                    </div>

                    <div className="form-outline mt-5 mb-5 container-xl">
                      <h2 className="mb-3">Location</h2>
                      <CountrySelect
                        article={currentArticle}
                        id={"floatingLocationSelectValue"}
                      />
                    </div>

                    <div className="form-outline mt-5 mb-5 container-xl">
                      <h2 className="mb-3">Language</h2>
                      <LanguageSelect
                        article={currentArticle}
                        id={"floatingLanguageSelectValue"}
                      />
                    </div>

                    <div className="form-outline mb-5 container-xl">
                      <h2 className="mb-3">Contributors</h2>
                      <div className="mb-3">
                        {contributors.length === 0 ? (
                          <h5 className="text-warning">
                            No Contributors Added!
                          </h5>
                        ) : (
                          contributors.map((e) => (
                            <div
                              className="border border-warning border-3 rounded-pill ms-3 mb-2 d-inline-block"
                              key={e.id}
                            >
                              <a
                                className="d-inline me-2 ms-2 h5 text-decoration-none"
                                href={`/profile/${e.id}`}
                              >
                                {e.name}
                              </a>
                              <input
                                className="d-inline mt-1 me-2"
                                type="image"
                                src={closeIcon}
                                style={{ width: "22px" }}
                                data-bs-toggle="modal"
                                data-bs-target={`#modalDeleteContributor${e.id}`}
                              />
                              <>
                                <div
                                  className="modal fade"
                                  id={`modalDeleteContributor${e.id}`}
                                  tabIndex="-1"
                                  aria-labelledby={`modalLabel${e.id}`}
                                  aria-hidden="true"
                                >
                                  <div className="modal-dialog">
                                    <div className="modal-content">
                                      <div className="modal-header">
                                        <h5
                                          className="modal-title"
                                          id={`modalLabel${e.id}`}
                                        >
                                          Important!
                                        </h5>
                                        <button
                                          type="button"
                                          className="btn-close"
                                          data-bs-dismiss="modal"
                                          aria-label="Close"
                                        ></button>
                                      </div>
                                      <div className="modal-body">
                                        {`Are you sure you want to delete `}
                                        <b className="text-danger">{e.name}</b>
                                        {` from your list of contributors?`}
                                      </div>
                                      <div className="modal-footer d-flex justify-content-center">
                                        <button
                                          type="button"
                                          className="btn btn-secondary"
                                          data-bs-dismiss="modal"
                                        >
                                          Close
                                        </button>
                                        <button
                                          className="btn btn-success"
                                          onClick={() => deleteContributor(e)}
                                          data-bs-dismiss="modal"
                                        >
                                          Accept
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="form-floating">
                        <input
                          className="form-control"
                          type="contributors"
                          name="contributorsInput"
                          id={id}
                          placeholder="Search for Contributors.."
                          // onChange={updateTitleLive}
                        />
                        <label htmlFor={id}>Search for Contributors..</label>
                      </div>
                    </div>

                    <div className="form-outline mb-5 container-xl">
                      <h2 className="mb-3">Rejected Contributors</h2>
                      <div className="mb-3">
                        {rejectedContributors.length === 0 ? (
                          <h5 className="text-danger">
                            No Rejected Contributors
                          </h5>
                        ) : (
                          rejectedContributors.map((e) => (
                            <div
                              className="border border-danger border-3 rounded-pill ms-3 mb-2 d-inline-block"
                              key={e.id}
                            >
                              <a
                                className="d-inline me-2 ms-2 h5 text-decoration-none"
                                href={`/profile/${e.id}`}
                              >
                                {e.name}
                              </a>
                              <input
                                className="d-inline mt-1 me-2"
                                type="image"
                                src={closeIcon}
                                style={{ width: "22px" }}
                                data-bs-toggle="modal"
                                data-bs-target={`#modalDeleteRejection${e.id}`}
                              />
                              <>
                                <div
                                  className="modal fade"
                                  id={`modalDeleteRejection${e.id}`}
                                  tabIndex="-1"
                                  aria-labelledby={`modalLabel${e.id}`}
                                  aria-hidden="true"
                                >
                                  <div className="modal-dialog">
                                    <div className="modal-content">
                                      <div className="modal-header">
                                        <h5
                                          className="modal-title"
                                          id={`modalLabel${e.id}`}
                                        >
                                          Important!
                                        </h5>
                                        <button
                                          type="button"
                                          className="btn-close"
                                          data-bs-dismiss="modal"
                                          aria-label="Close"
                                        ></button>
                                      </div>
                                      <div className="modal-body">
                                        {`Are you sure you want to remove the rejection status of the user `}
                                        <b className="text-danger">{e.name}</b>
                                        {` and give it the possibility to contribute to this article in the future?`}
                                      </div>
                                      <div className="modal-footer d-flex justify-content-center">
                                        <button
                                          type="button"
                                          className="btn btn-secondary"
                                          data-bs-dismiss="modal"
                                        >
                                          Close
                                        </button>
                                        <button
                                          className="btn btn-success"
                                          onClick={() =>
                                            deleteRejectedContributor(e)
                                          }
                                          data-bs-dismiss="modal"
                                        >
                                          Accept
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    <hr />
                    <div>
                      <button
                        className="btn btn-primary btn-lg btn-block col-3 m-3"
                        type="submit"
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-success btn-lg btn-block col-xl-3 m-3"
                        type="submit"
                      >
                        Publish
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>

          <div className="col-xl-6 col-md-12">
            <BodyTextInput
              article={currentArticle}
              id={"floatingBodyTextValue"}
            />
          </div>
        </div>
      ) : (
        <ErrorPage
          message={"Your Article is Loading.."}
          message2={
            "If it takes too long, press here to be redirected to the Main Page!"
          }
        />
      )}
    </div>
  );
}
