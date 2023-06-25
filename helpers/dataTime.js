const formatNumber = value => {
    return value.toString().padStart(2, '0');
};

const getCurrentMonth = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = new Date().getFullYear();

    return `${currentYear}-${formatNumber(currentMonth)}-`;
};

module.exports = getCurrentMonth;
