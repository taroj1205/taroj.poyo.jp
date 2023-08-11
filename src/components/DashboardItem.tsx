import React from 'react';
import { IconType } from 'react-icons';
import PropTypes from 'prop-types';

const DashboardItem = ({ label, icon: Icon, color }: { label: string; icon: IconType; color: string }) => {
    return (
        <div
            className={`bg-${color}-500 p-6 rounded-lg shadow-lg text-center`}
        >
            <div className="text-3xl text-white">
                <Icon />
            </div>
            <h3 className="text-lg text-white mt-4">{label}</h3>
        </div>
    );
};

DashboardItem.propTypes = {
    label: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    color: PropTypes.string.isRequired,
};

export default DashboardItem;
