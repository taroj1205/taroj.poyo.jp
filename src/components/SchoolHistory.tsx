import { useTranslation } from 'react-i18next';

export default function SchoolHistory() {
    const { t } = useTranslation(); // Specify the translation key

    return (
        <section className="education">
            <h2 className="text-2xl mt-4 leading-loose">
                {t('about.education.schoolHistory')}
            </h2>
            <div className="overflow-x-auto w-full text-black dark:text-white">
                <table className="w-full table-auto rounded-lg overflow-hidden border-collapse whitespace-nowrap transition-shadow duration-300 shadow-md hover:shadow-lg">
                    <thead>
                        <tr className="bg-teal-700 text-white">
                            <th className="py-2 px-4 rounded-tl-lg">
                                {t('about.education.headings.start')}
                            </th>
                            <th className="py-2 px-4">
                                {t('about.education.headings.end')}
                            </th>
                            <th className="py-2 px-4">
                                {t('about.education.headings.name')}
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
                    <tbody className='text-black dark:text-white'>
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
                                    {t(
                                        `about.education.schools.${index}.start`
                                    )}
                                </td>
                                <td className="py-2 px-4">
                                    {t(`about.education.schools.${index}.end`)}
                                </td>
                                <td className="py-2 px-4 flex items-center">
                                    {t(`about.education.schools.${index}.name`)}
                                </td>
                                <td className="py-2 px-4">
                                    {t(
                                        `about.education.schools.${index}.grade`
                                    )}
                                </td>
                                <td className="py-2 px-4">
                                    {t(
                                        `about.education.schools.${index}.duration`
                                    )}
                                </td>
                                <td className="py-2 px-4">
                                    {t(
                                        `about.education.schools.${index}.location`
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
