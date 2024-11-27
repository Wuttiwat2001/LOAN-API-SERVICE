const errorHandler = (err, req, res, next) => {
    res.status(500).json({ error: "เซิร์ฟเวอร์เกิดข้อผิดพลาดโปรดลองใหม่อีกครั้งภายหลัง" });
  };
  
  module.exports = errorHandler;