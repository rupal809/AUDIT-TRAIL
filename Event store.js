const Event = require('../models/Event');

class ConcurrencyError extends Error {
constructor(aggregateId, expectedVersion) {
super(
"Concurrency conflict on aggregate "${aggregateId}": expected version ${expectedVersion} is no longer current."
);
this.name = 'ConcurrencyError';
this.aggregateId = aggregateId;
this.expectedVersion = expectedVersion;
}
}

async function appendEvent({
aggregateId,
aggregateType,
eventType,
payload,
expectedVersion,
metadata = {},
}) {
if (!aggregateId || !aggregateType || !eventType) {
throw new Error('aggregateId, aggregateType, and eventType are required.');
}

if (typeof expectedVersion !== 'number' || expectedVersion < 0) {
throw new Error('expectedVersion must be a non-negative number.');
}

const nextVersion = expectedVersion + 1;

try {
return await Event.create({
aggregateId,
aggregateType,
eventType,
version: nextVersion,
payload,
metadata,
});
} catch (err) {
if (err.code === 11000) {
throw new ConcurrencyError(aggregateId, expectedVersion);
}
throw err;
}
}

async function getEventStream(aggregateId, { fromVersion = 0 } = {}) {
return Event.find({
aggregateId,
version: { $gt: fromVersion },
})
.sort({ version: 1 })
.lean();
}

async function getCurrentVersion(aggregateId) {
const latest = await Event.findOne({ aggregateId })
.sort({ version: -1 })
.lean();

return latest ? latest.version : 0;
}

async function replay(aggregateId, reducer, initialState = {}) {
const events = await getEventStream(aggregateId);
return events.reduce(reducer, initialState);
}

module.exports = {
appendEvent,
getEventStream,
getCurrentVersion,
replay,
ConcurrencyError,
};
