import React from "react";
import Skeleton from "@mui/material/Skeleton";
import "./postskeleton.css";
const PostsSkeleton = () => {
  return (
    <div className="post">
      <div>
        <Skeleton
          sx={{ bgcolor: "grey.900" }}
          variant="circular"
          width={40}
          height={40}
        />
      </div>

      <div className="content">
        <div className="inner-content">
          <div className="username">
            <Skeleton
              sx={{ bgcolor: "grey.900",fontSize: "1rem" }}
              variant="text"
              width="100%"
            ></Skeleton>
          </div>
        </div>
        <Skeleton
          sx={{ bgcolor: "grey.900" }}
          variant="rectangular"
          width="100%"
          height={120}
        />
      </div>
    </div>
  );
};

export default PostsSkeleton;
