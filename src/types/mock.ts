export type MockType = 'string' | 'number' | 'object' | 'boolean' | 'array';

export interface MockData {
    name: string;
    type: MockType;
    desc: string;
    enable: boolean;
    key: symbol;
}