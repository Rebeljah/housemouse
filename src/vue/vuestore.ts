import { reactive } from "vue";
import type { Chore, Home, User } from "../firebase/types";


interface MetaModel<T> {
    meta: {
        id: string
    };
    model: T;
}

export const home = reactive<MetaModel<Home>>({
    meta: {id: ''},
    model: {
        name: '',
        chores: [],
        members: [],
        inviteCode: '',
    },
});

export const chores = reactive<MetaModel<Chore>[]>([]);
export const members = reactive<MetaModel<User>[]>([]);

export const user = reactive<MetaModel<User>>({
    meta: {id: ''},
    model: {
        name: '',
        homeId: '',
        isHomeAdmin: '',
    },
});

