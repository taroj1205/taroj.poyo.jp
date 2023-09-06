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

    const [subjects, setSubjects] = useState<Subject[]>([
        {
            subject: '',
            standardNumber: '',
            name: '',
            credits: '',
            achievement: '',
        },
    ]);

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
                <title>{t('title.apps.ncea calculator')}</title>
            </Head>
            <div className='pt-14 lg:flex lg:flex-col lg:justify-center lg:items-center px-4'>
                <h1 className="text-4xl font-bold mb-4">{t('ncea.ncea information')}</h1>
                {subjects && subjects[0].subject.length > 0 && subjects[0].standardNumber.length > 0 && subjects[0].name.length > 0 && subjects[0].credits.length > 0 && subjects[0].achievement.length > 0 ? (
                    <>
                        <p className='text-lg font-bold mt-2'>{t('ncea.currentRankScore')}{<RankScore subjects={savedSubjects} />}
                            <button
                                onClick={() => { setIsEditing(!isEditing); setSubjects(savedSubjects); }}
                                className="ml-2 text-base bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                {isEditing ? 'Cancel' : 'Edit'}
                            </button>
                        </p>
                        <Graph data={subjects} />
                    </>
                ) : (
                    <p className='text-lg font-bold mt-2'>{t('ncea.noData')}</p>
                )}
                <NceaTable subjects={subjects} />
                <NceaForm subjects={subjects} savedSubjects={savedSubjects} setSubjects={setSubjects} isEditing={isEditing} setIsEditing={setIsEditing} setSavedSubjects={setSavedSubjects} />
            </div>
        </>
    );
}

export default NCEA;
