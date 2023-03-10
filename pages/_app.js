import '@/styles/style.css';
import '@/styles/global.css';
import '@/styles/others.css';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { DefaultSeo, LogoJsonLd } from 'next-seo';
import { createTheme, NextUIProvider } from '@nextui-org/react';
import 'vidstack/styles/defaults.css';
export default function App({ Component, pageProps }) {
  const theme = createTheme({
    type: 'dark',
     theme: {
      colors: {
         primary: 'hsl(var(--in))',
         primaryShadow: 'hsl(var(--in))',
      }
    }
  })
  return <>
    <LogoJsonLd url='https://animematrix.vercel.app/' logo='https://animematrix.vercel.app/images/BrandedLogo.png' />
    <DefaultSeo
      title='Animetronix - All in one anime platform'
      description='Animetronix is a platform where you can watch anime, read manga, and read light novels.'
      canonical='https://animematrix.vercel.app/'
      openGraph={{
        title: 'Animetronix - All in one anime platform',
        description: 'Animetronix is a platform where you can watch anime, read manga, and read light novels.',
        images: [
          {
            url: 'https://animematrix.vercel.app/images/BrandedLogo.png',
            alt: 'Animetronix'
          }
        ],

        type: 'article',
        article: {
          tags: ['Animetronix', 'Animetronix', 'Animetronix', 'anime', 'manga', 'light novel', 'lightnovel', 'light novels', 'lightnovels', 'anime platform', 'anime platform']
        },
        url: 'https://animematrix.vercel.app/',
        site_name: 'Animetronix - All in one anime platform',

      }} />
    <NextUIProvider theme={theme}>
      <Component {...pageProps} />
    </NextUIProvider>
    <Analytics />
    <Script src='/js/script.js' />
  </>
}
