// Wraps an async route handler so that a rejected promise is passed to next()
// instead of becoming an unhandled rejection (Express 4 doesn't catch these
// by itself, and Node exits the process on an unhandled rejection).
function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Route not found
function notFound(req, res) {
  res.status(404).json({ error: "Not found" });
}

// Central error handler: must have 4 arguments to be treated as one by Express
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // malformed JSON body
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON" });
  }
  // invalid ObjectId and similar
  if (err.name === "CastError" || err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  // duplicate key (unique index)
  if (err.code === 11000) {
    return res.status(409).json({ error: "Already exists" });
  }
  console.error(err);
  return res.status(500).json({ error: "Internal server error" });
}

module.exports = { asyncHandler, notFound, errorHandler };
