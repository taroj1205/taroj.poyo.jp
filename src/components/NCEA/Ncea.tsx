import React from 'react';
import ncea from '../doc/ncea';
import { useTranslation } from 'react-i18next';

const NCEA: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="overflow-x-auto w-full max-w-full">
            <table className="w-fit table-auto rounded-lg overflow-hidden border-collapse whitespace-nowrap transition-shadow duration-300 shadow-md hover:shadow-lg text-base md:text-lg">
                <thead>
                    <tr className="bg-teal-700 text-white text-left">
                        <th className="py-2 px-4 rounded-tl-lg">{t('ncea.subjects')}</th>
                        <th className="py-2 px-4">{t('ncea.credits')}</th>
                        <th className="py-2 px-4 rounded-tr-lg">{t('ncea.achievement')}</th>
                    </tr>
                </thead>
                <tbody className="text-black dark:text-white">
                    {Object.entries(ncea).map(([subject, assessments]) => (
                        <React.Fragment key={subject}>
                            {Object.entries(assessments).map(([assessment, details]) => (
                                <tr
                                    key={`${subject}-${assessment}`}
                                    className={
                                        Object.keys(ncea).indexOf(subject) % 2 === 0
                                            ? 'bg-gray-100 dark:bg-gray-800'
                                            : 'bg-gray-200 dark:bg-gray-900'
                                    }
                                >
                                    <td className="py-2 px-3 text-left">{subject} {assessment}</td>
                                    <td className="py-2 px-3 text-right">{details.credits}</td>
                                    <td className="py-2 px-3 text-left">{details.achievement}</td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default NCEA;