module.exports = (req, res) => {
  res.status(200).json({ 
    message: "Connection Successful!", 
    note: "If you see this, the 404 is fixed. Now we can add MongoDB back." 
  });
};
