import React from 'react';
import { useTranslation } from 'react-i18next';
import { SiReact, SiNextdotjs, SiNodedotjs, SiTypescript, SiMysql, SiSqlite, SiPython, SiFlask, SiExpress, SiTailwindcss } from 'react-icons/si';
import { IconType } from 'react-icons';

const SkillItem = ({ icon: Icon, label, color }: { icon: IconType; label: string; color: string }) => (
    <div
        className="flex flex-col items-center my-2 cursor-pointer transition duration-300 transform hover:scale-105"
        style={{ backgroundColor: color, color: 'white', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}
    >
        <Icon className="w-16 h-24 mb-1" />
        <span className="text-xl font-semibold s">{label}</span>
    </div>
);

const MySkills = () => {
    const { t } = useTranslation();

    const skills = [
        { icon: SiReact, label: t('skill.react'), color: '#0e7696' },
        { icon: SiNextdotjs, label: t('skill.nextjs'), color: '#000000' },
        { icon: SiNodedotjs, label: t('skill.nodejs'), color: '#336633' },
        { icon: SiExpress, label: t('skill.express'), color: '#000000' },
        { icon: SiTypescript, label: t('skill.typescript'), color: '#3178c6' },
        { icon: SiMysql, label: t('skill.mysql'), color: '#4479a1' },
        { icon: SiSqlite, label: t('skill.sqlite3'), color: '#003b57' },
        { icon: SiPython, label: t('skill.python'), color: '#3776ab' },
        { icon: SiFlask, label: t('skill.flask'), color: '#0074D9' },
        { icon: SiTailwindcss, label: t('skill.tailwind'), color: '#4C51BF' }
    ];

    return (
        <div className="py-4 rounded-lg">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">{t('skill.title')}</h2>
            <div className="max-w-[150px] tm:max-w-xs md:max-w-xl lg:max-w-7xl max-auto grid grid-cols-1 tm:grid-cols-2 md:grid-cols-5 gap-4">
                {skills.map((skill, index) => (
                    <SkillItem key={index} icon={skill.icon} label={skill.label} color={skill.color} />
                ))}
            </div>
        </div>
    );
};

export default MySkills;