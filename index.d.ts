import { Record } from "./src/store/gloablDataStore";
import { MockData } from "./src/types/mock";

declare global {
    interface Window {
      data: {
        requestApi: ({ data, count }: { data: MockData[], count: number }) => Promise<string>;
        setApiData({ apiKey, appSecret }: { apiKey: string, appSecret: string }): void;
        getApiData(): { apiKey: string, appSecret: string } | null;
        getRecords(): Record[];
        setRecords(...recordings: Record[]): void;
        removeRecord(id: string): void;
      },
      openUrl(line: string): void;
    }
  }
   