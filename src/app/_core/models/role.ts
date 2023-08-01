export enum Role {    
    User = 'user',
    Admin = 'admin',
}

export const RoleGroup = {
    Admins: [
        Role.User, Role.Admin
    ],
    Users: [
        Role.User
    ]
}