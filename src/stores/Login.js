import Store from "./Store";

export default class Login extends Store {

  post(username, password) {
    if (username !== "demo" || password !== "demo")
      return Store.error(401, "Username or password invalid");

    return Store.send(200, {
      token: "completelyValidToken",
      name: "Demo User"
    });
  }

}
