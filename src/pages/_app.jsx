import React, { useEffect, useState } from 'react'
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
        <div className='w-full h-screen'>
            {router.pathname !== "/test" && <Header isDark={isDark} setIsDark={setIsDark} />}
            <Component {...pageProps} isDark={isDark} />
        </div>
    );
}