import { atom } from "recoil";
import { Affiliation } from "./affiliation.type";

const affiliationList = atom<Affiliation[] | null>({
  key: "affiliation-list",
  default: [],
});
const AffiliationAtom = {
  affiliationList,
};

export default AffiliationAtom;
