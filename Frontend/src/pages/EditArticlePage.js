import axios from "axios";
import ErrorPage from "./ErrorPage";
import closeIcon from "../photos/close.png";
import { useState, useEffect } from "react";
import DefaultURL from "../usefull/DefaultURL";
import { useNavigate, useParams } from "react-router";
import FirstLetterUppercase from "../usefull/FirstLetterUppercase";

import Alert from "../components/Alert";
import TitleInput from "../components/articleFormComponents/TitleInput";
import BodyTextInput from "../components/articleFormComponents/BodyTextInput";
import CountrySelect from "../components/accountFormComponents/CountrySelect";
import CategoriesSelect from "../components/articleFormComponents/CategoriesSelect";
import ThumbnailDescription from "../components/articleFormComponents/ThumbnailDescription";

export default function EditArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [titleCurrent, setTitleCurrent] = useState("");
  const [currentArticle, setCurrentArticle] = useState(null);
  const [alertInfos, setAlertInfos] = useState(["", "", ""]);
  const [selectDisabled, setSelectDisabled] = useState(false);
  const [categoriesCurrent, setCategoriesCurrent] = useState([]);
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    const getArticleById = async () => {
      const response = await axios.get(`${DefaultURL}/article/${id}`);
      const data = response.data;
      setCurrentArticle(data);
      setTitleCurrent(data.title);
      setCategoriesCurrent(data.categories);
      setSelectDisabled(data.categories.length === 3);
      setContributors(data.contributors);
    };

    getArticleById();
  }, []);

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
    onSubmitEdit(editData);
  };

  const onSubmitEdit = async (values) => {
    try {
      if (values.country !== "") {
        const response = await axios.post(
          `${DefaultURL}/user/register`,
          values
        );

        if (response.data !== "") {
          setTimeout(() => {
            navigate("/login");
          }, 2000);
          setShowAlert(true);
          setAlertInfos([
            "Congratulations!",
            "You have been Succesfully Registered!",
            "success",
          ]);
        } else {
          setShowAlert(true);
          setAlertInfos([
            "Be Careful",
            "Email or UserName Already Registered!",
            "danger",
          ]);
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        }
      } else {
        setShowAlert(true);
        setAlertInfos([
          "Be Careful",
          "The Residence Country Must Be Specified!",
          "danger",
        ]);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      }
    } catch (err) {
      console.log(err);
    }
  };

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
                  <div
                    className="card-body p-4 text-center"
                    style={{
                      backgroundColor: "rgba(255, 255, 255,0.5)",
                      wordWrap: "break-word",
                    }}
                  >
                    <h1 className="mb-4">
                      Edit Article <br></br>"{titleCurrent}"
                    </h1>
                    <div>
                      <h4>
                        <u>
                          <b>Started By:</b>
                        </u>{" "}
                        <a
                          href={`/profile/${currentArticle?.owner.id}`}
                          style={{ textDecoration: "none", color: "green" }}
                        >
                          <b>{currentArticle?.owner.name}</b>
                        </a>
                      </h4>
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
                            className="border border-success border-3 rounded-pill ms-3 mb-2"
                            style={{ display: "inline-block" }}
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
                        id={"floatingThumbnailDescriptionValue"}
                      />
                    </div>

                    <div className="form-outline mb-4 container-xl">
                      <h2 className="mb-3">Contributors</h2>
                      <div className="mb-3">
                        {contributors.map((e) => (
                          <div
                            className="border border-warning border-3 rounded-pill ms-3 mb-2"
                            style={{ display: "inline-block" }}
                            key={e.id}
                          >
                            <a
                              className="d-inline me-2 ms-2 h5"
                              style={{ textDecoration: "none" }}
                              href={`/profile/${e.id}`}
                            >
                              {e.name}
                            </a>
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
                      <div className="form-floating">
                        <input
                          // ref={ref}
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
                    <button
                      className="btn btn-primary btn-lg btn-block col-3 m-3"
                      type="submit"
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-success btn-lg btn-block col-3 m-3"
                      type="submit"
                    >
                      Publish
                    </button>
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
