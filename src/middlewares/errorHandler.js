const errorHandler = (err, req, res, next) => {
    res.status(500).json({ error: "เซิร์ฟเวอร์เกิดข้อผิดพลาด" });
  };
  
  module.exports = errorHandler;