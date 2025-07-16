import { atom } from 'recoil';

// 선택된 도구 모드
export const toolModeAtom = atom({
  key: 'toolModeAtom',
  default: 'select',
});