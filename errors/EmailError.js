class EmailError extends Error {
  constructor(message) {
    super(message);
    this.name = 'EmailError';
    this.statusCode = 409;
  }
}

module.exports = EmailError;
