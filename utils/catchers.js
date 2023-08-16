const catchAsync = function (fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((e) => next(e));
  };
};

const catchSync = function (fn) {
  return function (req, res, next) {
    try {
      fn(req, res, next);
    } catch (error) {
      throw error;
    }
  };
};

module.exports = { catchAsync, catchSync };
