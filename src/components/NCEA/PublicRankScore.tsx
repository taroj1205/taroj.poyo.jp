import React, { useState, useEffect, useRef } from 'react';

interface Subject {
    subject: string;
    standardNumber: string;
    name: string;
    credits: string;
    achievement: string;
    [key: string]: string;
}

const calculateRankScore = (subjectData: Subject) => {
    const credits = parseInt(subjectData.credits);
    const achievement = subjectData.achievement;

    return achievement === 'Excellence' ? credits * 4 :
        achievement === 'Merit' ? credits * 3 :
            achievement === 'Achieved' ? credits * 2 : 0;
};

const calculateSpecificRankScore = (achievement: string, credits: number) => {
    return achievement === 'Excellence' ? credits * 4 :
        achievement === 'Merit' ? credits * 3 :
            achievement === 'Achieved' ? credits * 2 : 0;
};

const RankScore: React.FC<{ subjects: Subject[] }> = ({ subjects }) => {
    const rankScores: { [key: string]: number } = {};

    subjects.forEach((subject) => {
        const rankScore = calculateRankScore(subject);
        rankScores[subject.subject] = (rankScores[subject.subject] || 0) + rankScore;
    });

    console.log(rankScores);

    // Find the top 5 subjects with the highest rank scores
    const topSubjects = Object.keys(rankScores)
        .sort((a, b) => rankScores[b] - rankScores[a])
        .slice(0, 5);

    const topSubjectsData = subjects
        .filter(subject => topSubjects.includes(subject.subject)) // Filter subjects that are in the topSubjects list
        .sort((a, b) => {
            const achievementOrder: { [key: string]: number } = {
                'Excellence': 0,
                'Merit': 1,
                'Achieved': 2,
                'Not Achieved': 3
            };

            return achievementOrder[a.achievement] - achievementOrder[b.achievement];
        });

    // Calculate the total rank score for the top subjects while considering a maximum of 80 credits
    let totalTopRankScore = 0;
    let totalCredits = 0;

    console.log('Subject data:', topSubjectsData);

    // Iterate through subjectData and add credits to the total
    topSubjectsData.forEach((data) => {
        const isFirstDigit3 = data.standardNumber.charAt(0) === '3';
        if (totalCredits < 80 && isFirstDigit3) {
            const credits = parseInt(data.credits);
            const achievement = data.achievement;
            // Check if adding these credits would exceed the maximum of 80 credits
            if (totalCredits + credits <= 80) {
                const rankScore = calculateSpecificRankScore(achievement, credits);
                totalTopRankScore += rankScore;
                totalCredits += credits;
            } else {
                // Calculate the remaining credits that can be added to stay within the 80-credit limit
                let remainingCredits = 80 - totalCredits;

                if (remainingCredits > 0) {
                    console.log(achievement);
                    const creditsForLevel = Math.min(parseInt(data.credits), remainingCredits);
                    const rankScore = calculateSpecificRankScore(achievement, creditsForLevel);
                    totalTopRankScore += rankScore;
                    totalCredits += creditsForLevel;

                    console.log(`Adding ${creditsForLevel} credits for subject '${data.subject}' with ${achievement} credits, rank score ${rankScore}`);
                    remainingCredits -= creditsForLevel;
                }

                return;
            }
        }
    });

    console.log("Total Credits:", totalCredits);
    console.log("Total Top Rank Score:", totalTopRankScore);

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
            const duration = 2000; // 2 seconds
            const increment = Math.ceil(totalTopRankScore / (duration / 10)); // Calculate increment based on the desired duration

            const interval = setInterval(() => {
                setScore((prevScore) => {
                    const newScore = prevScore + increment;
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