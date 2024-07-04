import React from 'react'
import Skeleton from "@mui/material/Skeleton";
import "./profileicon.css"
const ProfileIconSkeleton = () => {
  return (
    <div>
         <div className="parent-content">
              <div className="content">
              <Skeleton
          sx={{ bgcolor: "grey.900" }}
          variant="circular"
          width={40}
          height={40}
        />
                <div className="username">
                <Skeleton
              sx={{ bgcolor: "grey.900",fontSize: "1rem" }}
              variant="text"
              width="70px"
            ></Skeleton>
                     <Skeleton
              sx={{ bgcolor: "grey.900",fontSize: "1rem" }}
              variant="text"
              width="70px"
            ></Skeleton>
                </div>
              </div>

            </div>
    </div>
  )
}

export default ProfileIconSkeleton