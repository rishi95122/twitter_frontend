import React from "react";
import Avatar from "react-avatar";
import "./rightside.css";
import userp from "../../store/images/userp.png";
import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useFollow from "../hooks/useFollow";
import ProfileIconSkeleton from "../skeletons/ProfileIconSkeleton";
const RightSideBar = () => {
  const { follow, isPending } = useFollow();

  const { data: suggestedUsers, isPending:isGetting,isRefetching } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_PROXY}/api/users/suggested`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }
        console.log(data);
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });
  console.log("SUGGESTED", suggestedUsers);
  return (
    <div className="rightsidebar">
      <div className="follow">
        <h3>Who to follow</h3>
        {(isGetting || isRefetching) && <div><ProfileIconSkeleton/><ProfileIconSkeleton/> <ProfileIconSkeleton/></div>}
        { (!isGetting && !isRefetching) &&suggestedUsers?.map((item) => {
          return (
            <div className="parent-content">
              <div className="content">
                <Avatar
                  size="40"
                  src={item?.profileImg || userp}
                  round={true}
                />
                <div className="username">
                  <p>{item.fullName}</p>
                  <p>@{item.username}</p>
                </div>
              </div>

              <button onClick={() => follow(item._id)}>
                {isPending ? "Loading" : "Follow"}
              </button>
            </div>
          );
        })}
      </div>
      <Outlet />
    </div>
  );
};

export default RightSideBar;
