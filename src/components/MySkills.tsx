import React from 'react';
import { useTranslation } from 'react-i18next';
import { SiReact, SiNextdotjs, SiNodedotjs, SiTypescript, SiMysql, SiSqlite } from 'react-icons/si';
import { IconType } from 'react-icons';

const SkillItem = ({ icon: Icon, label, color }: { icon: IconType; label: string; color: string }) => (
    <div
        className="flex flex-col items-center my-2 cursor-pointer transition duration-300 transform hover:scale-105"
        style={{ backgroundColor: color, color: 'white', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}
    >
        <Icon className="w-16 h-24 mb-1" /> {/* Increase the h value for a higher height */}
        <span className="text-xl font-semibold">{label}</span> {/* Use text-xl for larger text */}
    </div>
);

const MySkills = () => {
    const { t } = useTranslation('translation'); // Assuming you have translation keys for skill labels

    const skills = [
        { icon: SiReact, label: t('skill.react'), color: '#61dafb' }, // Blue for React
        { icon: SiNextdotjs, label: t('skill.nextjs'), color: '#000000' }, // Black for Next.js
        { icon: SiNodedotjs, label: t('skill.nodejs'), color: '#6cc24a' }, // Green for Node.js
        { icon: SiTypescript, label: t('skill.typescript'), color: '#3178c6' }, // Blue for TypeScript
        { icon: SiMysql, label: t('skill.mysql'), color: '#00758f' }, // Blue for MySQL
        { icon: SiSqlite, label: t('skill.sqlite3'), color: '#003b57' }, // Blue for SQLite
    ];

    return (
        <div className="bg-white dark:bg-zinc-950 p-4 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{t('skill.title')}</h2>
            <div className="max-w-6xl mx-auto grid grid-cols-6 gap-4"> {/* Adjust gap value to control spacing */}
                {skills.map((skill, index) => (
                    <SkillItem key={index} icon={skill.icon} label={skill.label} color={skill.color} />
                ))}
            </div>
        </div>
    );
};

export default MySkills;
