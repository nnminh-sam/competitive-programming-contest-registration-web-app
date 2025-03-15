import { message } from "antd";
import Api from "../api";
import { GetAffiliationListPayload } from "./affiliation.type";
import { setRecoil } from "recoil-nexus";
import AffiliationAtom from "./affiliation.atom";

const getList = async (params: GetAffiliationListPayload) => {
  try {
    const res = await Api({
      method: "GET",
      url: "v1/affiliations",
      params,
    });

    if (res.status < 300) {
      console.log("🚀 ~ getList ~ res:", res)
      setRecoil(AffiliationAtom.affiliationList, res.data.data);
      return res.data.data;
    }
    return false;
  } catch (error: any) {
    message.error(error.message);
  }
};

export default {
  getList,
};
