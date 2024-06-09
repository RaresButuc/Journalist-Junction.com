import { forwardRef } from "react";
import FirstLetterUppercase from "../../usefull/FirstLetterUppercase";

import facebook from "../../photos/socialMediaIcons/FacebookIcon.png";
import instagram from "../../photos/socialMediaIcons/InstagramIcon.png";
import x from "../../photos/socialMediaIcons/TwitterIcon.png";

function SocialMediaInput({ user, id, platform }, ref) {
  const choosePhoto = () => {
    if (platform === "facebook") {
      return facebook;
    } else if (platform === "instagram") {
      return instagram;
    } else if (platform === "x") {
      return x;
    } else {
      return null;
    }
  };

  return (
    <div className="mt-4 d-flex align-items-center">
      <img
        src={choosePhoto()}
        alt={`${platform} logo`}
        style={{ width: 45, marginRight: "10px" }}
      />
      <div className="form-floating my-1 flex-grow-1">
        <input
          id={id}
          ref={ref}
          type="text"
          name={platform}
          className="form-control"
          defaultValue={user?.socialMedia?.[platform]}
          placeholder={FirstLetterUppercase(platform)}
        />
        <label htmlFor={id}>{FirstLetterUppercase(platform)}</label>
      </div>
    </div>
  );
}

export default forwardRef(SocialMediaInput);
