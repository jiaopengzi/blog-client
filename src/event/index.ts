export type EventType = string | symbol

export type Handler<T = unknown> = (event: T) => void
export type WildcardHandler<T = Record<string, unknown>> = (
    type: keyof T,
    event: T[keyof T],
) => void

export enum EventNames {
    EVENT_ONE = "event_one",
    EVENT_TWO = "event_two",
    // Add other event names here
}

// An array of all currently registered event handlers for a type
export type EventHandlerList<T = unknown> = Array<Handler<T>>
export type WildCardEventHandlerList<T = Record<string, unknown>> = Array<WildcardHandler<T>>

// A map of event types and their corresponding event handlers.
export type EventHandlerMap<Events extends Record<EventType, unknown>> = Map<
    keyof Events | "*",
    EventHandlerList<Events[keyof Events]> | WildCardEventHandlerList<Events>
>

export interface MittOptions {
    enableTriggerSource?: boolean
}

export class MittEmitter<Events extends Record<EventType, unknown> = Record<string, unknown>> {
    private static instance: MittEmitter<Record<string, unknown>>
    private all: EventHandlerMap<Events>
    private enableTriggerSource: boolean

    private constructor(all?: EventHandlerMap<Events>, options?: MittOptions) {
        this.all = all || new Map()
        this.enableTriggerSource = options?.enableTriggerSource ?? false
    }

    public static getInstance<Events extends Record<EventType, unknown>>(
        all?: EventHandlerMap<Events>,
        options?: MittOptions,
    ): MittEmitter<Events> {
        if (!MittEmitter.instance) {
            MittEmitter.instance = new MittEmitter(all, options) as MittEmitter<
                Record<string, unknown>
            >
        }
        return MittEmitter.instance as MittEmitter<Events>
    }

    private getTriggerSource(): string {
        const error = new Error()
        const stack = error.stack?.split("\n")[3] // Adjust the index based on stack structure
        return stack?.trim() || "unknown source"
    }

    on<Key extends keyof Events>(
        type: Key,
        handler: Handler<Events[Key]>,
        triggerSource?: string,
    ): void
    on(type: "*", handler: WildcardHandler<Events>, triggerSource?: string): void
    on<Key extends keyof Events>(
        type: Key | "*",
        handler: Handler<Events[keyof Events]> | WildcardHandler<Events>,
        triggerSource?: string,
    ): void {
        const source = this.enableTriggerSource
            ? triggerSource || this.getTriggerSource()
            : triggerSource
        const handlers: Array<Handler<Events[keyof Events]> | WildcardHandler<Events>> | undefined =
            this.all.get(type)
        const handlerWithSource = {
            handler: handler as Handler<Events[keyof Events]>,
            triggerSource: source,
        }
        if (handlers) {
            handlers.push(handlerWithSource.handler)
        } else {
            this.all.set(type, [handlerWithSource.handler] as EventHandlerList<
                Events[keyof Events]
            >)
        }
    }

    off<Key extends keyof Events>(type: Key, handler?: Handler<Events[Key]>): void
    off(type: "*", handler: WildcardHandler<Events>): void
    off<Key extends keyof Events>(
        type: Key | "*",
        handler?: Handler<Events[keyof Events]> | WildcardHandler<Events>,
    ): void {
        const handlers: Array<Handler<Events[keyof Events]> | WildcardHandler<Events>> | undefined =
            this.all.get(type)
        if (handlers) {
            if (handler) {
                handlers.splice(handlers.indexOf(handler) >>> 0, 1)
            } else {
                this.all.set(type, [])
            }
        }
    }

    emit<Key extends keyof Events>(type: Key, evt?: Events[Key]): void {
        let handlers = this.all.get(type)
        if (handlers) {
            ;(handlers as EventHandlerList<Events[keyof Events]>).slice().map((handler) => {
                handler(evt!)
            })
        }

        handlers = this.all.get("*")
        if (handlers) {
            ;(handlers as WildCardEventHandlerList<Events>).slice().map((handler) => {
                handler(type, evt!)
            })
        }
    }
}
