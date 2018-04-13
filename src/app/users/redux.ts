import * as _ from 'lodash';

import { User } from './user';

// ACTIONS

export interface UserAction {
  type: string;
  user?: User;
  users?: User[];
}

export const addUser = (user: User) => {
  return {
    type: 'ADD_USER',
    user
  };
};

export const updateUser = (user: User) => {
  return {
    type: 'UPDATE_USER',
    user
  };
};

export const removeUser = (user: User) => {
  return {
    type: 'REMOVE_USER',
    user
  };
};

export const initUsers = (users: User[]) => {
  return {
    type: 'INIT_USERS',
    users
  };
};

// REDUCERS

export const usersReducers = (users: User[] = [], action: UserAction) => {
  switch (action.type) {
    case 'ADD_USER':
      return [
        ...users,
        action.user
      ];

    case 'UPDATE_USER':
      return users.map((user: User) => {
        if (user.id === action.user.id) {
          return _.assign({}, user, action.user);
        } else {
          return user;
        }
      });

    case 'REMOVE_USER':
      return _.filter(users, function(user: User) {
          return user.id !== action.user.id;
      });

    case 'INIT_USERS':
      return action.users;

    default:
      return users;
  };

};
