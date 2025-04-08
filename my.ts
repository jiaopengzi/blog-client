// Original Enum
export enum AdminSideMenu1 {
    "Dashboard1" = "Dashboard1",
    "Post1" = "Post1",
    "PostAll1" = "PostAll1",
}

export enum AdminSideMenu2 {
    "Dashboard2" = "Dashboard2",
    "Post2" = "Post2",
    "PostAll2" = "PostAll2",
}

// Convert two enums to objects
const adminSideMenu1 = {
    ...AdminSideMenu1,
}

const adminSideMenu2 = {
    ...AdminSideMenu2,
}

// Merge two objects
const mergedAdminSideMenu = {
    ...adminSideMenu1,
    ...adminSideMenu2,
}

// Convert the merged object to an enum
export const AdminSideMenu = mergedAdminSideMenu as typeof AdminSideMenu1 & typeof AdminSideMenu2
