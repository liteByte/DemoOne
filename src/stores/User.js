import Store from "./Store";
import Login from "./Login";

let instance = null;

class User extends Store {

  users = [
    {
      "user_id": 1,
      "document_type": "DNI",
      "document_number": "54622706",
      "name": "Robert",
      "last_name": "Smithson",
      "email": "robrob@email.com",
      "roles": [{"name": "Administrator", "role_id": "1"}]
    },
    {
      "user_id": 2,
      "document_type": "DNI",
      "document_number": "39957598",
      "name": "Ed",
      "last_name": "Williams",
      "email": "edwilliams@email.com",
      "roles": [{"name": "Operator", "role_id": "2"}]
    },
    {
      "user_id": 3,
      "document_type": "DNI",
      "document_number": "25772425",
      "name": "Hunt",
      "last_name": "Wilkins",
      "email": "wilkins32@quintity.name",
      "roles": [{"name": "Administrator", "role_id": "1"}]
    },
    {
      "user_id": 4,
      "document_type": "DNI",
      "document_number": "76067999",
      "name": "Maryann",
      "last_name": "Arnold",
      "email": "maryann.arnold@biohab.biz",
      "roles": [{"name": "Administrator", "role_id": "1"}]
    },
    {
      "user_id": 5,
      "document_type": "DNI",
      "document_number": "39506271",
      "name": "Britney",
      "last_name": "Crawford",
      "email": "bcrawford@waretel.com",
      "roles": [{"name": "Administrator", "role_id": "1"}]
    },
    {
      "user_id": 6,
      "document_type": "DNI",
      "document_number": "89997456",
      "name": "Silva",
      "last_name": "Marshall",
      "email": "silvam@exovent.co.uk",
      "roles": [{"name": "Administrator", "role_id": "1"}]
    },
    {
      "user_id": 7,
      "document_type": "DNI",
      "document_number": "47125537",
      "name": "Lott",
      "last_name": "Bradford",
      "email": "lott.bradford@automon.biz",
      "roles": [{"name": "Administrator", "role_id": "1"}]
    },
    {
      "user_id": 8,
      "document_type": "DNI",
      "document_number": "39000052",
      "name": "Sherman",
      "last_name": "Guy",
      "email": "shermanguy@gaptec.me",
      "roles": [{"name": "Administrator", "role_id": "1"}]
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

    let user = this.users.find(user => id === user.user_id);
    if (!user)
      return Store.error(404, "User not found");

    return Store.send(200, user);
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

  deleteUser(token, id) {
    if (!Login.validateToken(token))
      return Store.error(401, "Token invalid");

    let user = this.users.findIndex(user => id === user.user_id);
    if (user === -1)
      return Store.error(404, "User not found");

    this.users.splice(user, 1);

    return Store.send(200);
  }

}

function getInstance() {
  if (instance === null)
    instance = new User();
  return instance;
}

export default getInstance();
