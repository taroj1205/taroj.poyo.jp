import React, { useState, useEffect, useRef } from 'react';
import ncea from '../doc/ncea';

interface SubjectData {
    [key: string]: {
        credits: string;
        achievement: string;
    };
}

const calculateRankScore = (subjectData: SubjectData) => {
    let achievedCredits = 0;
    let meritCredits = 0;
    let excellenceCredits = 0;

    for (const assessment in subjectData) {
        const credits = parseInt(subjectData[assessment].credits);
        const achievement = subjectData[assessment].achievement;

        if (achievement === "Achieved") {
            achievedCredits += credits;
        } else if (achievement === "Merit") {
            meritCredits += credits;
        } else if (achievement === "Excellence") {
            excellenceCredits += credits;
        }
    }

    const rankScore = 2 * achievedCredits + 3 * meritCredits + 4 * excellenceCredits;
    return rankScore;
};

const RankScore = () => {
    const rankScores: { [key: string]: number } = {};

    for (const subject in ncea) {
        const subjectData = ncea[subject];
        const rankScore = calculateRankScore(subjectData);
        rankScores[subject] = rankScore;
    }

    // Find the top 5 subjects with the highest rank scores
    const topSubjects = Object.keys(rankScores)
        .sort((a, b) => rankScores[b] - rankScores[a])
        .slice(0, 5);

    // Calculate the total rank score for the top subjects
    const totalTopRankScore = topSubjects.reduce((total, subject) => total + rankScores[subject], 0);

    const [score, setScore] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting);
        });

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    useEffect(() => {
        if (isVisible) {
            const interval = setInterval(() => {
                setScore((prevScore) => {
                    const newScore = prevScore + 1;
                    return newScore > totalTopRankScore ? totalTopRankScore : newScore;
                });
            }, 10);

            return () => clearInterval(interval);
        }
    }, [isVisible, totalTopRankScore]);

    return (
        <span ref={ref}>{score}</span>
    );
};

export default RankScore;