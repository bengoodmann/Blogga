
const validator = (name, email, password) => {
  const emailRegex = /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,3}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  if (!name) {
    return "Please enter your name";
  } else if (!email) {
    return "Please enter your email";
  } else if (!password) {
    return "Please enter your password";
  }
  if (!emailRegex.test(email)) {
    return "Invalid email format.";
  }
  if (!passwordRegex.test(password)) {
    return "Invalid password format";
  }
  return null;
};

const loginValidate = (email, password) => {
     if (!email) {
       return "Email is required to log in";
     }
     if (!password) {
       return "You can't log in without a password";
     }
     if (!(email && password)) {
       return "Enter your email and password";
     }

     return null
}

module.exports = {validator, loginValidate}