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
  requiredKeys: number; // Number of API keys needed
  daysBeforeLimit: number; // How many days 1 API key will last
  newInterval?: number; // New interval if availableKeys is provided
  calculatedRequestsPerOperation?: number;
  apiKeyRotationInterval?: number; // How often to rotate API keys (in days)
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
  const minutesInAMonth = 30 * 24 * 60;

  let calculatedRequestsPerOperation = requestsPerOperation;

  if (!requestsPerOperation && limitReachedInDays && knownInterval) {
    const totalRequestsPerKey = requestsPerMonth / limitReachedInDays;
    const operationsPerDay = (24 * 60) / knownInterval;
    calculatedRequestsPerOperation = totalRequestsPerKey / operationsPerDay;
  }

  if (!calculatedRequestsPerOperation) {
    throw new Error(
      "Insufficient data: Provide either requestsPerOperation or (limitReachedInDays & knownInterval)"
    );
  }

  const operationsPerDay = (24 * 60) / operationInterval;
  const dailyRequestUsage = operationsPerDay * calculatedRequestsPerOperation;
  const daysBeforeLimit = Math.floor(requestsPerMonth / dailyRequestUsage);
  const totalOperationsPerMonth = minutesInAMonth / operationInterval;
  const totalRequestsNeeded =
    totalOperationsPerMonth * calculatedRequestsPerOperation;
  const requiredKeys = Math.ceil(totalRequestsNeeded / requestsPerMonth);

  // Ensure rotation makes all keys last a full month
  const apiKeyRotationInterval = availableKeys
    ? 30 / availableKeys // Rotate every X days to ensure full-month coverage
    : daysBeforeLimit / requiredKeys;

  if (availableKeys) {
    const maxOperations =
      (availableKeys * requestsPerMonth) / calculatedRequestsPerOperation;
    const newInterval = minutesInAMonth / maxOperations;
    return {
      requiredKeys,
      daysBeforeLimit,
      newInterval: Math.ceil(newInterval),
      calculatedRequestsPerOperation,
      apiKeyRotationInterval,
    };
  }

  return {
    requiredKeys,
    daysBeforeLimit,
    calculatedRequestsPerOperation,
    apiKeyRotationInterval,
  };
}

export default apiKeysCalculator;
