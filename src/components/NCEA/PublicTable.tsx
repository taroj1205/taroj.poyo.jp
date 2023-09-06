import React from 'react';
import { useTranslation } from 'react-i18next';

interface Subject {
    subject: string;
    standardNumber: string;
    name: string;
    credits: string;
    achievement: string;
    [key: string]: string;
}

const NceaTable: React.FC<{ subjects: Subject[] }> = ({ subjects }) => {
    const { t } = useTranslation();
    return (
        <div className="overflow-x-auto max-w-full">
            <table className="w-fit table-auto rounded-lg overflow-hidden border-collapse whitespace-nowrap transition-shadow duration-300 shadow-md hover:shadow-lg text-base md:text-lg">
                <thead>
                    <tr className="bg-teal-700 text-white text-left">
                        <th className="py-2 px-4 rounded-tl-lg">{t('ncea.subjects')}</th>
                        <th className="py-2 px-4">{t('ncea.credits')}</th>
                        <th className="py-2 px-4 rounded-tr-lg">{t('ncea.achievement')}</th>
                    </tr>
                </thead>
                <tbody className="text-black dark:text-white">
                    {subjects.map((subject, index) => (
                        <tr
                            key={index}
                            className={
                                subjects.indexOf(subject) % 2 === 0
                                    ? 'bg-gray-100 dark:bg-gray-800'
                                    : 'bg-gray-200 dark:bg-gray-900'
                            }
                        >
                            <td className="py-2 px-3 text-left">{subject.subject}</td>
                            <td className="py-2 px-3 text-right">{subject.credits}</td>
                            <td className="py-2 px-3 text-left">{subject.achievement}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default NceaTable;
