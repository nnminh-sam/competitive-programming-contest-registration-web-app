import { atom } from "recoil";
import { Contestant } from "./contestant.type";

const curentContestant = atom<Contestant | null>({
  key: "current-contestant",
  default: null,
});
const ContestantAtom = {
  curentContestant,
};

export default ContestantAtom