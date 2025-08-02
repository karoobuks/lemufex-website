import {FaExclamationTriangle} from 'react-icons/fa'
import Link from 'next/link';

const NotFoundPage = () => {
    return ( 
        <div className="p-12 text-center bg-[#1E2A38] min-h-screen text-[#E5E7EB]">
            <h1 className="text-[3rem] text-[#FE9900]">
                <div className="flex justify-center">
                <FaExclamationTriangle className='text-8xl text-[#00B2FF]' />
                </div>
                <div className='flex justify-center'>404 - Page Not Found</div>

            </h1>
            <p className='flex justify-center text-[1.2rem] mt-4'>
                oop! The page you are looking for does not exist
            </p>
            <Link href='/' className='flex justify-center text-[#00B2FF] underline decoration-[#FE9900] decoration-2 mt-6'>Go back to Home</Link>
            
        </div>
     );
}
 
export default NotFoundPage;