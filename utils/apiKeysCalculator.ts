export type ApiKeysCalculatorInput = {
  requestsPerMonth: number; // Max requests per API key per month
  operationInterval: number; // Interval in minutes (e.g., every 1 min, 5 min, etc.)
  availableKeys?: number; // Optional: Number of API keys available

  // Either provide `requestsPerOperation` OR (`limitReachedInDays` + `knownInterval`)
  requestsPerOperation?: number;
  limitReachedInDays?: number; // Number of days API key lasted at `knownInterval`
  knownInterval?: number; // Interval in minutes at which API key lasted `limitReachedInDays`
};

export type ApiKeysCalculatorOutput = {
  requiredKeys: number; // Number of API keys needed for continuous operation
  daysBeforeLimit: number; // How many days 1 API key will last
  newInterval?: number; // New interval if availableKeys is provided
  calculatedRequestsPerOperation?: number; // If derived from `limitReachedInDays`
};

function apiKeysCalculator(
  input: ApiKeysCalculatorInput
): ApiKeysCalculatorOutput {
  const {
    requestsPerMonth,
    operationInterval,
    availableKeys,
    requestsPerOperation,
    limitReachedInDays,
    knownInterval,
  } = input;
  const minutesInAMonth = 30 * 24 * 60; // Assuming 30 days in a month

  let calculatedRequestsPerOperation = requestsPerOperation;

  if (!requestsPerOperation && limitReachedInDays && knownInterval) {
    // Derive requests per operation
    const totalRequestsPerKey = requestsPerMonth / limitReachedInDays;
    const operationsPerDay = (24 * 60) / knownInterval;
    calculatedRequestsPerOperation = totalRequestsPerKey / operationsPerDay;
  }

  if (!calculatedRequestsPerOperation) {
    throw new Error(
      "Insufficient data: Provide either requestsPerOperation or (limitReachedInDays & knownInterval)"
    );
  }

  // Calculate operations per day
  const operationsPerDay = (24 * 60) / operationInterval;

  // Total requests used per day
  const dailyRequestUsage = operationsPerDay * calculatedRequestsPerOperation;

  // Days before a single API key reaches its limit
  const daysBeforeLimit = Math.floor(requestsPerMonth / dailyRequestUsage);

  // Total operations per month
  const totalOperationsPerMonth = minutesInAMonth / operationInterval;

  // Total requests needed per month
  const totalRequestsNeeded =
    totalOperationsPerMonth * calculatedRequestsPerOperation;

  // Number of API keys required
  const requiredKeys = Math.ceil(totalRequestsNeeded / requestsPerMonth);

  if (availableKeys) {
    // If user provides available API keys, calculate the new possible interval
    const maxOperations =
      (availableKeys * requestsPerMonth) / calculatedRequestsPerOperation;
    const newInterval = minutesInAMonth / maxOperations;
    return {
      requiredKeys,
      daysBeforeLimit,
      newInterval: Math.ceil(newInterval), // Rounds to nearest whole minute
      calculatedRequestsPerOperation,
    };
  }

  return { requiredKeys, daysBeforeLimit, calculatedRequestsPerOperation };
}

// // Example Usage:

// // Scenario 1: User knows `requestsPerOperation`
// console.log(
//   apiKeysCalculator({
//     requestsPerMonth: 100000,
//     requestsPerOperation: 5,
//     operationInterval: 10,
//     availableKeys: 3,
//   })
// );

// // Scenario 2: User does not know `requestsPerOperation`, but knows API key lasted `15 days` at a `20-minute` interval
// console.log(
//   apiKeysCalculator({
//     requestsPerMonth: 100000,
//     operationInterval: 10,
//     limitReachedInDays: 15,
//     knownInterval: 20,
//     availableKeys: 3,
//   })
// );

export default apiKeysCalculator;
