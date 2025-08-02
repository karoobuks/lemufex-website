'use client'
import {FaExclamationCircle} from 'react-icons/fa'
import Link from 'next/link';

const ErrorPage = ({error}) => {
    return ( <div className='text-center p-[50px]'>
            <h1 className="text-[3rem] text-[#FE9900]">
                <div className="flex justify-center">
                  <FaExclamationCircle className='text-8xl text-[#00B2FF]' />  
                </div>
                <div className='flex justify-center'>Something went wrong</div>

             </h1> 
             <p className='flex justify-center text-[1.2rem]'>
                {error.toString()}
            </p>
             <Link href='/' className='flex justify-center text-[#00B2FF] underline decoration-[#FE9900] decoration-2 mt-6'>Go back to Home</Link>  
    </div> 
    );
}
 
export default ErrorPage;