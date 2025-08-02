import '@/assets/styles/globals.css'
import LayoutWrapper from '@/components/LayoutWrapper';
import { Toaster } from 'react-hot-toast';
import {Inter} from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Lemufex Engineering Group',
  description: 'Engineering services across civil, mechanical, electrical, ICT, and more.',
}


const RootLayout = ({children}) => {
    return ( 
        <html lang="en" className={inter.className}>
            <body className='bg-[#1E2A38] text-gray-200'>
            <Toaster position='top-center' /> 
                <LayoutWrapper>{children}</LayoutWrapper>
            </body>
        </html>
     );
}
 
export default RootLayout;