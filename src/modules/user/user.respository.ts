import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

// @EntityRepository(User)
export class UserRepository extends Repository<User> {
  // Add custom methods for user-specific operations here if needed.
}
