import { useState } from "react";

import CommentBox from "./CommentBox";

export default function FullCommentComponent({ comment, reloadComments }) {
  const [showReplies, setShowReplies] = useState(false);

  const replyPost = () => {
    reloadComments((prev) => !prev);
    setShowReplies(showReplies);
  };

  return (
    <>
      <div key={comment?.id}>
        <CommentBox
          comment={comment}
          setShowAllReplies={setShowReplies}
          reloadComments={reloadComments}
          isMainComm={true}
          replyPost={replyPost}
          showRepliesButton={comment?.mainChildren?.length > 0}
        />
      </div>

      <div className="d-flex flex-column">
        {showReplies ? (
          <>
            {comment?.mainChildren?.length
              ? comment?.mainChildren
                  .sort((a, b) => {
                    return (
                      new Date(a.postTime).getTime() -
                      new Date(b.postTime).getTime()
                    );
                  })
                  .map((e, index) => (
                    <div key={index}>
                      <CommentBox
                        comment={e}
                        showRepliesButton={false}
                        mainCommId={comment?.id}
                        reloadComments={reloadComments}
                        replyPost={replyPost}
                      />
                    </div>
                  ))
              : null}
          </>
        ) : null}
      </div>
    </>
  );
}
