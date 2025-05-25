import { message } from "antd";
import Api from "../api";
import { Team, UpdateTeamPayload } from "./team.type";

interface CreateTeamPayload {
  name: string;
  description: string;
  members: [string, string, string]; // Fixed array of 3 email strings
}

const createTeam = async (data: CreateTeamPayload) => {
  try {
    const response = await Api({
      method: "POST",
      url: "v1/teams",
      data,
    });
    if (response.status === 201) {
      message.success("Team created successfully");
      return { data: response.data, isError: false };
    }
    message.error("Failed to create team");
    return { data: null, isError: true, message: response.data.message };
  } catch (error: any) {
    message.error(error.message);
    return { data: null, isError: true, message: error.message };
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

const updateTeam = async (id: string, data: UpdateTeamPayload) => {
  try {
    const response = await Api({
      method: "PATCH",
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
  createTeam,
  getTeamDetail,
  updateTeam,
  deleteTeam,
};
