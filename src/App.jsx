
import './App.css';
import Homepage from './components/homepage/Homepage';

import { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

function App() {
 useQuery({
		// we use queryKey to give a unique name to our query and refer to it later
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await fetch(`${process.env.REACT_APP_PROXY}/api/auth/me`,{
					  method: 'GET',
        credentials: 'include'
				});
				const data = await res.json();
				if (data.error) return null;
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				console.log("authUser is here:", data);
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		retry: false,
	});
  return (
    <div className="App">
     <Homepage />
     <Toaster />
    </div>
  );
}

export default App;
