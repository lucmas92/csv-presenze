// types/database.types.ts
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: number
                    name: string
                    username: string
                    password_hash: string
                    role: string
                    is_active: boolean
                    last_login_at: string | null
                }
                Insert: {
                    id?: number
                    name: string
                    username: string
                    password_hash: string
                    role: string
                    is_active?: boolean
                    last_login_at?: string | null
                }
                Update: {
                    id?: number
                    name?: string
                    username?: string
                    password_hash?: string
                    role?: string
                    is_active?: boolean
                    last_login_at?: string | null
                }
            }
            presences: {
                Row: {
                    id: number
                    user_id: number
                    date: string
                    status: string
                    is_in_meeting: boolean
                    is_eating_out: boolean
                }
                Insert: {
                    id?: number
                    user_id: number
                    date: string
                    status: string
                    is_in_meeting?: boolean
                    is_eating_out?: boolean
                }
                Update: {
                    id?: number
                    user_id?: number
                    date?: string
                    status?: string
                    is_in_meeting?: boolean
                    is_eating_out?: boolean
                }
            },
            user_favorites: {
                Row: {
                    id?: number
                    user_id: number
                    favorite_user_id: number
                    created_at?: string
                }
                Insert: {
                    id?: number
                    user_id: number
                    favorite_user_id: number
                    created_at?: string
                }
                Update: {
                    id?: number
                    user_id?: number
                    favorite_user_id?: number
                    created_at?: string
                }
            }
        }
    }
}