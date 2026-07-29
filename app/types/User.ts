export interface User {
    id: number,
    name: string,
    username: string,
    password_hash?: string,
    role: string,
    is_active: boolean,
    is_default_password?: boolean,
    last_login_at: Date,
}