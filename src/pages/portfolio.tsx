import { useTranslation } from 'react-i18next';
import { Fade } from "react-awesome-reveal";
import Image from 'next/image';


const Portfolio = () => {
    const { t } = useTranslation();
    return (
        <>
            <div className='fixed inset-0 z-[-10]'>
                <Image alt='thumbnail image' src="/image/thumbnail/thumbnail.webp" fill={true} className='object-cover' />
            </div>
            <Fade direction='left' >
                <h1 className="title text-7xl font-bold flex justify-center items-center flex-col">
                    {t('index.welcome')}
                </h1>
            </Fade>
        </>
    );
}

export default Portfolio;