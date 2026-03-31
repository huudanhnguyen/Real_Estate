const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.error("⚠️  Error:", err);
      res.status(400).json({ message: err.message });
    });
  };
};

module.exports = asyncHandler;
