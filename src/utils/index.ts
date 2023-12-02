import { User } from "../types/user";

export const formatUser = (user: User) => {
    const formatedUser = {
        email: user.email,
        collections: user.collections,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        id: user._id
    }

    return formatedUser
}