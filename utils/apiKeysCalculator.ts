export type ApiKeysCalculatorInput = {
  requestsPerMonth: number; // Max requests per API key per month
  operationInterval: number; // Interval in minutes (e.g., every 1 min, 5 min, etc.)
  availableKeys?: number; // Optional: Number of API keys available
  limitReachedInDays: number; // Number of days it takes to hit the API key limit at a known interval
  knownInterval: number; // The interval (in minutes) at which the API key lasted `limitReachedInDays`
};

export type ApiKeysCalculatorOutput = {
  requiredKeys: number; // Number of API keys needed for the given interval
  newInterval?: number; // New interval if availableKeys is provided
};

function apiKeysCalculator(
  input: ApiKeysCalculatorInput
): ApiKeysCalculatorOutput {
  const {
    requestsPerMonth,
    operationInterval,
    availableKeys,
    limitReachedInDays,
    knownInterval,
  } = input;
  const minutesInAMonth = 30 * 24 * 60; // Assuming 30 days in a month

  // Calculate operations per day at the known interval
  const knownOperationsPerDay = (24 * 60) / knownInterval;

  // Calculate requests per operation based on how long 1 API key lasted at the known interval
  const totalRequestsPerKey = requestsPerMonth / limitReachedInDays;
  const requestsPerOperation = totalRequestsPerKey / knownOperationsPerDay;

  // Calculate operations per month at the desired interval
  const operationsPerMonth = minutesInAMonth / operationInterval;

  // Total requests needed per month
  const totalRequestsNeeded = operationsPerMonth * requestsPerOperation;

  // Number of API keys required
  const requiredKeys = Math.ceil(totalRequestsNeeded / requestsPerMonth);

  if (availableKeys) {
    // If user provides available API keys, calculate the new interval
    const maxOperations =
      (availableKeys * requestsPerMonth) / requestsPerOperation;
    const newInterval = minutesInAMonth / maxOperations;
    return {
      requiredKeys,
      newInterval: Math.ceil(newInterval), // Rounds to nearest whole minute
    };
  }

  return { requiredKeys };
}

// // Example Usage:
// // Scenario 1: How many API keys are needed for a 1-minute interval?
// console.log(apiKeysCalculator({
//   requestsPerMonth: 10_000,
//   operationInterval: 1,
//   limitReachedInDays: 9, // API key lasted 9 days
//   knownInterval: 20 // At a 20-minute interval
// }));

// // Scenario 2: How often can I run operations with 12 API keys?
// console.log(apiKeysCalculator({
//   requestsPerMonth: 10_000,
//   operationInterval: 1,
//   limitReachedInDays: 9,
//   knownInterval: 20,
//   availableKeys: 12
// }));

export default apiKeysCalculator;
