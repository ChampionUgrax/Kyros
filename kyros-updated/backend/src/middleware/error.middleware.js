const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error?.name === "MulterError") {
    const tooLarge = error.code === "LIMIT_FILE_SIZE";
    return res.status(tooLarge ? 413 : 400).json({
      success: false,
      message: tooLarge
        ? "This file is larger than the 10 MB upload limit. Choose a smaller PDF or TXT file."
        : "The file upload could not be processed. Try selecting the file again.",
    });
  }

  const statusCode =
    Number.isInteger(error.statusCode) && error.statusCode >= 400
      ? error.statusCode
      : 500;

  return res.status(statusCode).json({
    success: false,
    message:
      statusCode >= 500
        ? (error.publicMessage || "The server could not complete this request. Check the backend terminal for details.")
        : error.message || "Request failed",
  });
};

module.exports = errorHandler;
