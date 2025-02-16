import React from "react";
import "./leftside.css";
import userp from "../../store/images/userp.png"
import { AiOutlineLogout } from "react-icons/ai";
import { CiBellOn, CiBookmark, CiHome, CiSearch, CiUser } from "react-icons/ci";
import {  NavLink, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Avatar from "react-avatar";

import ProfileIconSkeleton from "../skeletons/ProfileIconSkeleton";
const LeftSideBar = () => {
  const { data ,isPending, isRefetching} = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();
  const nav=useNavigate()
  const { mutate } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_PROXY}/api/auth/logout`, {
          method: "GET",
          credentials:"include"
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Logout done");
      queryClient.invalidateQueries({ queryKey: ["authUser"] }); //refetch auth user
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });
  return (
    <div className="leftsidebar">
      <div>
        <div className="logo">
          <Avatar
          round={true}
            src={
              "https://pbs.twimg.com/profile_images/1683899100922511378/5lY42eHs_400x400.jpg"
            }
            size="50px"
          />
        </div>
        <div className="lefticons">
          <NavLink to="/" className="nav-link">
            <div className="icon">
              <CiHome size={25} />
              <p>Home</p>
            </div>
          </NavLink>
          <div className="icon">
            <CiSearch size={25} />
            <p>Search</p>
          </div>
          <NavLink to="/notifications" className="nav-link">
            <div className="icon">
              <CiBellOn size={25} />
              <p>Notifications</p>
            </div>
          </NavLink>
          <NavLink to={`/profile/${data.username}`} className="nav-link">
            <div className="icon">
              <CiUser size={25} />
              <p>Profile</p>
            </div>
          </NavLink>
          <div className="icon">
            <CiBookmark size={25} />
            <p>Bookmarks</p>
          </div>
          <div className="icon" onClick={() => {mutate()  
             nav("/login")}}>
            <AiOutlineLogout size={25} />
            <p>Logout</p>
          </div>
          {/* <div className="button">
            <button>Post</button>
          </div> */}
        </div>
      </div>{" "}
      <div className="parent-content">
        {(isPending || isRefetching) ? <ProfileIconSkeleton/>:<div className="onemorecontent">
          <NavLink to={`/profile/${data.username}`} className="nav-link">
            <div className="content">
              <Avatar
                size="40"
                src={data?.profileImg || userp}
                round={true}
              />
              <div className="username">
                <p>{data.fullName}</p>
                <p>@{data.username}</p>
              </div>
            </div>
          </NavLink>
          <AiOutlineLogout onClick={() => {mutate()
            nav("/login")

          }} size={22} />
        </div>}
        
      </div>
    </div>
  );
};

export default LeftSideBar;
