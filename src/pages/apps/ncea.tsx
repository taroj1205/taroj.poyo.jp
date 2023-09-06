import React, { useState } from 'react';
import NceaForm from '../../components/NceaForm';
import Graph from '../../components/NCEA/PublicGraph';
import { useTranslation } from 'react-i18next';
import RankScore from '../../components/NCEA/PublicRankScore';

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
        <div className='pt-14 lg:flex lg:flex-col lg:justify-center lg:items-center px-4'>
            <h1 className="text-4xl font-bold mb-4">NCEA Information</h1>
            <p className='text-lg font-bold mt-2'>{/*{t('ncea.currentRankScore')}{<RankScore />}*/}
            <button
                onClick={() => setIsEditing(!isEditing)}
                className="ml-2 text-base bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
                {isEditing ? 'Cancel' : 'Edit'}
            </button>
            </p>
            <Graph data={subjects} />
            <NceaForm subjects={subjects} setSubjects={setSubjects} isEditing={isEditing} />
        </div>
    );
}

export default NCEA;
