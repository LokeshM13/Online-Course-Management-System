export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, _req, res, _next) {
  if (error.name === "ValidationError") {
    return res.status(400).json({ message: error.message });
  }
  if (error.name === "CastError") {
    return res.status(400).json({ message: "The requested identifier is invalid." });
  }
  if (error.code === 11000) {
    return res.status(409).json({ message: "A record with these details already exists." });
  }
  console.error(error);
  res.status(error.status || 500).json({ message: error.status ? error.message : "An unexpected server error occurred." });
}
