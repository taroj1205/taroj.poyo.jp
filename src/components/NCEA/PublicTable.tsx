import React, { useEffect, useState } from 'react';

interface Subject {
    subject: string;
    standardNumber: string;
    name: string;
    credits: string;
    achievement: string;
    [key: string]: string;
}

const NceaTable: React.FC<{ subjects: Subject[] }> = ({ subjects }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, [subjects]);

    // Function to categorize subjects into levels
    const categorizeSubjects = (subjects: Subject[]) => {
        const categorizedLevels: { [key: string]: Subject[] } = {};

        subjects.forEach((subject) => {
            const level = subject.standardNumber.split('.')[0];
            if (!categorizedLevels[level]) {
                categorizedLevels[level] = [];
            }
            categorizedLevels[level].push(subject);
        });

        return categorizedLevels;
    };

    // Categorize the subjects into levels
    const categorizedSubjects = categorizeSubjects(subjects);

    // Calculate the total credits for each year level
    const totalCredits: { [key: string]: number } = {};
    Object.keys(categorizedSubjects).forEach((level) => {
        totalCredits[level] = categorizedSubjects[level].reduce(
            (acc, subject) => acc + parseInt(subject.credits),
            0
        );
    });

    if (loading) {
        return null;
    } else {
        return (
            <div className="overflow-x-auto max-w-5xl mb-4">
                <table className="w-fit table-auto rounded-lg overflow-hidden border-collapse whitespace-nowrap transition-shadow duration-300 shadow-md hover:shadow-lg text-base md:text-lg">
                    {Object.keys(categorizedSubjects)
                        .sort((a, b) => Number(b) - Number(a))
                        .map((level) => (
                            <React.Fragment key={level}>
                                <thead>
                                    <tr className="bg-teal-700 text-white">
                                        <td className="py-2 px-4" colSpan={2}>
                                            <strong>Level {level}</strong>
                                        </td>
                                        <td className="py-2 px-4" colSpan={2}>
                                            <strong>Credits {totalCredits[level]}</strong>
                                        </td>
                                    </tr>
                                </thead>
                                {categorizedSubjects[level].map((subject, index) => {
                                    console.log('index', index);
                                    if (index > 0) {
                                        console.log('categorizedSubjects', subject.subject, categorizedSubjects[level][index - 1].subject);
                                    }
                                    return (
                                        <React.Fragment key={index}>
                                            <thead>
                                                {index === 0 && (
                                                    <tr className="bg-gray-300 dark:bg-gray-700">
                                                        <td className="py-2 px-4" colSpan={3}>
                                                            <strong>{subject.subject}</strong>
                                                            {' - '}
                                                            <strong>
                                                                {categorizedSubjects[level]
                                                                    .filter((subject) => subject.subject === categorizedSubjects[level][index].subject)
                                                                    .reduce((acc, subject) => acc + parseInt(subject.credits), 0)} credits
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                )}
                                                {index > 0 && subject.subject !== categorizedSubjects[level][index - 1].subject && (
                                                    <tr className="bg-gray-300 dark:bg-gray-700">
                                                        <td className="py-2 px-4" colSpan={3}>
                                                            <strong>{subject.subject}</strong>
                                                            {' - '}
                                                            <strong>
                                                                {categorizedSubjects[level]
                                                                    .filter((subject) => subject.subject === categorizedSubjects[level][index].subject)
                                                                    .reduce((acc, subject) => acc + parseInt(subject.credits), 0)} credits
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                )}
                                            </thead>
                                            <tbody>
                                                <tr
                                                    key={index}
                                                    className={
                                                        index % 2 === 0
                                                            ? 'bg-gray-100 dark:bg-gray-800'
                                                            : 'bg-gray-200 dark:bg-gray-900'
                                                    }
                                                >
                                                    <td className="py-2 px-3 text-left whitespace-pre-wrap">
                                                        {subject.standardNumber}{' - '}
                                                        {subject.name}
                                                    </td>
                                                    <td className="py-2 px-3 text-left lg:text-right">
                                                        {subject.credits}
                                                    </td>
                                                    <td className="py-2 px-3 text-left">
                                                        {subject.achievement}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </React.Fragment>
                                    )
                                })}
                            </React.Fragment>
                        ))}
                </table>
            </div>
        );
    }
};

export default NceaTable;
