/**
 * FilePath    : blog-client-dev\src\components\player\components\setting\radio-group\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

export interface RadioOption<T> {
    label?: string
    value: T
}

export interface RadioGroupProps<T> {
    title?: string
    options: RadioOption<T>[]
    modelValue: T
}
