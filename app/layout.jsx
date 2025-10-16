
import '@/assets/styles/globals.css'
import LayoutWrapper from '@/components/LayoutWrapper';
import { LiveChatProvider } from '@/components/GlobalLiveChat';
import { Toaster } from 'react-hot-toast';
import {Inter} from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Lemufex Engineering Group',
  description: 'Engineering services across civil, mechanical, electrical, ICT, and more.',
  icons: '/favicon-lemufex.ico'
}


const RootLayout = ({children}) => {
    return ( 
        <html lang="en" className={inter.className}>

            <body className='bg-[#1E2A38] text-gray-200 min-h-screen flex flex-col'>
            <Toaster position='top-center' /> 
                <LayoutWrapper> 
                    <LiveChatProvider>
                        <main className='flex-grow'> {children} </main> 
                    </LiveChatProvider>
                </LayoutWrapper>
            </body>
        </html>
     );
}
 
export default RootLayout;