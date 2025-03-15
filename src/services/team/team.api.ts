import { message } from "antd";
import Api from "../api";
import { GetTeamListPayload, Team } from "./team.type";

const getList = async (params: GetTeamListPayload) => {
  try {
    const { limit, page, ...rest } = params;
    const response = await Api({
      method: "GET",
      url: "v1/teams",
      params: {
        limit: limit,
        page: page,
        ...rest,
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
const getTeamDetail = async (id: string) => {
  try {
    const response = await Api({
      method: "GET",
      url: `v1/teams/${id}`,
    });
    if (response.status === 200) {
      return response.data;
    }
    message.error("Something went wrong.");
  } catch (error: any) {
    message.error(error.message);
  }
};

const updateTeam = async (id: string, data: Partial<Team>) => {
  try {
    const response = await Api({
      method: "PUT",
      url: `v1/teams/${id}`,
      data,
    });
    if (response.status === 200) {
      return response.data;
    }
    message.error("Something went wrong.");
  } catch (error: any) {
    message.error(error.message);
  }
};

const deleteTeam = async (id: string) => {
  try {
    const response = await Api({
      method: "DELETE",
      url: `v1/teams/${id}`,
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
  getTeamDetail,
  updateTeam,
  deleteTeam,
};

