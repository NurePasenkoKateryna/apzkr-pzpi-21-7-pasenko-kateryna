function cleanAndSplitValue(value) {
    if (!value) {
        return { error: 'Value property is missing in the payload' };
    }

    const cleanedValue = value.replace(/"/g, '');
    const values = cleanedValue.split('-');

    if (values.length !== 3) {
        return { error: 'Incorrect number of values in the payload' };
    }

    return {
        userId: values[0].trim(),
        eventId: values[1].trim(),
        seatId: values[2].trim()
    };
}

module.exports = cleanAndSplitValue;
