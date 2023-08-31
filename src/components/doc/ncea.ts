interface NceaData {
    [key: string]: {
        [key: string]: {
            assessment: string;
            credits: string;
            achievement: string;
        };
    };
}

const ncea: NceaData = {
    "Accounting": {
        "3.6": {
            "assessment": "Demonstrate understanding of a job cost subsystem for an entity",
            "credits": "4",
            "achievement": "Achieved"
        }
    },
    "English Visuals": {
        "3.9": {
            "assessment": "Respond critically to significant aspects of visual and/or oral text(s) through close reading, supported by evidence",
            "credits": "3",
            "achievement": "Merit"
        },
        "3.7": {
            "assessment": "Respond critically to significant connections across texts, supported by evidence",
            "credits": "4",
            "achievement": "Merit"
        }
    },
    "Calculus": {
        "3.15": {
            "assessment": "Apply systems of simultaneous equations in solving problems",
            "credits": "3",
            "achievement": "Excellence"
        },
        "3.3": {
            "assessment": "Apply trigonometric methods in solving problems",
            "credits": "4",
            "achievement": "Excellence"
        }
    },
    "Statistics": {
        "3.8": {
            "assessment": "Investigate time series data",
            "credits": "4",
            "achievement": "Merit"
        },
        "3.9": {
            "assessment": "Investigate bivariate measurement data",
            "credits": "4",
            "achievement": "Achieved"
        },
        "3.10": {
            "assessment": "Use statistical methods to make a formal inference",
            "credits": "4",
            "achievement": "Merit"
        }
    },
    "Physics": {
        "3.1": {
            "assessment": "Carry out a practical investigation to test a physics theory relating two variables in a non-linear relationship",
            "credits": "4",
            "achievement": "Achieved"
        }
    }
};

export default ncea;
