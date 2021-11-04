import { useState, useEffect } from 'react'

export const useIntersection = (element, rootMargin="0px") => {
    const [isVisible, setState] = useState(false);

    useEffect(() => {
        console.log(element , "dddddddddddddddddddddd");
        const observer = new IntersectionObserver(
            ([entry]) => {
                setState(entry.isIntersecting);
            }, { rootMargin }
        );

        if (element.current) {
            observer.observe(element.current);
          }
          return () => {
            observer.unobserve(element.current);
          };
    }, []);

    return isVisible;
};
