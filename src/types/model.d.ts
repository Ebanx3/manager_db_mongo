export interface Model {
    static async create: ({ element: object }) => void;
    static async getAll: () => void;
}