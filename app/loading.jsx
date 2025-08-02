import { FaCog } from 'react-icons/fa'



const LoadingPage = () => {
    return (
         <div className="flex items-center justify-center h-screen">
   <FaCog className="animate-spin text-7xl text-[#FE9900]" aria-hidden="true" />
    </div>
     );
}
 
export default LoadingPage;