export declare function exclude<User, Key extends keyof User>(user: User, keys: Key[]): Omit<User, Key>;
