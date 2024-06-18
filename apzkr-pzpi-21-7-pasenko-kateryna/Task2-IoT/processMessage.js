const cleanAndSplitValue = require('./cleanAndSplitValue');

function processMessage(msg) {
    if (msg.payload && msg.payload.value) {
        const data = cleanAndSplitValue(msg.payload.value);

        msg.payload = data;
        return msg;
    } else {
        msg.payload = { error: 'Value property is missing in the payload' };
        return msg;
    }
}

module.exports = processMessage;
