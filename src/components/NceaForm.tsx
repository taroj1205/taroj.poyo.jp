import React, { useEffect, useState } from 'react';
import { useAuth, AuthContextValue } from '../components/AuthContext';
import { Tooltip } from 'react-tooltip';
import { useTranslation } from 'react-i18next';

interface Subject {
    subject: string;
    standardNumber: string;
    name: string;
    credits: string;
    achievement: string;
    [key: string]: string;
}

const NCEA: React.FC<{ subjects: Subject[]; savedSubjects: Subject[]; setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>; isEditing: boolean, setIsEditing: React.Dispatch<React.SetStateAction<boolean>>; setSavedSubjects: React.Dispatch<React.SetStateAction<Subject[]>> }> = ({ subjects, savedSubjects, setSubjects, isEditing, setIsEditing, setSavedSubjects }) => {
    const { token } = useAuth() || {} as AuthContextValue;
    const { t } = useTranslation();
    const [sending, setSending] = useState(false);
    const [copied, setCopied] = useState(false);
    const [uniqueSubjects, setUniqueSubjects] = useState(Array.from(new Set(savedSubjects.map(subject => subject.subject))));

    const handleAddSubject = () => {
        setSubjects([...subjects, { subject: '', standardNumber: '', name: '', credits: '', achievement: '' }]);
    };

    const handleRemoveSubject = (index: number) => {
        const updatedSubjects = [...subjects];
        updatedSubjects.splice(index, 1);
        setSubjects(updatedSubjects);
    };

    const handleChange = (index: number, field: string, value: string) => {
        const updatedSubjects = [...subjects];
        updatedSubjects[index][field] = value.trim();
        setSubjects(updatedSubjects);
    };

    useEffect(() => {
        setUniqueSubjects(Array.from(new Set(subjects.map(subject => subject.subject))));
        console.log(Array.from(new Set(subjects.map(subject => subject.subject))));
    }, [subjects])

    const newData = () => {
        navigator.clipboard.readText()
            .then(text => {
                console.log('Pasted content: ', text);
                // Parse the pasted data as JSON
                const parsedValue = JSON.parse(text);
                console.log(parsedValue);

                // Check if the parsed data matches the NCEA format
                if (Array.isArray(parsedValue)) {
                    const isValid = parsedValue.every(subject => {
                        return (
                            typeof subject === 'object' &&
                            'subject' in subject &&
                            'standardNumber' in subject &&
                            'name' in subject &&
                            'credits' in subject &&
                            'achievement' in subject
                        );
                    });

                    if (isValid) {
                        // If it matches the expected structure, update the state with the parsed data
                        setSubjects(parsedValue);
                    } else {
                        // If the structure doesn't match, show an error message or handle it as needed
                        console.error('Invalid NCEA format');
                    }
                } else {
                    console.error('Invalid JSON format');
                }
            })
            .catch(err => {
                console.error('Failed to read clipboard contents: ', err);
            });
    };

    const exportData = () => {
        const data = JSON.stringify(subjects);
        navigator.clipboard.writeText(data)
            .then(() => {
                console.log('Data copied to clipboard');
                setCopied(true);
                setTimeout(() => {
                    setCopied(false);
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy data to clipboard: ', err);
            });
    }

    const submitInfo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (subjects !== savedSubjects) {
            setSending(true);
            try {
                const response = await fetch('/api/ncea/insert', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(subjects),
                });

                if (response.ok) {
                    // Handle success, e.g., show a success message
                    console.log('Data submitted successfully');
                    localStorage.setItem('subjects', JSON.stringify(subjects));
                    setSavedSubjects(subjects);
                    setIsEditing(false);
                    setSending(false);
                } else {
                    // Handle error, e.g., show an error message
                    console.error('Failed to submit data');
                    setSending(false);
                }
            } catch (error) {
                // Handle network or other errors
                console.error('An error occurred:', error);
                setSending(false);
            }
        } else {
            setIsEditing(false);
        }
    };

    const loadData = async () => {
        try {
            const response = await fetch(`/api/ncea/data?token=${encodeURIComponent(token)}`, {
                method: 'GET',
            });

            // Parse the API response
            const responseData = await response.json();

            console.log(responseData.subjects);

            // Check if subjects is present in the response
            if (responseData.subjects) {
                // Handle success, e.g., show a success message
                console.log('Data retrieved successfully');

                // Store subjects in local storage
                localStorage.setItem('subjects', JSON.stringify(responseData.subjects));

                // Set nceaData as the new data
                setSavedSubjects(responseData.subjects);
                setSubjects(responseData.subjects);
                // setIsEditing(false);
            } else {
                // Handle error if nceaData is not present in the response
                console.error('Failed to retrieve nceaData from the API response');
            }
        } catch (error) {
            // Handle network or other errors
            console.error('An error occurred:', error);
        }
    }

    useEffect(() => {
        const storedSubjects = localStorage.getItem('subjects');
        if (storedSubjects) {
            setSubjects(JSON.parse(storedSubjects));
            setSavedSubjects(JSON.parse(storedSubjects));
        } else {
            setSavedSubjects(subjects);
            setIsEditing(true);
        }
    }, [token])

    useEffect(() => {
        if (!isEditing) {
            const sortedSubjects = [...subjects].sort((a, b) => {
                const levelA = parseFloat(a.standardNumber);
                const levelB = parseFloat(b.standardNumber);
                return levelA - levelB;
            });
            setSubjects(sortedSubjects);
        }
    }, [isEditing]);

    if (isEditing) {
        return (
            <div className="p-4">
                <h2 className="text-2xl font-bold mb-4">
                    {t('ncea.edit')}
                </h2>
                <form onSubmit={(e) => submitInfo(e)}>
                    {subjects.map((subjectInfo, index) => (
                        <div key={index} className="mb-4 bg-white dark:bg-slate-900 p-2 border rounded-lg border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col lg:flex-row">
                                <div className="mb-2 flex-grow">
                                    <label className='mb-2' htmlFor={`subject-${index}`}>Subject</label>
                                    <input
                                        type="text"
                                        id={`subject-${index}`}
                                        value={subjectInfo.subject}
                                        onChange={(e) => handleChange(index, 'subject', e.target.value)}
                                        onClick={() => console.log(subjects)}
                                        placeholder="Calculus"
                                        className="border p-2 rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 w-full"
                                        required
                                        list={`subject-list-${index}`}
                                    />
                                    <datalist id={`subject-list-${index}`}>
                                        {uniqueSubjects.map((subject) => (
                                            <option key={subject} value={subject} />
                                        ))}
                                    </datalist>
                                </div>
                                <div className="mb-2 w-[10ch]">
                                    <label className='mb-2' htmlFor={`standardNumber-${index}`}>Number</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        id={`standardNumber-${index}`}
                                        value={subjectInfo.standardNumber}
                                        onChange={(e) => handleChange(index, 'standardNumber', e.target.value)}
                                        placeholder="3.3"
                                        className="border p-2 rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 w-full"
                                        maxLength={3}
                                        required
                                    />
                                </div>
                                <div className="mb-2 w-[10ch]">
                                    <label className='mb-2' htmlFor={`credits-${index}`}>Credits</label>
                                    <input
                                        type="number"
                                        step="1"
                                        id={`credits-${index}`}
                                        value={subjectInfo.credits}
                                        onChange={(e) => handleChange(index, 'credits', e.target.value)}
                                        placeholder="4"
                                        maxLength={2}
                                        className="border p-2 rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-2 flex-grow">
                                    <label className='mb-2' htmlFor={`name-${index}`}>Name</label>
                                    <input
                                        type="text"
                                        id={`name-${index}`}
                                        value={subjectInfo.name}
                                        onChange={(e) => handleChange(index, 'name', e.target.value)}
                                        placeholder="Apply trigonometric methods in solving problems"
                                        className="border p-2 rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-2 flex-grow">
                                    <label className='mb-2' htmlFor={`achievement-${index}`}>Achievement</label>
                                    <select
                                        id={`achievement-${index}`}
                                        value={subjectInfo.achievement}
                                        onChange={(e) => handleChange(index, 'achievement', e.target.value)}
                                        className="border p-2 rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 w-full"
                                        required
                                    >
                                        <option value="" disabled>Select Achievement</option>
                                        <option value="Not Achieved">Not Achieved</option>
                                        <option value="Achieved">Achieved</option>
                                        <option value="Merit">Merit</option>
                                        <option value="Excellence">Excellence</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-span-2 text-right">
                                {subjects.length > 1 && (
                                    <button
                                        onClick={() => handleRemoveSubject(index)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    <div className='flex flex-col md:flex-row md:justify-between gap-2 md:gap-0'>
                        <button
                            onClick={handleAddSubject}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Add Subject
                        </button>
                        <div className='flex flex-col md:flex-row text-center gap-2'>
                            {token &&
                                < label
                                    htmlFor="exportClipboard"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer"
                                    onClick={loadData}
                                >
                                    Load from Saved
                                </label>
                            }
                            <label
                                htmlFor="jsonClipboard"
                                data-tooltip-content="Example JSON format: [{&quot;subject&quot;:&quot;Calculus&quot;,&quot;standardNumber&quot;:&quot;3.3&quot;,&quot;name&quot;:&quot;Apply trigonometric methods in solving problems&quot;,&quot;credits&quot;:&quot;4&quot;,&quot;achievement&quot;:&quot;Excellence&quot;}]"
                                data-tooltip-place="top"
                                data-tooltip-id="jsonClipboard"
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer"
                                onClick={newData}
                            >
                                Import from Clipboard (JSON)
                            </label>
                            <Tooltip id='jsonClipboard' />
                            <label
                                htmlFor="exportClipboard"
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer"
                                onClick={exportData}
                                data-tooltip-content={copied ? t('copied') : t('copy')}
                                data-tooltip-place="top"
                                data-tooltip-id="export"
                            >
                                Export
                            </label>
                            <Tooltip id='export' />
                        </div>
                        {token && (
                            !sending ? (
                                <button
                                    type='submit'
                                    className="bg-blue-500 text-white px-4 py-2 min-w-16 rounded-lg hover:bg-blue-600"
                                >
                                    Save
                                </button>
                            ) : (
                                <button className="bg-blue-600 text-white px-4 py-2 min-w-16 rounded-lg hover:bg-blue-700 flex items-center justify-center cursor-not" disabled>
                                    <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                                </button>
                            )
                        )}
                    </div>
                </form >
            </div >
        );
    } else {
        return null;
    }
};

export default NCEA;
