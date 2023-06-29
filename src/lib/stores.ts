import * as Realm from "realm-web";
import {get, writable} from 'svelte/store'
import type {Writable} from 'svelte/store'


export const app = writable(new Realm.App({ id: "outing-oracle-hqdxg"}));
export const user:Writable<Realm.User|null> = writable();