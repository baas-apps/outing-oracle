import * as Realm from "realm-web";
import {get, writable, derived} from 'svelte/store'
import type {Writable, Readable} from 'svelte/store'

export const app:Writable<Realm.App> = writable(new Realm.App({ id: "outing-oracle-hqdxg"}));
export const user:Readable<Realm.User|null> = derived(app, ($app) => $app ? $app.currentUser : null);
