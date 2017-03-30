import Store from "./Store";
import Login from "./Login";

let instance = null;

class User extends Store {

  users = [
    {
      "user_id": 1,
      "document_type": "DNI",
      "document_number": "1234567",
      "name": "Robert",
      "last_name": "Smithson",
      "email": "robrob@email.com",
      "roles": [{"name": "Administrator", "role_id": "1"}]
    },
    {
      "user_id": 2,
      "document_type": "DNI",
      "document_number": "12345678",
      "name": "Ed",
      "last_name": "Williams",
      "email": "edwilliams@email.com",
      "roles": [{"name": "Operator", "role_id": "2"}]
    }
  ];

  roles = [
    {
      "role_id": "1",
      "name": "Administrator",
      "permissions": [
        {"name": "ABMusuarios", "permission_id": "1"},
        {"name": "ABMbancos", "permission_id": "2"},
        {"name": "ABMespecialidades", "permission_id": "3"},
        {"name": "ABMobrassociales", "permission_id": "4"},
        {"name": "ABMprofesionales", "permission_id": "5"},
        {"name": "ABMcontactos", "permission_id": "6"},
        {"name": "ABMcoverages", "permission_id": "7"},
        {"name": "ABMnomenclador", "permission_id": "8"}
      ]
    },
    {
      "role_id": "2",
      "name": "Operator",
      "permissions": [
        {"name": "ABMusuarios", "permission_id": "1"},
        {"name": "ABMbancos", "permission_id": "2"}
      ]
    },
    {
      "role_id": "3",
      "name": "Manager",
      "permissions": []
    },
    {
      "role_id": "4",
      "name": "Professional",
      "permissions": []
    }
  ];

  get(token) {
    if (!Login.validateToken(token))
      return Store.error(401, "Token invalid");

    return Store.send(200, this.users);
  }

  post(token, data) {
    if (!Login.validateToken(token))
      return Store.error(401, "Token invalid");

    let user = data;
    user.user_id = this.users.length + 1;

    this.users.push(user);
    return Store.send(201);
  }

  getUser(token, id) {
    if (!Login.validateToken(token))
      return Store.error(401, "Token invalid");

    return Store.send(200, this.users.find(user => id === user.user_id));
  }

  getRoles(token) {
    if (!Login.validateToken(token))
      return Store.error(401, "Token invalid");

    return Store.send(200, this.roles);
  }

  putUser(token, id, data) {
    if (!Login.validateToken(token))
      return Store.error(401, "Token invalid");

    let user = this.users.find(user => id === user.user_id);
    if (!user)
      return Store.error(404, "User not found");

    user = data;
    user.user_id = id;

    return Store.send(200);
  }

}

function getInstance() {
  if (instance === null)
    instance = new User();
  return instance;
}

export default getInstance();
