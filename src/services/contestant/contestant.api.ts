import { message } from "antd";
import Api from "../api";
import { Contestant } from "./contestant.type";
import { setRecoil } from "recoil-nexus";
import ContestantAtom from "./contestant.atom";

const getMe = async () => {
  try {
    const res = await Api.get("v1/contestants/me");
    if (res.status === 200) {
      setRecoil(ContestantAtom.curentContestant, res.data.data);
      return res.data;
    }
    message.error(res.data.message);
    return null;
  } catch (error: any) {
    message.error(error.message);
    return null;
  }
};

const updateContestant = async (data: Partial<Contestant>) => {
  try {
    const res = await Api.patch("v1/contestants", data);
    if (res.status === 200) {
      return res.data;
    }
    message.error(res.data.message);
    return null;
  } catch (error: any) {
    message.error(error.message);
    return error.message;
  }
};

const deleteContestant = async (id: string) => {
  try {
    const res = await Api.delete(`v1/contestants/${id}`);
    if (res.status === 200) {
      return res.data;
    }
    message.error(res.data.message);
    return null;
  } catch (error: any) {
    message.error(error.message);
    return null;
  }
};

const getParticipatedContests = async () => {
  try {
    const res = await Api.get("v1/contestants/participated-contests");
    if (res.status === 200) {
      setRecoil(ContestantAtom.participatedContests, res.data.data);
      return res.data;
    }
    message.error(res.data.message);
    return null;
  } catch (error: any) {
    message.error(error.message);
    return null;
  }
};
export default {
  getMe,
  updateContestant,
  deleteContestant,
  getParticipatedContests,
};
