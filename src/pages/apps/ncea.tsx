import React, { useEffect, useState } from 'react';
import NceaForm from '../../components/NceaForm';
import Graph from '../../components/NCEA/PublicGraph';
import RankScore from '../../components/NCEA/PublicRankScore';
import { useTranslation } from 'react-i18next';
import NceaTable from '../../components/NCEA/PublicTable';
import { useAuth } from '../../components/AuthContext';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface Subject {
    subject: string;
    standardNumber: string;
    name: string;
    credits: string;
    achievement: string;
    [key: string]: string;
}

const NCEA = () => {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [savedSubjects, setSavedSubjects] = React.useState<Subject[]>([]);
    const { isLoading, token, user } = useAuth() || {};
    const router = useRouter();

    const [subjects, setSubjects] = useState<Subject[]>([
        {
            subject: '',
            standardNumber: '',
            name: '',
            credits: '',
            achievement: '',
        },
    ]);

    useEffect(() => {
        if (isLoading === false) {
            if (!token || !user) {
                router.push('/auth/login');
                return;
            }
        }
    }, [isLoading]);

    return (
        <>
            <Head>
                <meta name='title' content='NCEA Calculator - taroj.poyo.jp' />
                <meta name='description' content='Index page for taroj.poyo.jp' />
                <meta property="og:title" content="NCEA Calculator - taroj.poyo.jp" />
                <meta
                    property="og:description"
                    content="Index page for taroj.poyo.jp"
                />
                <meta name="twitter:title" content="NCEA Calculator - taroj.poyo.jp" />
                <meta
                    name="twitter:description"
                    content="NCEA Calculator page for taroj.poyo.jp"
                />
                <link rel="preload" href="/image/thumbnail/thumbnail.webp" as="image" />
                <link rel="preload" href="https://github-readme-stats.vercel.app/api?username=taroj1205&show_icons=true&locale=ja&hide_border=true&rank_icon=percentile&theme=dark" as="image" />
                <link rel="preload" href="https://github-readme-stats.vercel.app/api?username=taroj1205&show_icons=true&locale=en&hide_border=true&rank_icon=percentile&theme=light" as="image" />
                <link rel="preload" href="https://github-readme-stats.vercel.app/api/top-langs/?username=taroj1205&show_icons=true&locale=ja&hide_border=true&layout=compact&langs_count=10&rank_icon=percentile&theme=dark" as="image" />
                <link rel="preload" href="https://github-readme-stats.vercel.app/api/top-langs/?username=taroj1205&show_icons=true&locale=en&hide_border=true&layout=compact&langs_count=10&rank_icon=percentile&theme=light" as="image" />
                <link rel="preload" href="https://github-readme-stats.vercel.app/api/wakatime?username=taroj1205&hide_border=true&locale=en&theme=dark" as="image" />
                <link rel="preload" href="https://github-readme-stats.vercel.app/api/wakatime?username=taroj1205&hide_border=true&locale=ja&theme=light" as="image" />
                <title>{t('title.apps.ncea calculator')}</title>
            </Head>
            <div className='pt-14 lg:flex lg:flex-col lg:justify-center lg:items-center px-4'>
                <h1 className="text-4xl font-bold mb-4">NCEA Information</h1>
                <p className='text-lg font-bold mt-2'>{t('ncea.currentRankScore')}{<RankScore subjects={subjects} />}
                    <button
                        onClick={() => { setIsEditing(!isEditing); setSubjects(savedSubjects); }}
                        className="ml-2 text-base bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                </p>
                <Graph data={subjects} />
                <NceaTable subjects={subjects} />
                <NceaForm subjects={subjects} setSubjects={setSubjects} isEditing={isEditing} setIsEditing={setIsEditing} setSavedSubjects={setSavedSubjects} />
            </div>
        </>
    );
}

export default NCEA;
