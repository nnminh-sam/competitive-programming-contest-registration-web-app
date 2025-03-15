import { atom } from "recoil";
import { Contestant } from "./contestant.type";
import { Contest } from "../contest/contest.type";

const curentContestant = atom<Contestant | null>({
  key: "current-contestant",
  default: null,
});
const participatedContests = atom<Contest[]>({
  key: "participated-contests",
  default: [],
});

const ContestantAtom = {
  curentContestant,
  participatedContests,
};

export default ContestantAtom;
