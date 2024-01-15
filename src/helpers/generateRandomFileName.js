const generateRandomFileName = () => {
    const alphanumeric =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let filename = "";
  
    for (let i = 0; i < 8; i++) {
      filename += alphanumeric.charAt(
        Math.floor(Math.random() * alphanumeric.length)
      );
    }
  
    return filename;
  };
  
  export default generateRandomFileName;