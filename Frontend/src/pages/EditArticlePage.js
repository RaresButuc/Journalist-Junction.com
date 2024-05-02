import axios from "axios";
import { useAuthHeader } from "react-auth-kit";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";

import ErrorPage from "./ErrorPage";
import Alert from "../components/Alert";
import closeIcon from "../photos/close.png";
import DefaultURL from "../usefull/DefaultURL";
import Modal from "../components/articleFormComponents/Modal";
import FirstLetterUppercase from "../usefull/FirstLetterUppercase";
import TitleInput from "../components/articleFormComponents/TitleInput";
import BodyTextInput from "../components/articleFormComponents/BodyTextInput";
import CountrySelect from "../components/accountFormComponents/CountrySelect";
import LanguageSelect from "../components/accountFormComponents/LanguageSelect";
import CategoriesSelect from "../components/articleFormComponents/CategoriesSelect";
import ArticlePhotosInput from "../components/articleFormComponents/ArticlePhotosInput";
import ThumbnailDescription from "../components/articleFormComponents/ThumbnailDescription";

export default function EditArticlePage() {
  const { id } = useParams();
  const token = useAuthHeader();

  const photosRef = useRef([]);

  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [alertInfos, setAlertInfos] = useState(["", "", ""]);

  const [currentArticle, setCurrentArticle] = useState(null);

  const [bodyContent, setBodyContent] = useState("");
  const [titleCurrent, setTitleCurrent] = useState("");
  const [contributors, setContributors] = useState([]);
  const [publishState, setPublishState] = useState({
    state: null,
    color: null,
  });
  const [categoriesCurrent, setCategoriesCurrent] = useState([]);
  const [rejectedContributors, setRejectedContributors] = useState([]);
  const [reloadPhotos, setReloadPhotos] = useState(false);

  const [selectDisabled, setSelectDisabled] = useState(false);
  const [publishButton, setPublishButton] = useState({
    value: null,
    color: null,
  });

  useEffect(() => {
    const getArticleById = async () => {
      try {
        const response = await axios.get(`${DefaultURL}/article/${id}`);
        const data = response.data;
        setCurrentArticle(data);
        setBodyContent(data.body);
        setTitleCurrent(data.title);
        setContributors(data.contributors);
        setCategoriesCurrent(data.categories);
        setRejectedContributors(data.rejectedWorkers);
        setSelectDisabled(data.categories.length === 3);
        setPublishState(
          data.published
            ? {
                isPublished: data.published,
                state: "Published",
                color: "success",
              }
            : {
                isPublished: data.published,
                state: "UnPublished",
                color: "danger",
              }
        );
        setPublishButton(
          data.published
            ? {
                value: "UnPublish",
                color: "danger",
              }
            : {
                value: "Publish",
                color: "success",
              }
        );
      } catch (err) {
        console.error("Request error:", err);
        navigate("/an-error-has-occured");
      }
    };

    getArticleById();
  }, [contributors.length, rejectedContributors.length, reloadPhotos]);

  useEffect(() => {
    setSelectDisabled(categoriesCurrent.length === 3);
  }, [categoriesCurrent]);

  const updateTitleLive = (e) => {
    setTitleCurrent(e.target.value);
  };

  const addCategoryLive = (e) => {
    if (categoriesCurrent.length < 3) {
      setCategoriesCurrent((prevCategories) => [...prevCategories, e.value]);
    }
  };

  const deleteCategoryLive = (e) => {
    setCategoriesCurrent(categoriesCurrent.filter((i) => i.id !== e.id));
    setSelectDisabled(categoriesCurrent.length === 3);
  };

  const deleteContributor = async (e) => {
    const headers = { Authorization: token() };

    try {
      await axios.put(
        `${DefaultURL}/article/${currentArticle.id}/${e.name}/delete`,
        {},
        { headers }
      );
      setContributors(contributors.filter((i) => i.id != e.id));

      setShowAlert(true);
      setAlertInfos([
        "Success!",
        `${e.name} Is No Longer A Contributor For This Article!`,
        "success",
      ]);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } catch (err) {
      setShowAlert(true);
      setAlertInfos(["Error Occured!", err.response.data.message, "danger"]);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  const deleteRejectedContributor = async (e) => {
    const headers = { Authorization: token() };

    try {
      const response = await axios.put(
        `${DefaultURL}/article/removerejection/${currentArticle.id}/${e.id}`,
        {},
        { headers }
      );
      setRejectedContributors(contributors.filter((i) => i.id != e.id));

      setShowAlert(true);
      setAlertInfos(["Success!", response.data, "success"]);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } catch (err) {
      setShowAlert(true);
      setAlertInfos(["Error Occured!", err.response.data.message, "danger"]);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  const handleBodyChange = (content) => {
    setBodyContent(content);
  };

  const formData = (form) => {
    return {
      title: form.get("titleInput"),
      thumbnailDescription: form.get("thumbnailDescription"),
      body: bodyContent,
      categories: categoriesCurrent,
      location: Number.isNaN(parseInt(form.get("countryInput"), 10))
        ? null
        : { id: parseInt(form.get("countryInput"), 10) },
      language: Number.isNaN(parseInt(form.get("languageInput"), 10))
        ? null
        : { id: parseInt(form.get("languageInput"), 10) },
    };
  };

  const formSubmit = async (e) => {
    e.preventDefault();

    const headers = { Authorization: token() };
    const articleData = formData(new FormData(e.target));
    const buttonTarget = e.nativeEvent.submitter.textContent;

    const photosToBeDeleted = currentArticle.photos.filter(
      (photo) =>
        !photosRef.current
          .map((refPhoto) => `${refPhoto.data.bucket}/${refPhoto.data.key}`)
          .includes(`${photo.bucket}/${photo.key}`)
    );

    const photosToBeAdded = photosRef.current
      .filter((e) => !e.posted)
      .map((e) => e.data);

    const filesDTOToBeAdded = photosRef.current
      .filter((e) => !e.posted)
      .map((e) => ({
        fileName: e.data.name,
        isThumbnail: e.isThumbnail,
      }));

    const photoChangeIsThumbnailStatus = photosRef.current
      .filter((e) => e.posted && e.data.thumbnail !== e.isThumbnail)
      .map((e) => ({
        id: e.data.id,
        newStatus: e.isThumbnail,
      }));

    const formDataNewPhotos = new FormData();

    photosToBeAdded.forEach((file) => {
      formDataNewPhotos.append("files", file);
    });

    filesDTOToBeAdded.forEach((file) => {
      formDataNewPhotos.append("fileDTOList", JSON.stringify(file));
    });

    try {
      if (buttonTarget === "Save") {
        const putRequests = [];

        const isCurrentThumbnailDeleted =
          photosToBeDeleted.filter((e) => e.thumbnail).length === 1;
        const isAnyNewThumbnailUploaded =
          filesDTOToBeAdded.filter((e) => e.isThumbnail).length === 1;

        const isCurrentThumbnailUnset =
          photoChangeIsThumbnailStatus.filter((e) => !e.newStatus).length === 1;
        const isAnyNewThumbnailSet =
          photoChangeIsThumbnailStatus.filter((e) => e.newStatus).length === 1;

        const editArticleInfo = await axios.put(
          `${DefaultURL}/article/${id}`,
          articleData,
          {
            headers,
          }
        );

        putRequests.push(editArticleInfo);

        // Looking For Errors in Photos Uploading
        if (publishState.isPublished) {
          if (
            isCurrentThumbnailDeleted &&
            !isAnyNewThumbnailUploaded &&
            photosToBeAdded.length
          ) {
            const dontDeleteThumbnailWithoutUploadingOne = await axios.get(
              `${DefaultURL}/article-photo/is-any-other-thumbnail-uploaded-or-chosen/${publishState.isPublished}/${isCurrentThumbnailDeleted}/${isAnyNewThumbnailUploaded}`,
              {
                headers,
              }
            );

            putRequests.push(dontDeleteThumbnailWithoutUploadingOne);
          }

          if (
            isCurrentThumbnailUnset &&
            !isAnyNewThumbnailUploaded &&
            photosToBeAdded.length
          ) {
            const dontUnsetAThumbnailWithoutChoosingOneFromTheNewPhotos =
              await axios.get(
                `${DefaultURL}/article-photo/dont-unset-a-thumbnail-without-choosing-one/${publishState.isPublished}/${isCurrentThumbnailUnset}/${isAnyNewThumbnailUploaded}`,
                {
                  headers,
                }
              );

            putRequests.push(
              dontUnsetAThumbnailWithoutChoosingOneFromTheNewPhotos
            );
          }

          if (
            isCurrentThumbnailDeleted &&
            !isAnyNewThumbnailSet &&
            !photoChangeIsThumbnailStatus.length
          ) {
            const dontDeleteThumbnailWithoutChoosingOneExistent =
              await axios.get(
                `${DefaultURL}/article-photo/is-any-other-thumbnail-uploaded-or-chosen/${publishState.isPublished}/${isCurrentThumbnailDeleted}/${isAnyNewThumbnailSet}`,
                {
                  headers,
                }
              );

            putRequests.push(dontDeleteThumbnailWithoutChoosingOneExistent);
          }

          if (
            isCurrentThumbnailUnset &&
            !isAnyNewThumbnailSet &&
            !isAnyNewThumbnailUploaded
          ) {
            const dontUnsetAThumbnailWithoutChoosingOneExistent =
              await axios.get(
                `${DefaultURL}/article-photo/dont-unset-a-thumbnail-without-choosing-one/${publishState.isPublished}/${isCurrentThumbnailUnset}/${isAnyNewThumbnailSet}`,
                {
                  headers,
                }
              );

            putRequests.push(dontUnsetAThumbnailWithoutChoosingOneExistent);
          }
        }

        // Other Commands
        if (photosToBeDeleted.length) {
          const deletePhotos = await axios.put(
            `${DefaultURL}/article/delete-article-photos/${id}`,
            photosToBeDeleted,
            {
              headers,
            }
          );

          putRequests.push(deletePhotos);
        }

        if (photoChangeIsThumbnailStatus.length) {
          const formDataChangeisThumbnailStatus = new FormData();
          photoChangeIsThumbnailStatus.forEach((file) => {
            formDataChangeisThumbnailStatus.append(
              "decisions",
              JSON.stringify(file)
            );
          });

          const changeIsThumbnailStatus = await axios.put(
            `${DefaultURL}/article-photo/change-status/${id}`,
            formDataChangeisThumbnailStatus,
            {
              headers,
            }
          );

          putRequests.push(changeIsThumbnailStatus);
        }

        if (photosToBeAdded.length) {
          const postPhotos = await axios.put(
            `${DefaultURL}/article/upload-article-photos/${id}`,
            formDataNewPhotos,
            {
              headers,
              "Content-Type": "multipart/form-data",
            }
          );
          putRequests.push(postPhotos);
        }

        Promise.all(putRequests).then(() => {
          setReloadPhotos(!reloadPhotos);

          setShowAlert(true);
          setAlertInfos([
            "Success!",
            "Modifications Successfully Saved!",
            "success",
          ]);
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        });

        window.scrollTo(0, 0);
      } else if (buttonTarget === "Publish") {
        const putRequests = [];

        if (photosToBeDeleted.length) {
          const deletePhotos = await axios.put(
            `${DefaultURL}/article/delete-article-photos/${id}`,
            photosToBeDeleted,
            {
              headers,
            }
          );

          putRequests.push(deletePhotos);
        }

        if (photosToBeAdded.length) {
          const postPhotos = await axios.put(
            `${DefaultURL}/article/upload-article-photos/${id}`,
            formDataNewPhotos,
            {
              headers,
              "Content-Type": "multipart/form-data",
            }
          );
          putRequests.push(postPhotos);
        }
        if (photoChangeIsThumbnailStatus.length) {
          const formDataChangeisThumbnailStatus = new FormData();
          photoChangeIsThumbnailStatus.forEach((file) => {
            formDataChangeisThumbnailStatus.append(
              "decisions",
              JSON.stringify(file)
            );
          });

          const changeIsThumbnailStatus = await axios.put(
            `${DefaultURL}/article-photo/change-status/${id}`,
            formDataChangeisThumbnailStatus,
            {
              headers,
            }
          );

          putRequests.push(changeIsThumbnailStatus);
        }

        const editArticleInfo = await axios.put(
          `${DefaultURL}/article/${id}`,
          articleData,
          {
            headers,
          }
        );
        putRequests.push(editArticleInfo);

        const response = await axios.put(
          `${DefaultURL}/article/${id}/true`,
          editArticleInfo.data,
          { headers }
        );
        putRequests.push(response);

        Promise.all(putRequests).then(() => {
          setPublishState({
            state: "Published",
            color: "success",
          });

          setPublishButton({
            value: "UnPublish",
            color: "danger",
          });

          setShowAlert(true);
          setAlertInfos(["Success!", response.data, "success"]);

          window.scrollTo(0, 0);

          setTimeout(() => {
            navigate(`/read-article/${id}`);
          }, 3000);
        });
      } else if (buttonTarget === "UnPublish") {
        const putRequests = [];

        const editArticleInfo = await axios.put(
          `${DefaultURL}/article/${id}`,
          articleData,
          {
            headers,
          }
        );
        putRequests.push(editArticleInfo);

        const response = await axios.put(
          `${DefaultURL}/article/${id}/false`,
          {},
          { headers }
        );
        putRequests.push(response);

        Promise.all(putRequests).then(() => {
          setPublishState({
            state: "UnPublished",
            color: "danger",
          });

          setPublishButton({
            value: "Publish",
            color: "success",
          });

          setShowAlert(true);
          setAlertInfos(["Success!", response.data, "success"]);

          window.scrollTo(0, 0);

          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        });
      }
    } catch (err) {
      console.log(err);
      setShowAlert(true);
      setReloadPhotos(!reloadPhotos);
      setAlertInfos(["Error Occured!", err.response.data.message, "danger"]);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
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
          <form
            className="container-xl col-xl-6 col-md-12"
            onSubmit={formSubmit}
          >
            <div className="row d-flex justify-content-center align-items-center">
              <div className="col-md-8 col-lg-6 col-xl-10">
                <div className="border border-danger">
                  <div className="card-body p-4 text-center text-break bg-white bg-opacity-50">
                    <h1 className="mb-4">
                      Edit Article <br />"{titleCurrent}"
                    </h1>
                    <div className="row">
                      <h5 className="col-6">
                        <u>
                          <b>Publish State:</b>
                        </u>
                        <br />
                        <b className={`text-${publishState.color}`}>
                          {publishState.state}
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
                      <h2 className="mb-3">Categories *</h2>
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
                      <h2 className="mb-3">Location *</h2>
                      <CountrySelect
                        article={currentArticle}
                        id={"floatingLocationSelectValue"}
                      />
                    </div>

                    <div className="form-outline mt-5 mb-5 container-xl">
                      <h2 className="mb-3">Language *</h2>
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
                                <Modal
                                  id={`modalDeleteContributor${e.id}`}
                                  title="Important!"
                                  message={`Are you sure you want to delete ${e.name} from your list of contributors?`}
                                  onAccept={() => deleteContributor(e)}
                                />
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
                                <Modal
                                  id={`modalDeleteRejection${e.id}`}
                                  title="Important!"
                                  message={`Are you sure you want to remove the rejection status of the user ${e.name} and give it the possibility to contribute to this article in the future?`}
                                  onAccept={() => deleteRejectedContributor(e)}
                                />
                              </>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    <hr />
                    <div>
                      <button
                        className="btn btn-primary btn-lg col-4 m-3"
                        type="submit"
                      >
                        Save
                      </button>
                      <button
                        className={`btn btn-${publishButton.color} btn-lg col-xl-4 m-3`}
                        type="submit"
                      >
                        {publishButton.value}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>

          <div className="col-xl-6 col-md-12">
            <h2 className="mb-3">Body *</h2>
            <BodyTextInput
              article={currentArticle}
              id={"floatingBodyTextValue"}
              onChange={handleBodyChange}
            />
            <h2 className="mt-5 mb-3">Photos *</h2>
            <ArticlePhotosInput
              article={currentArticle}
              reload={reloadPhotos}
              ref={photosRef}
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
