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

const registerSingle = async (id: string, contestantId: string) => {
  try {
    const response = await Api({
      method: "POST",
      url: `v1/contests/${id}/register-single`,
      data: {
        contestant_id: contestantId,
      },
    });
    if (response.status < 300) {
      return response.data;
    }
    message.error("Something went wrong.");
  } catch (error: any) {
    message.error(error.message);
  }
};

const registerTeam = async (id: string, teamId: string) => {
  try {
    const response = await Api({
      method: "POST",
      url: `v1/contests/${id}/register-team`,
      data: {
        team_id: teamId,
      },
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
  registerSingle,
  registerTeam,
  getDetail,
};
