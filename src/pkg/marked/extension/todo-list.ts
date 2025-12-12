/**
 * FilePath    : blog-client-dev\src\pkg\marked\extension\todo-list.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : TODO 列表扩展相关配置
 */

export enum TaskListStatus {
    Checked = "task-list-item-checked",
    Unchecked = "task-list-item-unchecked",
}

export type TaskListIcon = Record<TaskListStatus, string>

export const taskListIcon: TaskListIcon = {
    [TaskListStatus.Checked]: `<svg class="task-list-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><path d="M425.984 726.016l384-384-59.99-61.995-324.01 324.011-152.021-152.021L213.973 512zm384-598.016q36.01 0 61.013 25.984T896 213.974v596.01q0 34.005-25.003 59.99t-61.013 25.983h-596.01q-36.011 0-61.014-25.984t-25.003-59.989v-596.01q0-34.006 25.003-59.99T213.973 128h596.011z" fill="#65b73b"/></svg>`,
    [TaskListStatus.Unchecked]: `<svg class="task-list-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><path d="M810.667 213.333v597.334H213.333V213.333h597.334m0-85.333H213.333C166.4 128 128 166.4 128 213.333v597.334C128 857.6 166.4 896 213.333 896h597.334C857.6 896 896 857.6 896 810.667V213.333C896 166.4 857.6 128 810.667 128z" fill="#333333"/></svg>`,
} as const
