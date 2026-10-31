const validateRequest = (schema, location = "body") => (req, res, next) => {
  const result = schema.safeParse(req[location]);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid request data",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  req[location] = result.data;
  return next();
};

module.exports = validateRequest;
