import React from 'react';
import ncea from '../doc/ncea';

const RankScore: React.FC = () => {
    // Extract all assessments as a flat array
    const allAssessments = Object.values(ncea).flatMap((assessments) => Object.values(assessments));

    // Filter and sort assessments based on level and achievement
    const level3Assessments = allAssessments.filter((assessment) => parseInt(assessment.credits, 10) >= 3);
    const sortedAssessments = level3Assessments.sort((a, b) => {
        const achievementValue: { [key: string]: number } = { "Achieved": 2, "Merit": 3, "Excellence": 4 };
        return achievementValue[b.achievement] - achievementValue[a.achievement];
    }).slice(0, 5);

    // Calculate total rank score from best 80 credits (weighted by achievement)
    const maxCredits = 80;
    let totalRankScore = 0;
    let creditsCount = 0;

    for (const assessment of sortedAssessments) {
        const credits = parseInt(assessment.credits, 10);
        const points = { "Achieved": 2, "Merit": 3, "Excellence": 4 }[assessment.achievement];

        if (creditsCount + credits <= maxCredits) {
            totalRankScore += credits * (points ?? 0);
            creditsCount += credits;
        } else {
            const remainingCredits = maxCredits - creditsCount;
            totalRankScore += remainingCredits * (points ?? 0);
            break;
        }
    }

    return (
        totalRankScore
    );
};

export default RankScore;