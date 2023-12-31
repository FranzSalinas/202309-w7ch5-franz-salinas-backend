export interface Repository<X extends { id: unknown }> {
  getAll(): Promise<X[]>;
  getById(_id: X['id']): Promise<X>;
  search({ key, value }: { key: keyof X; value: unknown }): Promise<X[]>;
  create(_newItem: Omit<X, 'id'>): Promise<X>;
  update(_id: X['id'], _updatedItem: Partial<X>): Promise<X>;
  addFriend(_friendId: X['id'], _userId: X['id']): Promise<X>;
  addEnemy(_enemyId: X['id'], _userId: X['id']): Promise<X>;
  delete(_id: X['id']): Promise<void>;
  removeFriend(_id: X['id'], _friendIdToRemove: Partial<X>): Promise<X>;
}

// Qué entidad va a manejar? Dónde las va a manejar?
