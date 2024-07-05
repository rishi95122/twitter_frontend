import React, { useEffect, useRef, useState } from "react";
import "./feed.css";
import Avatar from "react-avatar";
import { CiImageOn } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from "react-hot-toast";
import userp from "../../store/images/userp.png"
import AllTweets from "./AllTweets";
const CreatePost = () => {
  const imgRef = useRef(null);
  const [img,setImg]=useState()
  const [feedType,setFeedType]=useState("foryou")
  const [text, setText] = useState("");
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	
console.log(img)
  function handleImgChange(e){
    const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
  }

	const {
		mutate: createPost,
		isPending,

	} = useMutation({
		mutationFn: async ({ text, img }) => {
			try {
				const res = await fetch(`${process.env.REACT_APP_PROXY}/api/posts/create`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text, img }),
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

		onSuccess: () => {
			setText("");
			setImg(null);
			toast.success("Post created successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});


  return (
    <div>

   
    <div className="createpost">
      <div className="for">
        <p onClick={()=>setFeedType("foryou")} style={(feedType==="foryou")?{borderBottom:'3px solid rgb(53, 132, 227)'}:{}}>For you</p>
        <p onClick={()=>setFeedType("following")} style={(feedType==="following")?{borderBottom:'3px solid rgb(53, 132, 227)'}:{}}> Following</p>
      </div>
      <div className="postinput">
        <Avatar
          size="40"
          src={authUser?.profileImg || userp}
          round={true}
          className="avatar"
        />
        <div className="post">
          <input placeholder="What is happening!" value={text} onChange={(e)=>setText(e.target.value)}/>
          {
            img && (
              <div className="input-img">
              <IoCloseSharp
              id="cross-btn"
                      size={23}
                      onClick={() => {
                        setImg(null);
                        imgRef.current.value = null;
                      }}
                    />
              <img src={img} alt=""/>
              </div>
            )
          }
     
          <div className="btn">
            <CiImageOn size={24} onClick={() => imgRef.current.click()} />
            <input type="file" onChange={handleImgChange} ref={imgRef} hidden />
            <button onClick={()=>createPost({text,img})}>{isPending ?"Posting..":"Post"}</button>
          </div>
        </div>
      </div>
    
    </div>
    <AllTweets feedType={feedType} />
    </div>
  );
};

export default CreatePost;
