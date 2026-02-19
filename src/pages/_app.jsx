import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '../styles/globals.css'
import Header from "@/components/Header"
import { useRouter } from 'next/router';

export default function MyApp({ Component, pageProps }) {
    const [isDark, setIsDark] = useState(true);
    const router = useRouter();

    useEffect(() => {
        let theme = localStorage.getItem("theme") || 'dark';
        setIsDark(theme === "dark");
    }, []);

    return (
        <>
            <Head>
                <title>Nom de ton site</title>
                <link rel="icon" href="/logo.png" />
                <link rel="apple-touch-icon" href="/logo.png" />
                <meta name="theme-color" content="#000000" />
            </Head>

            <div className='w-full h-screen'>
                {router.pathname !== "/" && 
                    <Header isDark={isDark} setIsDark={setIsDark} />
                }
                <Component {...pageProps} isDark={isDark} />
            </div>
        </>
    );
}
