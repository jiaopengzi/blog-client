// 原始枚举
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

// 将两个枚举转换为对象
const adminSideMenu1 = {
    ...AdminSideMenu1,
}

const adminSideMenu2 = {
    ...AdminSideMenu2,
}

// 合并两个对象
const mergedAdminSideMenu = {
    ...adminSideMenu1,
    ...adminSideMenu2,
}

// 将合并后的对象转换为枚举
export const AdminSideMenu = mergedAdminSideMenu as typeof AdminSideMenu1 & typeof AdminSideMenu2
