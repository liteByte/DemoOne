export default {

  validateEmail(value) {
    if (value === "")
      return "Field can't be empty";

    const r = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (r.test(value) === false)
      return "Email invalid";

    return null;
  },

  validateName(value) {
    if (value === "")
      return "Field can't be empty";

    if (!value.replace(/\s/g, '').length)
      return "That's not a valid name.";

    if (value.length > 50)
      return "It must be shorter than 50 characters";

    return null;
  },

  validateDoc(value) {
    if (value === "")
      return "Field can't be empty";

    if (!this.isInt(value))
      return "It must be a number";

    if (value.length > 8)
      return "It must be equal or shorter than 8 characters";

    return null;
  },

  isInt(value) {
    return !isNaN(parseInt(value, 10));
  }
}
