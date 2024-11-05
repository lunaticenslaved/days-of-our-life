interface User {
  id: string;
}

export const UserService = {
  getById(_userId: string) {
    return Promise.resolve(undefined);
  },

  getByAccessToken(_token: string): Promise<User | undefined> {
    return Promise.resolve(undefined);
  },
};
