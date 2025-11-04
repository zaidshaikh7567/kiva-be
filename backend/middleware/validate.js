const validate = (schema, type = 'body') => {
  return (req, res, next) => {
    try {
      const source = req[type];
      if (!source) {
        throw new Error(`Invalid source: ${type} not found on request`);
      }
      req[type] = schema.parse(source);
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = validate;
