const pagination = (req, res, next) => {
    const { page = 1, pageSize = 10 } = req.query;
  
    req.pagination = {
      skip: (parseInt(page) - 1) * parseInt(pageSize),
      take: parseInt(pageSize),
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    };
  
    next();
  };
  
  module.exports = pagination;