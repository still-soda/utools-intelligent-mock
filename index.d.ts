import { Recording } from "./src/store/gloablDataStore";
import { MockData } from "./src/types/mock";

declare global {
    interface Window {
      data: {
        requestApi: ({ data, count }: { data: MockData[], count: number }) => Promise<string>;
        setApiData({ appId, appSecret }: { appId: string, appSecret: string }): void;
        getApiData(): { appId: string, appSecret: string } | null;
        getRecordings(): Recording[];
        setRecordings(...recordings: Recording[]): void;
        removeRecording(id: string): void;
      }
    }
  }
   