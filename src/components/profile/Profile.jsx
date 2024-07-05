import React, { useRef, useState } from "react";
import "./profile.css";
import { IoMdArrowRoundBack } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import {  useNavigate, useParams } from "react-router-dom";
import { FaLink } from "react-icons/fa";
import userp from "../../store/images/userp.png"
import { CiCalendar } from "react-icons/ci";
import AllTweets from "../feed/AllTweets";
import UpdateForm from "./UpdateForm/UpdateForm";
import {  useQuery } from "@tanstack/react-query";
import { formatMemberSinceDate } from "../../functions";
import useFollow from "../hooks/useFollow";

import useUpdateUserProfile from "../hooks/useUpdateUserProfile";
import TwitterProfileSkeleton from "../skeletons/TwitterProfileSkeleton";
const Profile = () => {
  const [coverImg, setCoverImg] = useState();
  const navigate = useNavigate();

  const [click, setClick] = useState(false);
  const [profileImg, setProfileImg] = useState();
  const [feedType,setFeedType]=useState("posts")
  const imgRef = useRef();
  const profileRef = useRef();
  const { follow, isPending } = useFollow();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const { data: posts,isPending:isPostLoading } = useQuery({ queryKey: ["posts"] });
  let { username } = useParams();
username =username.toLowerCase()

  const {
    data: user,
    isLoading,
 
    isRefetching,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_PROXY}/api/users/profile/${username}`
        ,{
          method:"GET",
        credentials:"include"        });
        const data = await res.json();
        console.log("userprofile")
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    }
  });
  const isMyProfile = authUser?._id === user?._id;
	const amIFollowing = authUser?.following.includes(user?._id);
  const { isUpdatingProfile, updateProfile } = useUpdateUserProfile();


  function handleCoverChange(e) {
    const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setCoverImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
  }
  function handleProfileChange(e) {
    const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setProfileImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
  }

  return (
    <div className="profile">
      <div className="back-bar">
        <IoMdArrowRoundBack size={22} onClick={()=>navigate(-1)} />
        <span>
          <p>{user?.fullName}</p>
          <p>{!isPostLoading ?posts.length: "please wait.."} posts</p>
        </span>
      </div>
      {(isLoading || isRefetching) && <TwitterProfileSkeleton />}
      {!isLoading && !isRefetching && !user && <p className='warning'>User not found</p>}
      {!isLoading && !isRefetching && user && <div>
      
       <div className="parent-details">
        <div className="cover">
          <img alt="" src={coverImg || user?.coverImg } />
          {authUser?._id===user?._id &&<CiEdit
            id="edit-btn"
            size={22}
            onClick={() => imgRef.current.click()}
          />}
          <input type="file" hidden ref={imgRef} onChange={handleCoverChange} />
        </div>
        {click && <UpdateForm setClick={setClick} authUser={authUser}/>}
        <div className="profile-img">
          <div className="img">
            <img alt="" src={user?.profileImg||userp} />
            {authUser?._id===user?._id &&<CiEdit
              id="profile-btn"
              size={22}
              onClick={() => profileRef.current.click()}
            />}
            <input
              type="file"
              hidden
              ref={profileRef}
              onChange={handleProfileChange}
            />
          </div>

          <span></span>
          { !isLoading && !isRefetching &&  <div>

          
{isMyProfile &&   <button onClick={() => setClick(!click)}>Edit profile</button>}
{!isMyProfile && <button onClick={()=>follow(user?._id)}>
          {isPending && "Loading..."}
          {!isPending && amIFollowing && "Unfollow"}
          {!isPending && !amIFollowing && "Follow"}</button>}
          {(coverImg || profileImg) && (
        <button
          className='btn btn-primary rounded-full btn-sm text-white px-4 ml-2'
          onClick={ async() => {
             await updateProfile({ coverImg, profileImg });
            setProfileImg(null);
            setCoverImg(null);
          }}
        >
          {isUpdatingProfile ? "Updating..." : "Update"}
        </button>
      )}
</div>}
         
        </div>
        <div className="user-details">
          <div className="username">
            <h2>{user?.fullName}</h2>
            <p>@{user?.username}</p>
            <p>{user?.bio}</p>
          </div>
          <span>
            {user?.link &&<div><FaLink size={20} />
            <a href={user?.link}>{user?.link}</a></div>}
            <CiCalendar size={25} /> {formatMemberSinceDate(user?.createdAt)}
          </span>
          <div className="following">
            <span>
              <b>{user?.following.length}</b>
              <p> Following</p>
            </span>
            <span>
              <b> {user?.followers.length}</b>
              <p>Followers</p>
            </span>
          </div>
        </div>
      </div>
      {(!isLoading || !isRefetching) && 
      <div>

      <div className="for">
        <p onClick={()=>setFeedType("posts")} style={(feedType==="posts")?{borderBottom:'3px solid rgb(53, 132, 227)'}:{}}>Posts</p>
        <p onClick={()=>setFeedType("likes")} style={(feedType==="likes")?{borderBottom:'3px solid rgb(53, 132, 227)'}:{}}>Likes</p>
      </div>
      <AllTweets feedType={feedType} userId={user?._id}  username={username}/>
    </div>}
    </div>}
    </div>
  );
};

export default Profile;
