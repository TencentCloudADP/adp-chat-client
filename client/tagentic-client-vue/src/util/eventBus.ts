import { ref } from "vue"
const bus = ref(new Map())

export default function useEventsBus(){

    function emit(event: string, args: any) {
        bus.value.set(event, args)
    }

    return {
        emit,
        bus
    }
}
