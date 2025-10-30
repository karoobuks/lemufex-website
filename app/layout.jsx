//app/layout.jsx
import '@/assets/styles/globals.css'
import LayoutWrapper from '@/components/LayoutWrapper';
import { LiveChatProvider } from '@/components/GlobalLiveChat';
import { SpeedInsights } from '@vercel/speed-insights/next';
import AuthProvider from '@/components/AuthProvider';
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

export const viewport = {
  width: 'device-width',
  initialScale: 1
}


const RootLayout = ({children}) => {
    return ( 
        <html lang="en" className={inter.className}>

            <body className='bg-[#1E2A38] text-gray-200 min-h-screen flex flex-col'>
            <Toaster position='top-center' /> 
             <AuthProvider>
                <LayoutWrapper> 
                    <LiveChatProvider>
                        <main className='flex-grow'> {children} </main> 
                        <SpeedInsights />
                    </LiveChatProvider>
                </LayoutWrapper>
              </AuthProvider>  
            </body>
        </html>
     );
}
 
export default RootLayout;