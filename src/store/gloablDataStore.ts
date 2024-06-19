import { defineStore } from "pinia";
import { MockData } from "../types/mock";

export interface Recording {
    data: MockData[];
    count: number;
    result: string;
    id: string;
    name: string;
}

export const useGlobalDataStore = defineStore("globalData", {
    state: () => ({
        currentRecording: {} as Recording,
    }),
    actions: {
        switchRecording(id: string) {
            const recording = window.data.getRecordings().find((recording) => recording.id === id);
            this.saveCurrentRecording();
            if (recording) {
                console.log(recording);
                this.currentRecording = recording;
            }
        },
        saveCurrentRecording() {
            window.data.setRecordings(this.currentRecording);
        },
        recordingNameList() {
            return window.data.getRecordings().map(item => item.name);
        },
        removeRecording(id: string) {
            window.data.removeRecording(id);
        }
    }
})