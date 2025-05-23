import { message } from "antd";
import { GetContestListPayload } from "./contest.type";
import Api from "../api";

const getList = async (params: GetContestListPayload) => {
  try {
    const { limit, page, ...rest } = params;
    const response = await Api({
      method: "GET",
      url: "v1/contests",
      params: {
        limit: limit,
        page: page,
        order_by: "createdAt",
        sort_by: "desc",
        ...rest,
      },
    });
    if (response.status === 200) {
      console.log("🚀 ~ getList ~ response:", response);
      return response.data.data;
    }
    message.error("Something went wrong.");
  } catch (error: any) {
    message.error(error.message);
  }
};

const getDetail = async (id: string) => {
  try {
    const response = await Api({
      method: "GET",
      url: `v1/contests/${id}`,
    });
    if (response.status === 200) {
      return response.data;
    }
    message.error("Something went wrong.");
  } catch (error: any) {
    message.error(error.message);
  }
};

const participate = async (id: string) => {
  try {
    const response = await Api({
      method: "POST",
      url: `v1/contests/${id}/participations`,
    });
    if (response.status < 300) {
      return response.data;
    }
    message.error("Something went wrong.");
  } catch (error: any) {
    message.error(error.message);
  }
};

const getParticipatedContests = async () => {
  try {
    const response = await Api({
      method: "GET",
      url: `v1/contests/participations`,
    });
    if (response.status === 200) {
      return response.data;
    }
    message.error("Something went wrong.");
  } catch (error: any) {
    message.error(error.message);
  }
};

export default {
  getList,
  participate,
  getDetail,
  getParticipatedContests,
};
