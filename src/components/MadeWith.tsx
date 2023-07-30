import React from 'react';
import { useTranslation } from 'react-i18next';
import { SiReact, SiNextdotjs, SiNodedotjs, SiTypescript, SiMysql, SiSqlite, SiPython, SiFlask, SiTailwindcss } from 'react-icons/si';
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

const MadeWith = () => {
    const { t } = useTranslation('translation'); // Assuming you have translation keys for skill labels

    const skills = [
        { icon: SiReact, label: t('skill.react'), color: '#61dafb' }, // Blue for React
        { icon: SiNextdotjs, label: t('skill.nextjs'), color: '#000000' }, // Black for Next.js
        { icon: SiMysql, label: t('skill.mysql'), color: '#00758f' }, // Blue for MySQL
        { icon: SiTailwindcss, label: t('skill.tailwind'), color: '#4C51BF' } // Blue for Tailwind CSS
    ];

    return (
        <>
            <h2 className="text-2xl font-bold text-black dark:text-white">{t('skill.madeWith')}</h2>
            <div className="max-w-4xl grid grid-cols-2 md:grid-cols-8 gap-4">
                {skills.map((skill, index) => (
                    <SkillItem key={index} icon={skill.icon} label={skill.label} color={skill.color} />
                ))}
            </div>
        </>
    );
};

export default MadeWith;