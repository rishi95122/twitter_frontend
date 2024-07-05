import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import "./alltweets.css";
import { FaHeart } from "react-icons/fa";
import userp from "../../store/images/userp.png";
import { FaRegComment } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import { Loader } from 'rsuite';
import {NavLink} from "react-router-dom"
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import Comment from "./CommentModal.jsx/Comment";
import { formatPostDate } from "../../functions";
import PostsSkeleton from "../skeletons/PostsSkeleton";
const AllTweets = ({ feedType, username, userId }) => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const [cmt, setisCmt] = useState();
  const queryClient = useQueryClient();
const [delId,setDelid]=useState()
  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return "/api/posts/all";
      case "following":
        return "/api/posts/following";
      case "posts":
        return `/api/posts/user/${username}`;
      case "likes":
        return `/api/posts/likes/${userId}`;
      default:
        return "/api/posts/all";
    }
  };

  const api = getPostEndpoint();
  const {
    data,
    isLoading: postLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_PROXY}`+api,{
          credentials:"include"
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        console.log(data);
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });
  useEffect(() => {
    refetch();
  }, [refetch, feedType]);

  const { mutate, isPending:isDeleting, } = useMutation({
    mutationFn: async (id) => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_PROXY}/api/posts/${id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Some thing went wrong");
        return data;
      } catch (e) {
        throw new Error(e);
      }
    },
    onSuccess: () => {
      toast.success("Post deleted");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const { mutate: likePost } = useMutation({
    mutationFn: async (post) => {
      try {
        const res = await fetch(`${process.env.REACT_APP_PROXY}/api/posts/like/${post?._id}`, {
          method: "POST",
           credentials:"include"
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (updatedLikes, post) => {
      // this is not the best UX, bc it will refetch all posts
      // queryClient.invalidateQueries({ queryKey: ["posts"] });

      // instead, update the cache directly for that post
      queryClient.setQueryData(["posts"], (oldData) => {
        return oldData.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: updatedLikes };
          }
          return p;
        });
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function handleComment(item) {
    setisCmt(item);
  }
  return (
    <div className="posts">
      {(postLoading || isRefetching)&&(
        <div>

          <PostsSkeleton />
          <PostsSkeleton />
          <PostsSkeleton />
        </div>
      )}
      {!postLoading && !isRefetching&& data?.length===0 && <p className="warning">No posts yet.!</p>}
      {!postLoading && !isRefetching&& data &&
        data.map((item) => {
          return (
            <div className="post">

              <div>
                <Avatar
                  size="40"
                  src={item?.user?.profileImg || userp}
                  round={true}
                  className="avatar"
                />
              </div>

              <div className="content">
                <div className="inner-content">
                  <NavLink className="nav-link" to={`/profile/${item.user.username}`}>

                 
                  <div className="username">
                    <p>{item.user.fullName}</p>
                    <p>@{item.user.username}</p>
                    <p>{" " + formatPostDate(item?.createdAt)}</p>
                  </div>
                  </NavLink>
                 
                      {item.user?._id == authUser?._id && (
                   (isDeleting &&(delId===item._id)) ?
                          <Loader /> :<MdDelete onClick={() =>{
                            setDelid(item._id)
                            mutate(item._id)}} id="delete" />
                
                  )
                  
                  }
                </div>
                <p>{item.text}</p>
                { item.img && 
                <div className="img">
              <img src={item.img} alt="" />
                  </div>
        }
                <div className="activity-btns">
                  <span>
                    <FaRegComment
                      id="comment"
                      size={15}
                      onClick={() => handleComment(item)}
                    />
                    <p> {item.comments.length}</p>
                  </span>

                  <span onClick={() => likePost(item)}>
                    <FaHeart
                      id="like"
                      className="like"
                      size={14}
                      style={
                        item?.likes.includes(authUser?._id) && { color: "red" }
                      }
                    />
                    <p> {item.likes.length}</p>
                  </span>

                  <span>
                    <CiBookmark id="bookmark" size={17} />
                  </span>
                </div>
              </div>
              {cmt && cmt?._id === item._id && (
                <Comment id={item?._id} setisCmt={setisCmt} item={item} />
              )}
            </div>
          );
        })}
    </div>
  );
};

export default AllTweets;
