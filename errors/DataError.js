class DataError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DataError';
    this.statusCode = 400;
  }
}

module.exports = DataError;
