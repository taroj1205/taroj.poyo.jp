import { useTranslation } from 'react-i18next';

export default function SchoolHistory() {
    const { t } = useTranslation();

    return (
        <div className="education max-w-full">
            <div className="overflow-x-auto w-full">
                    <table className="w-full max-w-4xl table-auto rounded-lg border-collapse whitespace-nowrap transition-shadow duration-300 shadow-md hover:shadow-lg text-base md:text-lg">
                        <thead>
                            <tr className="bg-teal-700 text-white">
                                <th className="py-2 px-4 rounded-tl-lg">
                                    {t('about.education.headings.start')}
                                </th>
                                <th className="py-2 px-4">
                                    {t('about.education.headings.end')}
                                </th>
                                <th className="py-2 px-4">
                                    {t('about.education.headings.schoolName')}
                                </th>
                                <th className="py-2 px-4">
                                    {t('about.education.headings.grade')}
                                </th>
                                <th className="py-2 px-4">
                                    {t('about.education.headings.duration')}
                                </th>
                                <th className="py-2 px-4 rounded-tr-lg">
                                    {t('about.education.headings.location')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-black dark:text-white">
                            {Array.from(Array(11).keys()).map((index) => (
                                <tr
                                    key={index}
                                    className={
                                        index % 2 === 0
                                            ? 'bg-gray-100 dark:bg-gray-800'
                                            : 'bg-gray-200 dark:bg-gray-900'
                                    }
                                    style={{ transition: 'background-color 0.3s' }}
                                >
                                    <td className="py-2 px-4">
                                        {t(`about.education.schools.${index}.start`)}
                                    </td>
                                    <td className="py-2 px-4">
                                        {t(`about.education.schools.${index}.end`)}
                                    </td>
                                    <td className="py-2 px-4 flex items-center">
                                        {t(`about.education.schools.${index}.name`)}
                                    </td>
                                    <td className="py-2 px-4">
                                        {t(`about.education.schools.${index}.grade`)}
                                    </td>
                                    <td className="py-2 px-4">
                                        {t(`about.education.schools.${index}.duration`)}
                                    </td>
                                    <td className="py-2 px-4">
                                        {t(`about.education.schools.${index}.location`)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
            </div>
        </div>
    );
}
