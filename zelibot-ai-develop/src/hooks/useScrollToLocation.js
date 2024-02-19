import {useEffect} from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollToLocation() {
    const { hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({behavior: 'smooth'});
                setTimeout(() => {
                    const header = document.getElementById('header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    window.scrollTo({
                        top: element.offsetTop - headerHeight,
                        behavior: 'smooth',
                    });
                }, 500);
            }
        }
    });
};
