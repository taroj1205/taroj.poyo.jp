import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';

interface Subject {
    subject: string;
    standardNumber: string;
    name: string;
    credits: string;
    achievement: string;
    [key: string]: string;
}

const Graph: React.FC<{ data: Subject[] }> = ({ data }) => {
    const { theme } = useTheme();
    const pieChartRef = useRef<Chart | null>(null);
    const pieBarChartRef = useRef<Chart | null>(null);
    const barChartRef = useRef<Chart | null>(null);
    const { t, i18n } = useTranslation();

    console.log(data);
    if (data) {
        useEffect(() => {
            // Combine subjects with the same name and calculate total rank score
            const groupedData: { subject: string; totalRankScore: number }[] = [];
            data.forEach((subject) => {
                // Check if the first digit of the standard number is "3"
                const isFirstDigit3 = subject.standardNumber.charAt(0) === '3';

                // Only include subjects with standard numbers starting with "3" in rank score calculation
                if (isFirstDigit3) {
                    const existingSubject = groupedData.find((item) => item.subject === subject.subject);
                    const rankScore = subject.achievement === 'Achieved' ? parseInt(subject.credits, 10) * 2 :
                        subject.achievement === 'Merit' ? parseInt(subject.credits, 10) * 3 :
                            subject.achievement === 'Excellence' ? parseInt(subject.credits, 10) * 4 : 0;
                    if (existingSubject) {
                        existingSubject.totalRankScore += rankScore;
                    } else {
                        groupedData.push({ subject: subject.subject, totalRankScore: rankScore });
                    }
                }
            });

            groupedData.sort((a, b) => b.totalRankScore - a.totalRankScore);

            // Prepare data for pie and bar chart
            const rankCredits = {
                Achieved: 0,
                Merit: 0,
                Excellence: 0,
            };
            data.forEach((subject) => {
                const credits = parseInt(subject.credits, 10);
                if (subject.achievement === 'Achieved') {
                    rankCredits.Achieved += credits;
                } else if (subject.achievement === 'Merit') {
                    rankCredits.Merit += credits;
                } else if (subject.achievement === 'Excellence') {
                    rankCredits.Excellence += credits;
                }
            });

            if (pieChartRef.current) {
                pieChartRef.current.destroy();
            }
            if (pieBarChartRef.current) {
                pieBarChartRef.current.destroy();
            }
            if (barChartRef.current) {
                barChartRef.current.destroy();
            }

            const ctxPie = document.getElementById('rankScorePieChart') as HTMLCanvasElement;
            const rankScorePieChart = new Chart(ctxPie, {
                type: 'pie',
                data: {
                    labels: groupedData.map((subject) => subject.subject),
                    datasets: [
                        {
                            label: 'Rank Scores',
                            data: groupedData.map((subject) => subject.totalRankScore),
                            backgroundColor: [
                                '#FF6384',
                                '#36A2EB',
                                '#FFCE56',
                                '#4BC0C0',
                                '#9966FF',
                            ],
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom',
                            labels: {
                                font: {
                                    family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                                    size: 13,
                                },
                                color: theme === 'dark' ? '#fff' : '#000',
                            },
                        },
                        title: {
                            display: true,
                            text: i18n.language === 'ja' ? 'ランクスコア' : 'Rank Score',
                            font: {
                                family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                                size: 16,
                                weight: 'bold',
                            },
                            color: theme === 'dark' ? '#fff' : '#000',
                        },
                    },
                    maintainAspectRatio: false,
                }
            });

            const ctxPieBar = document.getElementById('rankCreditsPieBarChart') as HTMLCanvasElement;
            const rankCreditsPieBarChart = new Chart(ctxPieBar, {
                type: 'pie',
                data: {
                    labels: Object.keys(rankCredits),
                    datasets: [
                        {
                            label: 'Credits',
                            data: Object.values(rankCredits),
                            backgroundColor: [
                                '#FF6384',
                                '#36A2EB',
                                '#FFCE56',
                            ],
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom',
                            labels: {
                                font: {
                                    family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                                    size: 13,
                                },
                                color: theme === 'dark' ? '#fff' : '#000',
                            },
                        },
                        title: {
                            display: true,
                            text: i18n.language === 'ja' ? 'クレジット' : 'Credits',
                            font: {
                                family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                                size: 16,
                                weight: 'bold',
                            },
                            color: theme === 'dark' ? '#fff' : '#000',
                        },
                    },
                    maintainAspectRatio: false,
                },
            });


            const ctxBar = document.getElementById('rankCreditsBarChart') as HTMLCanvasElement;
            const rankCreditsBarChart = new Chart(ctxBar, {
                type: 'bar',
                data: {
                    labels: Object.keys(rankCredits),
                    datasets: [
                        {
                            label: 'Credits',
                            data: Object.values(rankCredits),
                            backgroundColor: [
                                '#FF6384',
                                '#36A2EB',
                                '#FFCE56',
                            ],
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    indexAxis: 'y',
                    plugins: {
                        legend: {
                            display: false,
                        },
                        title: {
                            display: true,
                            text: i18n.language === 'ja' ? 'クレジット' : 'Credits',
                            font: {
                                family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                                size: 16,
                                weight: 'bold',
                            },
                            color: theme === 'dark' ? '#fff' : '#000',
                        },
                    },
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            ticks: {
                                font: {
                                    family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                                    size: 13,
                                },
                                color: theme === 'dark' ? '#fff' : '#000',
                            },
                            grid: {
                                color: theme === 'dark' ? '#c4c4c4' : '#e5e5e5',
                            },
                        },
                        x: {
                            ticks: {
                                font: {
                                    family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                                    size: 13,
                                },
                            },
                            grid: {
                                color: theme === 'dark' ? '#c4c4c4' : '#e5e5e5',
                            },
                        },
                    },
                },
            });

            pieChartRef.current = rankScorePieChart as Chart;
            pieBarChartRef.current = rankCreditsPieBarChart as Chart;
            barChartRef.current = rankCreditsBarChart as Chart;
        }, [theme, i18n.language, data]);

        return (
            <div className="w-full py-4 flex flex-wrap justify-center gap-4 md:gap-0 lg:gap-4">
                <div className='max-w-7xl w-fit'>
                    <canvas id="rankScorePieChart"></canvas>
                </div>
                <div className='max-w-6xl w-fit'>
                    <canvas id="rankCreditsPieBarChart"></canvas>
                </div>
                <div className='max-w-5xl w-fit ml-0 mr-2'>
                    <canvas id="rankCreditsBarChart"></canvas>
                </div>
            </div>
        );
    } else {
        return null
    }
};

export default Graph;
