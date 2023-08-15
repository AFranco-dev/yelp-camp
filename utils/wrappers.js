const wrapAsync = function (fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((e) => next(e));
  };
};

const wrapSync = function (fn) {
  return function (req, res, next) {
    try {
      fn(req, res, next);
    } catch (error) {
      throw error;
    }
  };
};

module.exports = { wrapAsync, wrapSync };
