import { defineStore } from "pinia";
import { MockData } from "../types/mock";
import { Ref, toRaw } from "vue";

export interface Record {
    data: MockData[];
    count: number;
    result: string;
    id: string;
    name: string;
}

export const useGlobalDataStore = defineStore("globalData", {
    state: () => ({
        currentRecording: {} as Ref<Record>,
    }),
    actions: {
        switchRecord(id: string) {
            const recording = window.data.getRecords().find((recording) => recording.id === id);
            this.saveCurrentRecord();
            if (recording) {
                console.log(recording);
                this.currentRecording = recording;
            }
        },
        saveCurrentRecord() {
            window.data.setRecords(toRaw(this.currentRecording));
        },
        recordNameList() {
            return window.data.getRecords().map(item => item.name);
        },
        removeRecord(id: string) {
            window.data.removeRecord(id);
        }
    }
})