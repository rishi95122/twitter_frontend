import React from 'react'
import { Outlet } from 'react-router-dom'
import "./notification.css"
import { FaUser,FaHeart } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Avatar from 'react-avatar';
const Notification = () => {
  const queryClient = useQueryClient();
	const { data: notifications, isLoading } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			try {
				const res = await fetch(`${process.env.REACT_APP_PROXY}/api/notifications`, {
          method:"GET",
          credentials:"include"
        });
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Something went wrong");
        console.log(data)
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
	});

	const { mutate: deleteNotifications } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/notifications", {
					method: "DELETE",
				});
				const data = await res.json();

				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Notifications deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
  return (
    <div className='notification'>
        <div className='noti-tab'>
        <h3>Notifications</h3>
        <MdDelete onClick={()=>deleteNotifications()} />
        </div>
        {
          notifications ? notifications.map((item)=>{
            return  <div className='parent-content'>
              {item.type === "follow" && <FaUser id="follow" className='w-7 h-7 text-primary' />}
							{item.type === "like" && <FaHeart id="heart" className='w-7 h-7 text-red-500' />}
            <div className='content'>
                <Avatar round={true} size={30} src={item?.from?.profileImg}/>
                <p>@{item.from.username}  {item.type==="follow" ? "followed you":"liked your post"}</p>
            </div>
            </div>
          }) : <div>No notifications</div>
        }
       

    </div>
  )
}

export default Notification