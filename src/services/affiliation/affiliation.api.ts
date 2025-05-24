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
      params: {
        ...params,
        orderBy: "name",
        sortBy: "asc",
      },
    });

    if (res.status < 300) {
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
